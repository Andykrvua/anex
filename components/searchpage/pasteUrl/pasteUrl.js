export default async function parseUrl(router) {
  // шукаємо країну
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
  const isCountrySearched = isCountry.countries.filter(
    (item) => item.id === Number(router.query.to)
  );
  console.log('searched', isCountrySearched);

  if (isCountrySearched.length === 1) {
    // країну знайдено
    console.log('країну знайдено', isCountrySearched);
  } else if (isCountrySearched.length > 1) {
    console.log('error');
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

    const isDistrictSearched = isDistrict.geo.filter((item) => {
      if (item.id === Number(router.query.to)) {
        return item;
      } else if (item.children && item.children.length) {
        return item.children.map((child) => {
          if (child.id === Number(router.query.to)) {
            return child;
          } else if (child.children && child.children.length) {
            return child.children.map(
              (distr) => distr === Number(router.query.to)
            );
          }
        });
      }
    });
    console.log('isDistrictSearched', new Set(isDistrictSearched.flat()));
    console.log('isDistrictSearched', isDistrictSearched);
    if (isDistrictSearched.length === 1) {
      // дістрікт знайдено
      console.log('дістрікт знайдено', isDistrictSearched);
    } else if (isDistrictSearched.length > 1) {
      console.log('error');
    } else {
      // це не країна і не дістрікт шукаємо готель
      const isHotel = await fetch(
        `https://api.otpusk.com/api/2.6/tours/hotels?countryId=${router.query.country}&access_token=337da-65e22-26745-a251f-77b9e`
      ).then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      });
      console.log('isHotel', isHotel);
      const isHotelSearched = isHotel.hotels.filter(
        (item) => item.id === Number(router.query.to)
      );

      if (isHotelSearched.length === 1) {
        //готель знайдено
        console.log('isHotelSearched', isHotelSearched);
      } else if (isHotelSearched.length > 1) {
        console.log('error');
      } else {
        console.log('error');
      }
    }
  }

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
