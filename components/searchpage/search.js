import SearchContent from './searchContent';
import SearchHeader from './searchHeader';

export default function Search({ down, date, loc }) {
  return (
    <>
      <SearchHeader down={down} date={date} loc={loc} />
      <SearchContent />
    </>
  );
}
