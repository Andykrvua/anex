/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        fs: false,
        path: false,
        os: false,
        process: false,
      },
    };
    return config;
  },
  i18n: {
    locales: ['ru', 'uk'],
    defaultLocale: 'ru',
  },
  images: {
    domains: ['anex-tour.com.ua', 'newimg.otpusk.com'],
  },
  async redirects() {
    return [
      {
        source: '/ukr/krainy/azerbaidzhan/',
        destination: '/uk/countries/azerbaijan/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/albaniia/',
        destination: '/uk/countries/albaniya/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/andorra/',
        destination: '/uk/countries/andorra/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/bolhariia/',
        destination: '/uk/countries/bulgaria/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/vietnam/',
        destination: '/uk/countries/vetnam/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/hretsiia/',
        destination: '/uk/countries/greece/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/hruziia/',
        destination: '/uk/countries/georgia/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/dominikana/',
        destination: '/uk/countries/dominician-republic/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/yehypet/',
        destination: '/uk/countries/egypt/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/izrail/',
        destination: '/uk/countries/israel/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/indiya/',
        destination: '/uk/countries/india/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/indoneziia/',
        destination: '/uk/countries/indonesia/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/ispaniia/',
        destination: '/uk/countries/spain/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/italiia/',
        destination: '/uk/countries/italy/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/yordaniia/',
        destination: '/uk/countries/iordaniya/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/katar/',
        destination: '/uk/countries/katar/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/kipr/',
        destination: '/uk/countries/cyprus/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/kytai/',
        destination: '/uk/countries/china/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/kuba/',
        destination: '/uk/countries/cuba/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/mavrykii/',
        destination: '/uk/countries/mauritius/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/maldivy/',
        destination: '/uk/countries/maldives/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/malta/',
        destination: '/uk/countries/malta/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/marokko/',
        destination: '/uk/countries/marokko/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/meksyka/',
        destination: '/uk/countries/meksika/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/oae/',
        destination: '/uk/countries/uae/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/seishely/',
        destination: '/uk/countries/seychelles/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/sinhapur/',
        destination: '/uk/countries/singapur/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/portuhaliia/',
        destination: '/uk/countries/portugal/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/tailand/',
        destination: '/uk/countries/thailand/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/tanzaniia/',
        destination: '/uk/countries/tanzania/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/tunis/',
        destination: '/uk/countries/tunisia/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/',
        destination: '/uk/countries/turkey/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/uhorshchyna/',
        destination: '/uk/countries/vengriya/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/frantsiia/',
        destination: '/uk/countries/frantsiya/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/khorvatiia/',
        destination: '/uk/countries/croatia/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/chornohoriia/',
        destination: '/uk/countries/montenegro/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/chekhiia/',
        destination: '/uk/countries/czech-republic/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/shveitsariia/',
        destination: '/uk/countries/switzerland/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/shri-lanka/',
        destination: '/uk/countries/sri-lanka/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/',
        destination: '/uk/countries/',
        permanent: true,
      },
      { source: '/ukr/', destination: '/uk/', permanent: true },
      { source: '/ukr/vidhuky/', destination: '/uk/reviews/', permanent: true },
      {
        source: '/ukr/pytannia-vidpovid/',
        destination: '/uk/faq/',
        permanent: true,
      },
      {
        source: '/ukr/kontakty/',
        destination: '/uk/contacts/',
        permanent: true,
      },
      {
        source: '/ukr/podarunkovi-sertyfikaty/',
        destination: '/uk/podarochnye-sertifikaty/',
        permanent: true,
      },
      { source: '/ukr/tury/', destination: '/uk/tours/', permanent: true },
      {
        source: '/ukr/krainy/albaniia/tur-v-vloru/',
        destination: '/uk/countries/albaniya/tur-vlera/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/albaniia/tur-v-durres/',
        destination: '/uk/countries/albaniya/tur-durres/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/albaniia/tur-v-dermi/',
        destination: '/uk/countries/albaniya/tur-dermi/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/albaniia/tur-v-ksamil/',
        destination: '/uk/countries/albaniya/tur-ksamil/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/albaniia/tur-v-sarandu/',
        destination: '/uk/countries/albaniya/tur-saranda/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/albaniia/tur-v-tyranu/',
        destination: '/uk/countries/albaniya/tur-tirana/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/andorra/tury-v-andorra-la-veliu/',
        destination: '/uk/countries/andorra/tur-andorra-la-vella/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/bolhariia/tury-v-albenu/',
        destination: '/uk/countries/bulgaria/tur-albena/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/bolhariia/tury-v-varnu/',
        destination: '/uk/countries/bulgaria/tur-varna/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/bolhariia/tury-v-zoloti-pisky/',
        destination: '/uk/countries/bulgaria/tur-zolotye-peski/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/bolhariia/tury-v-nesebr/',
        destination: '/uk/countries/bulgaria/tur-nesebr/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/bolhariia/tury-v-sozopol/',
        destination: '/uk/countries/bulgaria/tur-sozopol/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/bolhariia/tury-v-soniachnyi-bereh/',
        destination: '/uk/countries/bulgaria/tur-solnechnyj-bereg/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/bolhariia/tury-v-burhas/',
        destination: '/uk/countries/bulgaria/tur-burgas/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/vietnam/tury-v-niachanh/',
        destination: '/uk/countries/vetnam/tur-nyachang/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/vietnam/tury-v-fanranh/',
        destination: '/uk/countries/vetnam/tur-fanrang/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/vietnam/tury-v-fantiet/',
        destination: '/uk/countries/vetnam/tur-fantet/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/vietnam/tury-v-fukuok/',
        destination: '/uk/countries/vetnam/tur-fukuok/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/hretsiia/tury-v-afiny/',
        destination: '/uk/countries/greece/tur-afiny/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/hretsiia/tury-v-korfu/',
        destination: '/uk/countries/greece/tur-korfu/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/hretsiia/tury-na-kryt/',
        destination: '/uk/countries/greece/tur-krit/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/hretsiia/tury-v-lutraki/',
        destination: '/uk/countries/greece/tur-lutraki/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/hretsiia/tury-v-peloponnes/',
        destination: '/uk/countries/greece/tur-peloponnes/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/hretsiia/tury-v-rodos/',
        destination: '/uk/countries/greece/tur-rodos/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/hretsiia/tury-v-saloniky/',
        destination: '/uk/countries/greece/tur-saloniki/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/hretsiia/tury-v-khalkidiky/',
        destination: '/uk/countries/greece/tur-halkidiki/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/hruziia/tury-v-batumi/',
        destination: '/uk/countries/georgia/tur-batumi/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/hruziia/tury-v-svanetiiu/',
        destination: '/uk/countries/georgia/tur-svanetiya/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/hruziia/tury-v-tbilisi/',
        destination: '/uk/countries/georgia/tur-tbilisi/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/dominikana/tury-v-baiiaibe/',
        destination: '/uk/countries/dominician-republic/tur-bayahibe/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/dominikana/tury-v-boka-chika/',
        destination: '/uk/countries/dominician-republic/tur-bocachica/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/dominikana/tury-v-kap-kana/',
        destination: '/uk/countries/dominician-republic/tur-kap-kana/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/dominikana/tury-v-la-romana/',
        destination: '/uk/countries/dominician-republic/tur-la-romana/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/dominikana/tury-v-puerto-plata/',
        destination: '/uk/countries/dominician-republic/tur-puerto-plata/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/dominikana/tury-v-puerto-plata/tury-v-kabarete/',
        destination:
          '/uk/countries/dominician-republic/tur-puerto-plata/tur-kabarete/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/dominikana/tury-v-puerto-plata/tury-v-sosua/',
        destination:
          '/uk/countries/dominician-republic/tur-puerto-plata/tur-sosua/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/dominikana/tury-v-punta-kanu/',
        destination: '/uk/countries/dominician-republic/tur-puntacana/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/dominikana/tury-v-samanu/',
        destination: '/uk/countries/dominician-republic/tur-samana/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/dominikana/tury-v-santo-dominho/',
        destination: '/uk/countries/dominician-republic/tur-santo-domingo/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/dominikana/tury-v-uvero-alto/',
        destination: '/uk/countries/dominician-republic/tur-uvero-alto/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/dominikana/tury-v-khuan-dolio/',
        destination: '/uk/countries/dominician-republic/tur-khuan-dolio/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/yehypet/tury-v-dakhab/',
        destination: '/uk/countries/egypt/tur-dahab/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/yehypet/tury-v-el-hunu/',
        destination: '/uk/countries/egypt/tur-el-guna/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/yehypet/tury-v-kair/',
        destination: '/uk/countries/egypt/tur-kair/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/yehypet/tury-v-makadi-bei/',
        destination: '/uk/countries/egypt/tur_makadi_bay/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/yehypet/tury-v-marsa-alam/',
        destination: '/uk/countries/egypt/tur_marsa_alam/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/yehypet/tury-v-nuveibu/',
        destination: '/uk/countries/egypt/tur-nuveyba/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/yehypet/tury-v-safahu/',
        destination: '/uk/countries/egypt/tur-safaga/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/yehypet/tury-v-sahl-khashysh/',
        destination: '/uk/countries/egypt/tur-sahl-hasheesh/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/yehypet/tury-v-soma-bei/',
        destination: '/uk/countries/egypt/tur_soma_bay/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/yehypet/tury-v-tabu/',
        destination: '/uk/countries/egypt/tur-taba/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/yehypet/tury-v-khurhadu/',
        destination: '/uk/countries/egypt/tur-hurgada/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/yehypet/tury-v-sharm-el-sheikh/',
        destination: '/uk/countries/egypt/tur_sharm_el_sheyh/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/indoneziia/tury-na-bali/',
        destination: '/uk/countries/indonesia/tur-bali/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/indoneziia/tury-na-bali/tury-v-dzhymbaran/',
        destination: '/uk/countries/indonesia/tur-bali/tur-dzhimbaran/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/indoneziia/tury-na-bali/tury-v-kutu/',
        destination: '/uk/countries/indonesia/tur-bali/tur-kuta/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/indoneziia/tury-na-bali/tury-v-nusa-dua/',
        destination: '/uk/countries/indonesia/tur-bali/tur-nusa-dua/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/indoneziia/tury-na-bali/tury-v-sanur/',
        destination: '/uk/countries/indonesia/tur-bali/tur-sanur/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/indoneziia/tury-na-bali/tury-v-seminiak/',
        destination: '/uk/countries/indonesia/tur-bali/tur-seminyak/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/indoneziia/tury-na-bali/tury-v-tanzhunh-benoa/',
        destination: '/uk/countries/indonesia/tur-bali/tur-tandzhung-benoa/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/indoneziia/tury-v-dzhakartu/',
        destination: '/uk/countries/indonesia/tur-dzhakarta/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/ispaniia/tury-v-barselonu/',
        destination: '/uk/countries/spain/tur-barselona/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/ispaniia/tury-v-kosta-brava/',
        destination: '/uk/countries/spain/tur-kosta-brava/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/ispaniia/tury-v-kosta-de-barselona/',
        destination: '/uk/countries/spain/tur-kosta-de-barselona/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/ispaniia/tury-v-kosta-dorada/',
        destination: '/uk/countries/spain/tur-kosta-dorada/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/ispaniia/tury-v-maiorku/',
        destination: '/uk/countries/spain/tur-mayorka/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/italiia/tury-v-venetsiiu/',
        destination: '/uk/countries/italy/tur-veneciya/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/italiia/tury-v-milan/',
        destination: '/uk/countries/italy/tur-milan/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/italiia/tury-v-rym/',
        destination: '/uk/countries/italy/tur-rim/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/italiia/tury-v-rimini/',
        destination: '/uk/countries/italy/tur-rimini/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/italiia/tury-v-sardyniiu/',
        destination: '/uk/countries/italy/tur-sardiniya/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/italiia/tury-v-sytsyliiu/',
        destination: '/uk/countries/italy/tur-siciliya/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/italiia/tury-v-florentsiiu/',
        destination: '/uk/countries/italy/tur-florenciya/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/katar/tury-v-dokhu/',
        destination: '/uk/countries/katar/tur-doha/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/kipr/tury-v-aiia-napu/',
        destination: '/uk/countries/cyprus/tur_ayja_napa/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/kipr/tury-v-larnaku/',
        destination: '/uk/countries/cyprus/tur-larnaka/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/kipr/tury-v-limassol/',
        destination: '/uk/countries/cyprus/tur-limassol/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/kipr/tury-v-pafos/',
        destination: '/uk/countries/cyprus/tur-pafos/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/kipr/tury-v-protaras/',
        destination: '/uk/countries/cyprus/tur-protaras/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/kytai/tury-v-khainan/',
        destination: '/uk/countries/china/tur-haynan/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/kuba/tury-v-varadero/',
        destination: '/uk/countries/cuba/tur-varadero/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/kuba/tury-v-havanu/',
        destination: '/uk/countries/cuba/tur-gavana/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/kuba/tury-v-kaio-koko/',
        destination: '/uk/countries/cuba/tur-kayo-koko/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/kuba/tury-v-kaio-larho/',
        destination: '/uk/countries/cuba/tur-kayo-largo/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/kuba/tury-v-olhin/',
        destination: '/uk/countries/cuba/tur-olgin/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/kuba/tury-v-santa-mariia/',
        destination: '/uk/countries/cuba/tur-santa-mariya/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/kuba/tury-v-santiaho-de-kuba/',
        destination: '/uk/countries/cuba/tur-santyago-de-kuba/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/kuba/tury-v-trynidad/',
        destination: '/uk/countries/cuba/trinidad/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/mavrykii/tury-v-port-lui/',
        destination: '/uk/countries/mauritius/tur-port-lui/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/maldivy/tury-v-addu-atol/',
        destination: '/uk/countries/maldives/tur-addu-atoll/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/maldivy/tury-v-ari-atol/',
        destination: '/uk/countries/maldives/tur-ari-atoll/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/maldivy/tury-v-baa-atol/',
        destination: '/uk/countries/maldives/tur-baa-atoll/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/maldivy/tury-v-vaavu-atol/',
        destination: '/uk/countries/maldives/tur-vaavu-atoll/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/maldivy/tury-v-haafu-atol/',
        destination: '/uk/countries/maldives/tur-gaafu-atoll/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/maldivy/tury-v-daalu-atol/',
        destination: '/uk/countries/maldives/tur-dhaaluatoll/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/maldivy/tury-v-laamu-atol/',
        destination: '/uk/countries/maldives/tur-laamu-atoll/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/maldivy/tury-v-maafushi/',
        destination: '/uk/countries/maldives/tur-maafushi/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/maldivy/tury-v-male/',
        destination: '/uk/countries/maldives/tur-male/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/maldivy/tury-v-pivdennyi-male-atoll/',
        destination: '/uk/countries/maldives/tur-yuzhnyj-male-atoll/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/maldivy/tury-v-pivnichnyi-male-atol/',
        destination: '/uk/countries/maldives/tur-severnyj-male-atoll/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/marokko/tury-v-ahadir/',
        destination: '/uk/countries/marokko/tur-agadir/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/marokko/tury-v-es-suveiru/',
        destination: '/uk/countries/marokko/tur-es-suveyra/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/marokko/tury-v-kasablanku/',
        destination: '/uk/countries/marokko/tur-kasablanka/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/marokko/tury-v-marrakesh/',
        destination: '/uk/countries/marokko/tur-marrakech/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/marokko/tury-v-fes/',
        destination: '/uk/countries/marokko/tur-fes/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/meksyka/tury-v-isla-mukhares/',
        destination: '/uk/countries/meksika/tur-isla-mukhares/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/meksyka/tury-v-kankun/',
        destination: '/uk/countries/meksika/tur-kankun/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/meksyka/tury-v-kosumel/',
        destination: '/uk/countries/meksika/tur-kosumel/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/meksyka/tury-v-plaiia-del-karmen/',
        destination: '/uk/countries/meksika/tur-playa-del-carmen/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/meksyka/tury-v-puerto-valiarta/',
        destination: '/uk/countries/meksika/tur-puerto-vallarta/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/meksyka/tury-v-riviera-maiia/',
        destination: '/uk/countries/meksika/tur-riviera-maya/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/oae/tury-v-abu-dabi/',
        destination: '/uk/countries/uae/tur_abu_dabi/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/oae/tury-v-adzhman/',
        destination: '/uk/countries/uae/tur-adzhman/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/oae/tury-v-dubai/',
        destination: '/uk/countries/uae/tur-dubay/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/oae/tury-v-korfakkan/',
        destination: '/uk/countries/uae/tur-korfakkan/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/oae/tury-v-ras-el-khaima/',
        destination: '/uk/countries/uae/tur-ras-el-hajma/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/oae/tury-v-umm-al-kuvein/',
        destination: '/uk/countries/uae/tur-ummalquwain/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/oae/tury-v-fudzheiru/',
        destination: '/uk/countries/uae/tur-fudzhejra/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/oae/tury-v-shardzhu/',
        destination: '/uk/countries/uae/tur-shardzha/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/seishely/tury-na-denys/',
        destination: '/uk/countries/seychelles/tur-ostrov-denis/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/seishely/tury-v-derosh/',
        destination: '/uk/countries/seychelles/tur-derosh/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/seishely/tury-v-kuzyn/',
        destination: '/uk/countries/seychelles/tur-kuzin/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/seishely/tury-v-la-dih/',
        destination: '/uk/countries/seychelles/tur-la-dig/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/seishely/tury-v-mae/',
        destination: '/uk/countries/seychelles/tur-mahe/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/seishely/tury-v-praslin/',
        destination: '/uk/countries/seychelles/tur-praslin/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/seishely/tury-na-sviatoi-anny/',
        destination: '/uk/countries/seychelles/tur-ostrov-st-anna/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/seishely/tury-v-syluet/',
        destination: '/uk/countries/seychelles/tur-siluet/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/seishely/tury-v-frehat/',
        destination: '/uk/countries/seychelles/tur-fregat/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/tailand/tury-v-banhkok/',
        destination: '/uk/countries/thailand/tur-bangkok/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/tailand/tury-v-ko-lanta/',
        destination: '/uk/countries/thailand/tur-ko-lanta/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/tailand/tury-v-ko-chanh/',
        destination: '/uk/countries/thailand/tur-kochang/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/tailand/tury-v-krabi/',
        destination: '/uk/countries/thailand/tur-krabi/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/tailand/tury-v-pattaiiu/',
        destination: '/uk/countries/thailand/tur-pattaya/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/tailand/tury-v-pkhi-pkhi/',
        destination: '/uk/countries/thailand/tur-phiphi/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/tailand/tury-v-pkhuket/',
        destination: '/uk/countries/thailand/tur-phuket/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/tailand/tury-v-samet/',
        destination: '/uk/countries/thailand/tur-samet/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/tailand/tury-v-samui/',
        destination: '/uk/countries/thailand/tur-samui/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/tanzaniia/tury-v-zanzibar/',
        destination: '/uk/countries/tanzania/tur-zanzibar/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/tanzaniia/tury-v-zanzibar/tury-v-nunhvi/',
        destination: '/uk/countries/tanzania/tur-zanzibar/tur-nungvi/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/tunis/tury-v-dzherba/',
        destination: '/uk/countries/tunisia/tur-dzherba/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/tunis/tury-v-makhdiiu/',
        destination: '/uk/countries/tunisia/tur-makhdiya/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/tunis/tury-v-monastir/',
        destination: '/uk/countries/tunisia/tur-monastir/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/tunis/tury-v-nabel/',
        destination: '/uk/countries/tunisia/tur-nabel/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/tunis/tury-v-suss/',
        destination: '/uk/countries/tunisia/tur-suss/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/tunis/tury-v-khammamet/',
        destination: '/uk/countries/tunisia/tur-hammamet/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-alaniiu/',
        destination: '/uk/countries/turkey/tur-alanja/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-alaniiu/tury-v-mahmutlar/',
        destination: '/uk/countries/turkey/tur-alanja/tur-mahmutlar/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-ankaru/',
        destination: '/uk/countries/turkey/tur-ankara/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-antaliiu/',
        destination: '/uk/countries/turkey/tur-antaliya/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-antaliiu/tury-v-kalyeichy/',
        destination: '/uk/countries/turkey/tur-antaliya/tur-kaleici/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-belek/',
        destination: '/uk/countries/turkey/tur-belek/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-belek/9747-2/',
        destination: '/uk/countries/turkey/tur-belek/tur-kadriye/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-bodrum/',
        destination: '/uk/countries/turkey/tur-bodrum/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-dalaman/',
        destination: '/uk/countries/turkey/tur-dalaman/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-didim/',
        destination: '/uk/countries/turkey/tur-didim/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-erdzhiies/',
        destination: '/uk/countries/turkey/tur-erdzhies/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-izmir/',
        destination: '/uk/countries/turkey/tur-izmir/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-izmir/tury-v-cheshme/',
        destination: '/uk/countries/turkey/tur-izmir/tur-cheshme/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-kaiseri/',
        destination: '/uk/countries/turkey/tur-kayseri/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-kappadokiiu/',
        destination: '/uk/countries/turkey/tur-kappadokiya/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-kemer/',
        destination: '/uk/countries/turkey/tur-kemer/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-kemer/tury-v-beldibi/',
        destination: '/uk/countries/turkey/tur-kemer/tur-beldibi/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-kemer/tury-v-heiniuk/',
        destination: '/uk/countries/turkey/tur-kemer/tur-gejnyuk/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-kemer/tury-v-kirish/',
        destination: '/uk/countries/turkey/tur-kemer/tur-kiris/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-kemer/tury-v-tekirova/',
        destination: '/uk/countries/turkey/tur-kemer/tur-tekirova/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-kemer/tury-v-chamyuva/',
        destination: '/uk/countries/turkey/tur-kemer/tur-chamyuva/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-kushadasy/',
        destination: '/uk/countries/turkey/tur-kushadasy/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-marmarys/',
        destination: '/uk/countries/turkey/tur-marmaris/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-marmarys/tury-v-ichmeler/',
        destination: '/uk/countries/turkey/tur-marmaris/tur-ichmeler/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-marmarys/tury-v-turunch/',
        destination: '/uk/countries/turkey/tur-marmaris/tur-turunch/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-palandoken/',
        destination: '/uk/countries/turkey/tur-palandoken/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-side/',
        destination: '/uk/countries/turkey/tur-side/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-side/tury-v-sorgun/',
        destination: '/uk/countries/turkey/tur-side/tur-sorgun/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-stambul/',
        destination: '/uk/countries/turkey/tur-stambul/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-uludah/',
        destination: '/uk/countries/turkey/tur-uludag/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-fetkhiie/',
        destination: '/uk/countries/turkey/tur-fethie/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/turechchyna/tury-v-fetkhiie/tury-v-oliudeniz/',
        destination: '/uk/countries/turkey/tur-fethie/tur-oludeniz/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/khorvatiia/tury-v-dubrovnyk/',
        destination: '/uk/countries/croatia/tur-dubrovnik/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/khorvatiia/tury-v-makarska/',
        destination: '/uk/countries/croatia/makarska-rivera/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/khorvatiia/tury-v-porech/',
        destination: '/uk/countries/croatia/tur-porech/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/khorvatiia/tury-v-pulu/',
        destination: '/uk/countries/croatia/tur-pula/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/khorvatiia/tury-v-split/',
        destination: '/uk/countries/croatia/tur-split/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/chornohoriia/tury-v-bar/',
        destination: '/uk/countries/montenegro/tur-bar/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/chornohoriia/tury-v-bechichi/',
        destination: '/uk/countries/montenegro/tur_bechichi/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/chornohoriia/tury-v-budvu/',
        destination: '/uk/countries/montenegro/tur-budva/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/chornohoriia/tury-v-hertseh-novi/',
        destination: '/uk/countries/montenegro/tur-gertseg-novi/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/chornohoriia/tury-v-kotor/',
        destination: '/uk/countries/montenegro/tur-kotor/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/chornohoriia/tury-v-milocher/',
        destination: '/uk/countries/montenegro/tur_milocher/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/chornohoriia/tury-v-petrovats/',
        destination: '/uk/countries/montenegro/tur-petrovac/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/chornohoriia/tury-v-sveti-stefan/',
        destination: '/uk/countries/montenegro/tur-sveti-stefan/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/chornohoriia/tury-v-sutomore/',
        destination: '/uk/countries/montenegro/tur-sutomore/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/shri-lanka/tury-v-bentotu/',
        destination: '/uk/countries/sri-lanka/tur-bentota/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/shri-lanka/tury-v-beruvela/',
        destination: '/uk/countries/sri-lanka/tur-beruvela/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/shri-lanka/tury-v-vadduva/',
        destination: '/uk/countries/sri-lanka/tur-vadduva/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/shri-lanka/tury-v-velihamu/',
        destination: '/uk/countries/sri-lanka/tur-veligama/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/shri-lanka/tury-v-halle/',
        destination: '/uk/countries/sri-lanka/tur-galle/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/shri-lanka/tury-v-kolombo/',
        destination: '/uk/countries/sri-lanka/tur-colombo/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/shri-lanka/tury-v-unavatuna/',
        destination: '/uk/countries/sri-lanka/tur-unawatuna/',
        permanent: true,
      },
      {
        source: '/ukr/krainy/shri-lanka/tury-v-khikkaduvu/',
        destination: '/uk/countries/sri-lanka/tur-hikkaduwa/',
        permanent: true,
      },
      {
        source: '/ukr/tury/hirskolyzhni-tury/',
        destination: '/uk/tours/gornolyzhnye-tury/',
        permanent: true,
      },
      {
        source: '/ukr/tury/hariachi-tury/',
        destination: '/uk/tours/hottours/',
        permanent: true,
      },
      {
        source: '/ukr/tury/hrupovi-tury/',
        destination: '/uk/tours/grupovye-tury/',
        permanent: true,
      },
      {
        source: '/ukr/tury/kruizy/',
        destination: '/uk/tours/kruiz/',
        permanent: true,
      },
      {
        source: '/ukr/tury/molodizhni-tury/',
        destination: '/uk/tours/molodezhnyj-otdyh/',
        permanent: true,
      },
      {
        source: '/ukr/tury/novorichni-tury/',
        destination: '/uk/tours/novogodnie-tury/',
        permanent: true,
      },
      {
        source: '/ukr/tury/tur-onlain/',
        destination: '/uk/tours/online/',
        permanent: true,
      },
      {
        source: '/ukr/tury/tury-z-ditmy/',
        destination: '/uk/tours/otdyh-s-detmi/',
        permanent: true,
      },
      {
        source: '/ukr/tury/pliazhni-tury/',
        destination: '/uk/tours/plyazhnye-tury/',
        permanent: true,
      },
      {
        source: '/ukr/tury/poshuk-turiv/',
        destination: '/uk/tours/searchtour/',
        permanent: true,
      },
      {
        source: '/ukr/tury/rannie-broniuvannia-turiv/',
        destination: '/uk/tours/rannee-bronirovanie/',
        permanent: true,
      },
      {
        source: '/ukr/tury/vesilni-tury/',
        destination: '/uk/tours/svadebnye-tury/',
        permanent: true,
      },
      {
        source: '/ukr/tury/simeini-tury/',
        destination: '/uk/tours/semejnyj-otdyh/',
        permanent: true,
      },
      {
        source: '/ukr/tury/tury-na-more/',
        destination: '/uk/tours/tur-na-more/',
        permanent: true,
      },
      {
        source: '/ukr/tury/ekzotychni-tury/',
        destination: '/uk/tours/ekzoticheskie-tury/',
        permanent: true,
      },
      {
        source: '/ukr/tury/ekskursiini-tury/',
        destination: '/uk/tours/excursion/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
