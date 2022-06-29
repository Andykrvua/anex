export function formattedDate(date) {
  return date.toISOString().slice(0, 10).split('-').reverse().join('.');
}

export function directusFormattedDate(date) {
  return new Date(date).toLocaleDateString().split('.').join('/');
}
