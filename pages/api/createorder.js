import nodemailer from 'nodemailer';

const item = {
  lead_order_tour: 'lead_order_tour',
};

const validateTurnstile = async (token, remoteip) => {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || !token) {
    return { success: false };
  }
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret,
        response: token,
        remoteip: remoteip || undefined,
      }),
    });
    return response.json();
  } catch (error) {
    /* eslint-disable-next-line */
    console.error('Turnstile validation error:', error);
    return { success: false };
  }
};

const request = async (url = '', data = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error('Bad response');
    })
    .catch((errors) => {
      return { errors };
    });
  return response;
};

const getCaptchaEnabled = async () => {
  try {
    const staticRes = await fetch(
      `${process.env.API}static_data?fields=captcha_enabled&limit=1&filter[status]=published&access_token=${process.env.ACCESS_TOKEN}`
    );
    const staticJson = await staticRes.json();
    const data = staticJson?.data;
    const record = Array.isArray(data) ? data[0] : data;
    return record?.captcha_enabled !== false;
  } catch (e) {
    return true;
  }
};

export default async function handler(req, res) {
  const captchaItems = ['lead_pick_tour', 'lead_request_call'];
  if (captchaItems.includes(req.body?.item) && process.env.TURNSTILE_SECRET_KEY) {
    const captchaEnabled = await getCaptchaEnabled();
    if (captchaEnabled) {
      const captchaToken = req.body?.captchaToken;
      const remoteip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
        || req.headers['x-real-ip']
        || req.socket?.remoteAddress;

      const turnstileResult = await validateTurnstile(captchaToken, remoteip);
      if (!turnstileResult?.success) {
        return res.status(200).json({ ok: false });
      }
    }
  }

  const { captchaToken: _captchaToken, ...requestBody } = req.body || {};
  const result = await request(
    `${process.env.API}${req.body.item}?access_token=${process.env.ACCESS_TOKEN}`,
    requestBody
  );

  if (result.errors) {
    res.status(200).json({
      ok: false,
    });
  }

  try {
    const subject = (req) => {
      switch (req.body.item) {
        case 'certificates':
          return 'Замовлення сертифікату';
        case 'lead':
          return 'Форма з контактів';
        case 'lead_pick_tour':
          return 'Підберіть тур';
        case 'lead_request_call':
          return 'Замовлення дзвінка';
        case 'lead_order_tour':
          return 'Ви замовили тур';

        default:
          return 'error subject';
      }
    };

    const messText = (val) => {
      switch (val.body.item) {
        case 'certificates':
          return `<p>Імʼя: <strong>${val.body?.name}</strong></p>
          <p>Телефон: <strong>${val.body?.phone}</strong></p>
          <p>Сума: <strong>${val.body?.cost}</strong></p>`;
        case 'lead':
          return `<p>Імʼя: <strong>${val.body?.name}</strong></p>
          <p>Телефон: <strong>${val.body?.phone}</strong></p>
          <p>Повідомлення: <strong>${val.body?.text}</strong></p>`;
        case 'lead_pick_tour':
          return `<p>Імʼя: <strong>${val.body?.name}</strong></p>
          <p>Телефон: <strong>${val.body?.phone}</strong></p>
          <p>Повідомлення: <strong>${val.body?.text}</strong></p>
          <p>Відправлено зі сторінки: <strong>${val.body?.url}</strong></p>`;
        case 'lead_request_call':
          return `<p>Телефон: <strong>${val.body?.phone}</strong></p>
          <p>Відправлено зі сторінки: <strong>${val.body?.url}</strong></p>`;
        case 'lead_order_tour':
          return `<p>Країна: <strong>${val.body?.order?.country}</strong></p>
          <p>Курорт (місто): <strong>${val.body?.order?.city}</strong></p>
          <p>Готель: <strong>${val.body?.order?.hotel}</strong></p>
          <p>Кількість зірок: <strong>${val.body?.order?.stars}</strong></p>
          <p>Тривалість туру (ночей): <strong>${val.body?.order?.duration}</strong></p>
          <p>Дати: <strong>${val.body?.order?.dates}</strong></p>
          <p>Транспорт: <strong>${val.body?.order?.transport}</strong></p>
          <p>Номер: <strong>${val.body?.order?.room}</strong></p>
          <p>Харчування: <strong>${val.body?.order?.food}</strong></p>
          <p>К-сть туристів: <strong>${val.body?.order?.people}</strong></p>
          <p>Вартість: <strong>${val.body?.order?.cost}</strong> грн</p>
          <br />
          <p>Замовник: <strong>${val.body?.name}</strong></p>
          <p>Телефон: <strong>${val.body?.phone}</strong></p>
          <p>Пошта: <strong>${val.body?.email}</strong></p>
          <p>Ідентифікатор туру: <strong>${val.body?.order?.id}</strong></p>
          <p>Посилання на тур: <strong>${val.body?.url}</strong></p>`;

        default:
          return 'error message';
      }
    };

    const message = (req) => {
      return `<body
      style="
        margin: 0;
        padding: 0;
        font-family: sans-serif, Arial;
        font-size: 16px;
        color: #53536e;
        background-color: #f6f6f8;
      "
    >
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        width="600"
        style="max-width: 100%; margin: 0 auto"
        bgcolor="#f6f6f8"
      >
        <tr bgcolor="#f6f6f8">
          <td height="70" colspan="2" align="center">
            <a href="https://anex-tour.com.ua/" target="_blank">
              <img
                src="cid:logo"
                style="display: block"
                alt="ANEX Tour"
                width="150"
                height="39"
              />
            </a>
          </td>
        </tr>
        <tr>
          <td
            colspan="2"
            align="center"
            style="
              padding: 25px 10px 25px 10px;
              border-bottom: 1px solid #e5e5eb;
              border-top: 1px solid #e5e5eb;
            "
          >
          ${
            req.body.item === 'lead_order_tour'
              ? `<b style="font-size: 16px">Привіт, ${req.body.name}!</b>
          <br />
          Дякуємо за замовлення туру.<br />
          Менеджер зв'яжеться з вами найближчим часом.
          `
              : ''
          }
          ${req.body.item === 'certificates' ? `<b style="font-size: 16px">Замовлення сертифікату</b>` : ''}
          ${req.body.item === 'lead' ? `<b style="font-size: 16px">Форма зі сторінки контактів</b>` : ''}
          ${req.body.item === 'lead_pick_tour' ? `<b style="font-size: 16px">Підберіть тур</b>` : ''}
          ${req.body.item === 'lead_request_call' ? `<b style="font-size: 16px">Замовлено дзвінок</b>` : ''}
            <br />
          </td>
        </tr>
      </table>
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        width="600"
        style="max-width: 100%; padding: 25px 10px 25px 10px; margin: 0 auto"
        bgcolor="#f6f6f8"
      >
        <tr>
          <td colspan="2" align="left" style="padding-bottom: 10px">
            ${messText(req)}
          </td>
        </tr>
        <tr>
          <td
            colspan="2"
            style="
              text-align: center;
              line-height: 1.5;
              border-top: 1px solid #e5e5eb;
              padding: 25px 10px 25px 10px;
            "
          >
            Пн - Пт: 10:00 – 19:00
            <br />
            Сб: 11:00 – 16:00
            <br />
            03022, м. Київ, вул. Васильківська 32
            <br />
            <a href="tel:+380443384144" style="color: #53536e"
              >+38 044 338 41 44</a
            >
            <br />
            <a href="tel:+380665914144" style="color: #53536e"
              >+38 066 591 41 44</a
            >
            <br />
            <a href="tel:+380965914144" style="color: #53536e"
              >+38 096 591 41 44</a
            >
            <br />
            <a href="tel:+380635914144" style="color: #53536e"
              >+38 063 591 41 44
            </a>
            <br />
            <a href="mailto:agency@anex-tour.com.ua" style="color: #53536e">
              agency@anex-tour.com.ua
            </a>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="text-align: center">
            <a
              target="_blank"
              href="https://t.me/ua_anextour"
              style="text-decoration: none"
            >
              <img
              src="cid:telegram"
                alt="Telegram"
                width="37"
                height="37"
                style="display: inline-block; margin: 0 15px 0 15px"
              />
            </a>
            <a
              target="_blank"
              href="viber://chat?number=0635914144"
              style="text-decoration: none"
            >
              <img
              src="cid:viber"
                alt="Viber"
                width="37"
                height="37"
                style="display: inline-block; margin: 0 15px 0 15px"
              />
            </a>
          </td>
        </tr>
      </table>
    </body>`;
    };

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_SENDER,
        pass: process.env.MAIL_SENDER_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_SENDER,
      // to: 'andrey.kallko@gmail.com, touragency123@gmail.com',
      to: process.env.MAIL_TARGET,
      subject: subject(req),
      html: message(req),
      attachments: [
        {
          filename: 'f9a093d7-c9f7-4d7c-94af-70129d39bf0d.png',
          path: 'https://anex-tour.com.ua/directus/assets/f9a093d7-c9f7-4d7c-94af-70129d39bf0d.png',
          cid: 'logo',
        },
        {
          filename: '5e13d5de-7561-4120-b0a7-cc24f11197d1.png',
          path: 'https://anex-tour.com.ua/directus/assets/5e13d5de-7561-4120-b0a7-cc24f11197d1.png',
          cid: 'viber',
        },
        {
          filename: '654f7c47-18ea-4583-865a-3c831b313df8.png',
          path: 'https://anex-tour.com.ua/directus/assets/654f7c47-18ea-4583-865a-3c831b313df8.png',
          cid: 'telegram',
        },
      ],
    });

    if (req?.body?.email) {
      await transporter.sendMail({
        from: process.env.MAIL_SENDER,
        to: req.body.email,
        subject: subject(req),
        html: message(req),
        attachments: [
          {
            filename: 'f9a093d7-c9f7-4d7c-94af-70129d39bf0d.png',
            path: 'https://anex-tour.com.ua/directus/assets/f9a093d7-c9f7-4d7c-94af-70129d39bf0d.png',
            cid: 'logo',
          },
          {
            filename: '5e13d5de-7561-4120-b0a7-cc24f11197d1.png',
            path: 'https://anex-tour.com.ua/directus/assets/5e13d5de-7561-4120-b0a7-cc24f11197d1.png',
            cid: 'viber',
          },
          {
            filename: '654f7c47-18ea-4583-865a-3c831b313df8.png',
            path: 'https://anex-tour.com.ua/directus/assets/654f7c47-18ea-4583-865a-3c831b313df8.png',
            cid: 'telegram',
          },
        ],
      });
    }
  } catch (error) {
    /* eslint-disable-next-line */
    console.log('error', error);
  }

  res.status(200).json({
    ok: true,
  });
}
