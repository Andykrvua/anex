export function formattedDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}.${month}.${year}`;
  // return date.toISOString().slice(0, 10).split('-').reverse().join('.');
}

export function directusFormattedDate(date) {
  return new Date(date).toLocaleDateString().split('.').join('/');
}

export function dayMonthFormatDate(date, locale) {
  const monthNames = {
    uk: ['січ', 'лют', 'бер', 'кві', 'тра', 'чер', 'лип', 'сер', 'вер', 'жов', 'лис', 'гру'],
    ru: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
  };
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const monthName = monthNames[locale][monthIndex];
  return `${day} ${monthName}`;
}
