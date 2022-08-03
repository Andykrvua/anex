import { location } from 'utils/constants';

function Change(str) {
  if (str === null) {
    return null;
  }
  return str.replaceAll(`http://a-k.name:8055`, `https://a-k.name/directus`);
}

export default function ChangeImageUrl(str, variant) {
  let content;

  if (variant === location.postContent.countryPage) {
    content = Change(str.translations[0].post_content);
  } else {
    content = Change(str.translations[0].content);
  }

  return content;
}
