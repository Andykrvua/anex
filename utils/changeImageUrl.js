import { location } from 'utils/constants';

function Change(str) {
  if (!str) {
    return null;
  }

  const search = process.env.NEXT_PUBLIC_API_ADMIN_PANEL;
  const replacer = new RegExp(search, 'g');

  return str.replace(replacer, `${process.env.NEXT_PUBLIC_API_HOST}/directus`);
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
