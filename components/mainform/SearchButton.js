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
  useGetInitialDate,
  useGetToCities,
} from '../../store/store';
import { inputRangeData } from '../../utils/constants';
import { stringifyCrewComposition } from '../../utils/customer-crew';
import { buildDateSearchQuery } from '../../utils/dateRange';

export default function SearchButton() {
  const router = useRouter();

  const up = useGetUp();
  const down = useGetDown();
  const date = useGetDate();
  const night = useGetNight();
  const setStartSearch = useSetStartSearch();
  const getSearchInProgress = useGetSearchInProgress();
  const person = useGetPerson();
  const initialDate = useGetInitialDate();
  const toCities = useGetToCities();

  const makeSearchParams = () => {
    if (getSearchInProgress) {
      return;
    }
    const { checkIn, checkTo, plusDays, dateType } = buildDateSearchQuery(date, initialDate);

    // Preserve already-applied filter params from URL so that changing main-form
    // values (people, dates, etc.) и тычок «Поиск» не сбрасывает примененные фильтры.
    // Без этого URL терял фильтры → searchContent видел diff с кэшем urlParams →
    // лишняя кнопка «Применить фильтры», хотя фильтры ещё активны (чекбоксы / range on).
    let preservedStars = '';
    let preservedFood = '';
    let preservedServices = '';
    let preservedPrice = inputRangeData.costMin;
    let preservedPriceTo = inputRangeData.costMax;
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      preservedStars = sp.get('stars') || '';
      preservedFood = sp.get('food') || '';
      preservedServices = sp.get('services') || '';
      const priceFromUrl = sp.get('price');
      const priceToFromUrl = sp.get('priceTo');
      if (priceFromUrl !== null && priceFromUrl !== '') preservedPrice = priceFromUrl;
      if (priceToFromUrl !== null && priceToFromUrl !== '') preservedPriceTo = priceToFromUrl;
    }

    setStartSearch(true);

    router.push({
      pathname: '/search',
      query: {
        transport: up.transport ? up.transport : 'no',
        from: up.value,
        to: down.value,
        country: down.countryValue,
        checkIn,
        checkTo,
        plusDays,
        dateType,
        nights: night.from,
        nightsTo: night.to,
        people: stringifyCrewComposition(person),
        price: preservedPrice,
        priceTo: preservedPriceTo,
        stars: preservedStars,
        food: preservedFood,
        services: preservedServices,
        ...(toCities.length > 0 ? { toCities: toCities.join(',') } : {}),
      },
    });
  };

  return (
    <button className="main_form_btn" onClick={() => makeSearchParams()}>
      <FM id="common.search" />
    </button>
  );
}
