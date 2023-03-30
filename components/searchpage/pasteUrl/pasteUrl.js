// todo ru and ua
// todo fetch hide token

const searchTo = async (router) => {
  if (!router.query.to || !router.query.to.length) return null;

  const isCountry = await fetch(
    `https://api.otpusk.com/api/2.6/tours/countries?access_token=337da-65e22-26745-a251f-77b9e`
  ).then((response) => {
    if (response.status === 200) {
      return response.json();
    }
    return null;
  });

  if (!isCountry) return null;
  const isCountrySearched = isCountry.countries.filter(
    (item) => item.id === Number(router.query.to)
  );

  if (isCountrySearched.length === 1) {
    const code = {
      district: false,
      hotel: false,
      img: `/assets/img/svg/flags/code/${isCountrySearched[0].code}.svg`,
    };
    const res = {
      name: isCountrySearched[0].name,
      value: isCountrySearched[0].id,
      countryValue: isCountrySearched[0].id,
      code,
    };
    return res;
  } else if (isCountrySearched.length > 1) {
    return null;
  } else {
    const isDistrict = await fetch(
      `https://api.otpusk.com/api/2.6/tours/geotree?id=${router.query.country}&depth=district&access_token=337da-65e22-26745-a251f-77b9e`
    ).then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    });

    if (!isDistrict) return null;
    const isDistrictSearched = [];
    isDistrict.geo.map((item) => {
      if (item.id === Number(router.query.to)) {
        isDistrictSearched.push(item);
      } else if (item.children && item.children.length) {
        return item.children.map((child) => {
          if (child.id === Number(router.query.to)) {
            isDistrictSearched.push(child);
          } else if (child.children && child.children.length) {
            return child.children.map((distr) => {
              if (distr.id === Number(router.query.to)) {
                isDistrictSearched.push(distr);
              }
            });
          }
        });
      }
    });

    if (isDistrictSearched.length === 1) {
      const code = {
        district: true,
        hotel: false,
        img: `/assets/img/svg/search_suggests/map-marker.svg`,
      };
      const res = {
        name: isDistrictSearched[0].name,
        value: isDistrictSearched[0].id,
        countryValue: router.query.country,
        code,
      };
      return res;
    } else if (isDistrictSearched.length > 1) {
      return null;
    } else {
      const isHotel = await fetch(
        `https://api.otpusk.com/api/2.6/tours/hotel?hotelId=${router.query.to}&access_token=337da-65e22-26745-a251f-77b9e`
      ).then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      });

      if (isHotel) {
        const code = {
          district: false,
          hotel: true,
          img: `https://newimg.otpusk.com/3/60x60/${isHotel.hotel.fh[0].src}`,
        };

        const res = {
          name: isHotel.hotel.n,
          value: isHotel.hotel.i,
          countryValue: router.query.country,
          code,
        };
        return res;
      } else {
        return null;
      }
    }
  }
};

const searchFrom = async (router, loc) => {
  // if (!router.query.from || !router.query.from.length) return null;

  if (!router.query.from) {
    return {
      name: 'Без транспорта',
      value: '',
      transport: 'no',
    };
  }

  const search = await fetch(
    `/api/endpoints/fromcities?geoId=${router.query.to}&locale=${loc}`
  ).then((response) => {
    if (response.status === 200) {
      return response.json();
    }
    return null;
  });

  if (search?.ok) {
    const searchedFrom = search.result.fromCities.filter(
      (item) => item.id === Number(router.query.from)
    );

    if (!searchedFrom.length) return null;
    const res = {
      name: searchedFrom[0].name,
      value: searchedFrom[0].id,
      transport: searchedFrom[0].transport[0],
    };
    return res;
  }

  return null;
};

const searchDate = (router) => {
  if (
    !router.query.checkIn ||
    !router.query.checkIn.length ||
    !router.query.checkTo ||
    !router.query.checkTo.length
  )
    return null;
  const date1 = new Date(router.query.checkIn);
  const date2 = new Date(router.query.checkTo);

  if (!date1 || !date2) return null;

  const oneDay = 1000 * 60 * 60 * 24;

  const diffInTime = date2.getTime() - date1.getTime();

  const plusDays = Math.round(diffInTime / oneDay);

  return { rawDate: new Date(router.query.checkIn), plusDays };
};

const searchPeople = (router) => {
  if (!router.query.people || !router.query.people.length) return null;
  const str = router.query.people;
  const str_length = router.query.people.length;

  const adult = Number(str[0]);
  const childTemp = str_length - 1;
  const child = childTemp === 0 ? 0 : childTemp / 2;
  let childAge = [];
  if (childTemp === 0) {
    childAge = [0, 0, 0, 0];
  } else {
    childAge = [
      str[2] ? Number(str[1] === '0' ? str[2] : str[1] + str[2]) : 0,
      str[4] ? Number(str[3] === '0' ? str[4] : str[3] + str[4]) : 0,
      str[6] ? Number(str[5] === '0' ? str[6] : str[5] + str[6]) : 0,
      str[8] ? Number(str[7] === '0' ? str[8] : str[7] + str[8]) : 0,
    ];
  }
  return { adult, child, childAge };
};

export default async function parseUrl(router, loc) {
  const to = await searchTo(router);
  console.log('to', to);
  const from = await searchFrom(router, loc);
  console.log('from', from);
  const nights = Number(router.query.nights)
    ? Number(router.query.nights)
    : null;
  const nightsTo = Number(router.query.nightsTo)
    ? Number(router.query.nightsTo)
    : null;
  const date = searchDate(router);
  const people = searchPeople(router);
  const transport = router.query.transport;

  if (!to || !from || !nights || !nightsTo || !date || !people) return null;

  return {
    to,
    from,
    transport,
    nights,
    nightsTo,
    date,
    people,
  };
}
