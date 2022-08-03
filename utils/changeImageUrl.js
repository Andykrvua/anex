import { location } from 'utils/constants';

function Change(str) {
  // console.log(str);
  if (!str) {
    return null;
  }
  // return str.replaceAll(`http://a-k.name:8055`, `https://a-k.name/directus`);
  return str.replaceAll(`http://a-k.name:8055`, `http://a-k.name:8055`);
}

export default function ChangeImageUrl(str, variant) {
  let content;

  if (variant === location.postContent.countryPage) {
    content = Change(str.translations[0].post_content);
  } else {
    content = Change(str.translations[0].content);
  }
  // console.log(content);
  return content;
}
