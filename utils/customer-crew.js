import { mainFormPersonValidationRange } from './constants';

const { childAgeMax, childAgeMin, defaultAdultsAmount } = mainFormPersonValidationRange;

export const stringifyCrewComposition = ({ adult, childAge = [] }) => {
  const childs = childAge.map(age => age.toString().padStart(2, '0'));

  return (adult || '').toString() + childs;
}

export const parseCrewComposition = (peopleStr = '') => {
  const adult = parseInt(peopleStr[0], 10) || defaultAdultsAmount;
  const strAgesArray = peopleStr.slice(1).match(/.{1,2}/g) || [];
  const childAge = strAgesArray
    .map(strAge => parseInt(strAge, 10))
    .filter(age => !Number.isNaN(age))
    .filter(age => age >= childAgeMin && age <= childAgeMax);

  return { adult, childAge, child: childAge.length };
};

export const covertStoreAgesToComponent = (ages) => {
  return ages.map(age => ({key: String(Math.random()), age}));
};
