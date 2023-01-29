const searchTo = async (router) => {
  const isCountry = await fetch(
    `https://api.otpusk.com/api/2.6/tours/countries?access_token=337da-65e22-26745-a251f-77b9e`
  ).then((response) => {
    if (response.status === 200) {
      return response.json();
    }
    return null;
  });

  console.log('router.query.to', router.query.to);
  console.log('isCountry', isCountry);
  if (!isCountry) return null;
  const isCountrySearched = isCountry.countries.filter(
    (item) => item.id === Number(router.query.to)
  );
  console.log('searched', isCountrySearched);

  if (isCountrySearched.length === 1) {
    // країну знайдено
    console.log('країну знайдено', isCountrySearched);

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
    console.log('error');
    return null;
  } else {
    // це не країна, шукаємо дістрікт
    const isDistrict = await fetch(
      `https://api.otpusk.com/api/2.6/tours/geotree?id=${router.query.country}&depth=district&access_token=337da-65e22-26745-a251f-77b9e`
    ).then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    });

    console.log('isDistrict', isDistrict);
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
    console.log('isDistrictSearched', isDistrictSearched);
    if (isDistrictSearched.length === 1) {
      // дістрікт знайдено
      console.log('дістрікт знайдено', isDistrictSearched);

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
      console.log('error');
      return null;
    } else {
      // це не країна і не дістрікт шукаємо готель
      const isHotel = await fetch(
        `https://api.otpusk.com/api/2.6/tours/hotel?hotelId=${router.query.to}&access_token=337da-65e22-26745-a251f-77b9e`
      ).then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      });

      if (isHotel) {
        //готель знайдено
        console.log('готель знайдено', isHotel.hotel);

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
        console.log('error');
        return null;
      }
    }
  }
};

const searchFrom = async (router) => {
  const search = await fetch(
    `/api/endpoints/fromcities?geoId=${router.query.to}`
  ).then((response) => {
    if (response.status === 200) {
      return response.json();
    }
    return null;
  });

  if (search?.ok) {
    console.log('aaaa', search.result.fromCities);
    search.result.fromCities;
    const searchedFrom = search.result.fromCities.filter(
      (item) => item.id === router.query.from
    );
    console.log('bbbb', searchedFrom);
    const res = { name: searchedFrom[0].name, value: searchedFrom[0].id };
    return res;
  }

  return null;
};

const searchDate = (router) => {
  const date1 = new Date(router.query.checkIn);
  const date2 = new Date(router.query.checkTo);

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Calculating the time difference between two dates
  const diffInTime = date2.getTime() - date1.getTime();

  // Calculating the no. of days between two dates
  const plusDays = Math.round(diffInTime / oneDay);

  return { rawDate: new Date(router.query.checkIn).toISOString(), plusDays };
};

export default async function parseUrl(router) {
  console.log(router);

  const to = await searchTo(router);
  const from = await searchFrom(router);
  // const date = searchDate(router);
  // console.log('date', date);

  console.log('to result', to);

  return {
    to,
    from,
    nights: router.query.nights,
    nightsTo: router.query.nightsTo,
    // date,
  };

  // router.push({
  //   pathname: '/search',
  //   query: {
  //     transport: router.query.transport,
  //     from: router.query.from,
  //     to: router.query.to,
  //     checkIn: router.query.checkIn,
  //     checkTo: router.query.checkTo,
  //     nights: router.query.nights,
  //     nightsTo: router.query.nightsTo,
  //     people: router.query.people,
  //   },
  // });
}
