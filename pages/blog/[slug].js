// import MainForm from '/components/mainform/mainForm.js';
// import { useIntl } from 'react-intl';
// import PopularCountry from '/components/mainpage/popularCountry.js';
// import Blog from '/components/mainpage/blog.js';
// import { countryData, blogData } from '/utils/data/countryData';
// import Faq from '/components/mainpage/faq.js';
// import { accordionData } from 'utils/data/accordionData';
// import SeoBlock from '/components/mainpage/seoBlock.js';
// import Head from 'next/head';
// import { useRouter } from 'next/router';

// export default function Post({ post }) {
//   const intl = useIntl();
//   console.log(post);

//   const router = useRouter();

//   if (router.isFallback) {
//     return (
//       <div className="container">
//         <div>loading...</div>
//       </div>
//     );
//   }

//   //нужно для передачи в HEAD
//   const title = intl.formatMessage({ id: 'nav.tour' });
//   const description = intl.formatMessage({
//     id: 'nav.country',
//   });

//   return (
//     <>
//       <Head>
//         <title>Anex Main</title>
//         <meta name="description" content="Anex Main" />
//       </Head>
//       <div className="container">{post.data[0].slug}</div>
//     </>
//   );
// }

// export async function getStaticPaths({ locales }) {
//   const resSlugs = await fetch(
//     `https://a-k.name/directus/items/posts?fields=slug,id`
//   );
//   const slugs = await resSlugs.json();
//   // console.log(slugs.data);

//   const paths = [];
//   slugs.data.map((item) => {
//     return locales.map((locale) => {
//       return paths.push({
//         params: { slug: item.slug },
//         locale,
//       });
//     });
//   });
//   // console.log(paths);
//   return { paths, fallback: true };
// }

// export async function getStaticProps(context) {
//   const slug = context.params.slug;
//   const loc = context.locale;

//   const resPost = await fetch(
//     `https://a-k.name/directus/items/posts?fields=*,translations.title,translations.languages_code&filter[slug][_eq]=${slug}&filter[status][_eq]=published`
//   );
//   const post = await resPost.json();

//   if (!post.data.length) {
//     return {
//       notFound: true,
//     };
//   }

//   return {
//     props: { post, loc },
//     revalidate: 30,
//   };
// }
