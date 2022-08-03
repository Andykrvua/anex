export default function ratingColor(num) {
  if (num <= 4) {
    return '#d2573b';
  }
  if (num <= 6.5) {
    return '#d2ba3b';
  }
  if (num <= 8) {
    return '#59d34c';
  }
  if (num <= 10) {
    return '#55b54a';
  }
  return '#55b54a';
}
