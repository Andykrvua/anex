import { useRouter } from 'next/router';
import { FormattedMessage as FM } from 'react-intl';
import {
  useGetUp,
  useGetDown,
  useGetDate,
  useGetNight,
  useGetPerson,
  useSetStartSearch,
  useGetSearchInProgress,
} from '../../store/store';
import { inputRangeData } from '../../utils/constants';
import { stringifyCrewComposition } from '../../utils/customer-crew';

export default function SearchButton() {
  const router = useRouter();

  const up = useGetUp();
  const down = useGetDown();
  const date = useGetDate();
  const night = useGetNight();
  const setStartSearch = useSetStartSearch();
  const getSearchInProgress = useGetSearchInProgress();
  const person = useGetPerson();

  const makeSearchParams = () => {
    if (getSearchInProgress) {
      return;
    }
    const copiedDate = new Date(date.rawDate);
    copiedDate.setDate(copiedDate.getDate() + date.plusDays);

    setStartSearch(true);

    router.push({
      pathname: '/search',
      query: {
        transport: up.transport ? up.transport : 'no',
        from: up.value,
        to: down.value,
        country: down.countryValue,
        checkIn: date.rawDate.toISOString().substr(0, 10),
        checkTo: copiedDate.toISOString().substr(0, 10),
        nights: night.from,
        nightsTo: night.to,
        people: stringifyCrewComposition(person),
        price: inputRangeData.costMin,
        priceTo: inputRangeData.costMax,
        stars: '',
        food: '',
        services: '',
      },
    });
  };

  return (
    <button className="main_form_btn" onClick={() => makeSearchParams()}>
      <FM id="common.search" />
    </button>
  );
}
