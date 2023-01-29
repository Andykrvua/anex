export function formattedDate(date) {
  // if (typeof window === 'undefined') {
  return date.toISOString().slice(0, 10).split('-').reverse().join('.');
  // }
  // return null;
}

export function directusFormattedDate(date) {
  return new Date(date).toLocaleDateString().split('.').join('/');
}
