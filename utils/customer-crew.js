import { mainFormPersonValidationRange as CrewConstraints } from './constants';

export const stringifyCrewComposition = ({ adult, childAge }) => {
  const childs = childAge.map(age => age.toString().padStart(2, '0'));

  return adult.toString() + childs;
}

export const parseCrewComposition = (peopleStr = '') => {
  const adult = parseInt(peopleStr[0], 10) || CrewConstraints.defaultAdultsAmount;
  const strAgesArray = peopleStr.slice(1).match(/.{1,2}/g) || [];
  const childAge = strAgesArray
    .map(strAge => parseInt(strAge, 10))
    .filter(age => !Number.isNaN(age))
    .filter(age => {
      return age >= CrewConstraints.childAgeMin && age <= CrewConstraints.childAgeMax;
    });

  return { adult, childAge, child: childAge.length };
};

export const covertStoreAgesToComponent = (ages) => {
  return ages.map(age => ({key: String(Math.random()), age}));
};
