const allCountry = {
  countries: [
    {
      id: 8,
      iso: 'at',
      name: 'Австрия',
    },
    {
      id: 6,
      iso: 'az',
      name: 'Азербайджан',
    },
    {
      id: 10,
      iso: 'al',
      name: 'Албания',
    },
    {
      id: 3,
      iso: 'ad',
      name: 'Андорра',
    },
    {
      id: 4,
      iso: 'am',
      name: 'Армения',
    },
    {
      id: 5,
      iso: 'aw',
      name: 'Аруба',
    },
    {
      id: 17,
      iso: 'be',
      name: 'Бельгия',
    },
    {
      id: 13,
      iso: 'bg',
      name: 'Болгария',
    },
    {
      id: 14,
      iso: 'br',
      name: 'Бразилия',
    },
    {
      id: 27,
      iso: 'gb',
      name: 'Великобритания',
    },
    {
      id: 26,
      iso: 'hu',
      name: 'Венгрия',
    },
    {
      id: 29,
      iso: 'vn',
      name: 'Вьетнам',
    },
    {
      id: 36,
      iso: 'de',
      name: 'Германия',
    },
    {
      id: 34,
      iso: 'gr',
      name: 'Греция',
    },
    {
      id: 33,
      iso: 'ge',
      name: 'Грузия',
    },
    {
      id: 40,
      iso: 'dk',
      name: 'Дания',
    },
    {
      id: 42,
      iso: 'do',
      name: 'Доминикана',
    },
    {
      id: 43,
      iso: 'eg',
      name: 'Египет',
    },
    {
      id: 52,
      iso: 'il',
      name: 'Израиль',
    },
    {
      id: 46,
      iso: 'in',
      name: 'Индия',
    },
    {
      id: 47,
      iso: 'id',
      name: 'Индонезия',
    },
    {
      id: 53,
      iso: 'jo',
      name: 'Иордания',
    },
    {
      id: 51,
      iso: 'is',
      name: 'Исландия',
    },
    {
      id: 49,
      iso: 'es',
      name: 'Испания',
    },
    {
      id: 48,
      iso: 'it',
      name: 'Италия',
    },
    {
      id: 166,
      iso: 'qa',
      name: 'Катар',
    },
    {
      id: 60,
      iso: 'ke',
      name: 'Кения',
    },
    {
      id: 54,
      iso: 'cy',
      name: 'Кипр',
    },
    {
      id: 58,
      iso: 'cn',
      name: 'Китай',
    },
    {
      id: 56,
      iso: 'cu',
      name: 'Куба',
    },
    {
      id: 67,
      iso: 'lv',
      name: 'Латвия',
    },
    {
      id: 69,
      iso: 'lt',
      name: 'Литва',
    },
    {
      id: 84,
      iso: 'mu',
      name: 'Маврикий',
    },
    {
      id: 78,
      iso: 'my',
      name: 'Малайзия',
    },
    {
      id: 79,
      iso: 'mv',
      name: 'Мальдивы',
    },
    {
      id: 73,
      iso: 'mt',
      name: 'Мальта',
    },
    {
      id: 75,
      iso: 'ma',
      name: 'Марокко',
    },
    {
      id: 80,
      iso: 'mx',
      name: 'Мексика',
    },
    {
      id: 32,
      iso: 'nl',
      name: 'Нидерланды',
    },
    {
      id: 91,
      iso: 'no',
      name: 'Норвегия',
    },
    {
      id: 92,
      iso: 'ae',
      name: 'ОАЭ',
    },
    {
      id: 93,
      iso: 'om',
      name: 'Оман',
    },
    {
      id: 98,
      iso: 'pl',
      name: 'Польша',
    },
    {
      id: 99,
      iso: 'pt',
      name: 'Португалия',
    },
    {
      id: 77,
      iso: 'mk',
      name: 'Северная Македония',
    },
    {
      id: 104,
      iso: 'sc',
      name: 'Сейшельские о-ва',
    },
    {
      id: 138,
      iso: 'rs',
      name: 'Сербия',
    },
    {
      id: 106,
      iso: 'sg',
      name: 'Сингапур',
    },
    {
      id: 108,
      iso: 'sk',
      name: 'Словакия',
    },
    {
      id: 109,
      iso: 'si',
      name: 'Словения',
    },
    {
      id: 113,
      iso: 'th',
      name: 'Таиланд',
    },
    {
      id: 152,
      iso: 'tz',
      name: 'Танзания',
    },
    {
      id: 114,
      iso: 'tn',
      name: 'Тунис',
    },
    {
      id: 115,
      iso: 'tr',
      name: 'Турция',
    },
    {
      id: 116,
      iso: 'ua',
      name: 'Украина',
    },
    {
      id: 55,
      iso: 'ur',
      name: 'Украина - Карпаты',
    },
    {
      id: 120,
      iso: 'ph',
      name: 'Филиппины',
    },
    {
      id: 121,
      iso: 'fi',
      name: 'Финляндия',
    },
    {
      id: 119,
      iso: 'fr',
      name: 'Франция',
    },
    {
      id: 134,
      iso: 'hr',
      name: 'Хорватия',
    },
    {
      id: 135,
      iso: 'me',
      name: 'Черногория',
    },
    {
      id: 122,
      iso: 'cz',
      name: 'Чехия',
    },
    {
      id: 126,
      iso: 'se',
      name: 'Швеция',
    },
    {
      id: 125,
      iso: 'lk',
      name: 'Шри-Ланка',
    },
    {
      id: 128,
      iso: 'ee',
      name: 'Эстония',
    },
    {
      id: 132,
      iso: 'jm',
      name: 'Ямайка',
    },
    {
      id: 133,
      iso: 'jp',
      name: 'Япония',
    },
  ],
};
