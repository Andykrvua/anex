import { languages } from 'utils/constants';

// arr - array
// checkVal - validation field
// res - result field
// loc - current language

export const GetLangField = (arr, checkVal, res, loc) => {
  let curLoc;
  if (loc === languages.ru) {
    curLoc = 'ru-RU';
  } else if (loc === languages.uk) {
    curLoc = 'uk-UA';
  }

  const searchField = arr.filter((lang) => lang[checkVal] === curLoc);
  return searchField[0]?.[res] ? searchField[0][res] : null;
};
