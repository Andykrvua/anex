import { format } from "date-fns";

export function formattedDate(date) {
  // if (typeof window === 'undefined') {
  return format(date,'dd.MM.yyyy');
  // }
  // return null;
}

export function directusFormattedDate(date) {
  return new Date(date).toLocaleDateString().split('.').join('/');
}

export function dayMonthFormatDate(date, locale) {
  const monthNames = {
    uk: [
      'січ',
      'лют',
      'бер',
      'кві',
      'тра',
      'чер',
      'лип',
      'сер',
      'вер',
      'жов',
      'лис',
      'гру',
    ],
    ru: [
      'янв',
      'фев',
      'мар',
      'апр',
      'май',
      'июн',
      'июл',
      'авг',
      'сен',
      'окт',
      'ноя',
      'дек',
    ],
  };
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const monthName = monthNames[locale][monthIndex];
  return `${day} ${monthName}`;
}
