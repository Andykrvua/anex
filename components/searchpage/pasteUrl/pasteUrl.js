export default async function parseUrl(router) {
  // ищем страну
  const isCountry = await fetch(
    `https://api.otpusk.com/api/2.6/tours/countries?access_token=337da-65e22-26745-a251f-77b9e`
  ).then((response) => {
    if (response.status === 200) {
      return response.json();
    }
    return null;
  });

  if (isCountry) {
    console.log('isCountry', isCountry);
    console.log('router.query.to', router.query.to);
    let isCountrySearched = isCountry.countries.filter(
      (item) => item.id === Number(router.query.to)
    );
    console.log('searched', isCountrySearched);

    if (!isCountrySearched.length) {
      // это не страна, ищем дальше
      const isDistrict = await fetch(
        `https://api.otpusk.com/api/2.6/tours/geotree?id=${router.query.country}&depth=district&access_token=337da-65e22-26745-a251f-77b9e`
      ).then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      });

      if (!isDistrict.geo.length) console.log('isDistrict', isDistrict);
    }
  }
  // const search = await fetch(
  //   `/api/endpoints/fromcities?geoId=${down.value}`
  // ).then((response) => {
  //   if (response.status === 200) {
  //     return response.json();
  //   }
  //   return null;
  // });

  // if (search?.ok) {
  //   setUpPointList({
  //     active: true,
  //     list: search.result.fromCities,
  //   });
  // }

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
