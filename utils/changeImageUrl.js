import { location } from 'utils/constants';

function Change(str) {
  if (!str) {
    return null;
  }

  const search = `http://a-k.name:8055`;
  const replacer = new RegExp(search, 'g');

  return str.replace(replacer, `https://a-k.name/directus`);
}

export default function ChangeImageUrl(str, variant) {
  let content;

  if (variant === location.postContent.countryPage) {
    content = Change(str.translations[0].post_content);
  } else if (variant === 'default') {
    content = Change(str);
  } else {
    content = Change(str.translations[0].content);
  }

  return content;
}
