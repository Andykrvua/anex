import { useMemo, useState } from 'react';
import styles from './debugPanel.module.css';

export default function DebugPanel({ apiData, apiRes }) {
  const [hotelIdInput, setHotelIdInput] = useState('');
  const [offerIdInput, setOfferIdInput] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const stats = useMemo(() => {
    if (!apiData?.hotelsArr?.length) return null;

    const hotels = apiData.hotelsArr;
    const allOffers = hotels.flatMap((h) => h.actualOffers || []);
    const prices = allOffers.map((o) => o.pl).filter((p) => typeof p === 'number');

    const operators = {};
    Object.entries(apiData.results || {}).forEach(([opId, opHotels]) => {
      let offersCount = 0;
      Object.values(opHotels).forEach((h) => {
        offersCount += Object.keys(h.offers || {}).length;
      });
      operators[opId] = {
        hotelsCount: Object.keys(opHotels).length,
        offersCount,
        name: apiData.workProgress?.[opId]?.operator || null,
      };
    });

    const nightsDistribution = {};
    allOffers.forEach((o) => {
      nightsDistribution[o.n] = (nightsDistribution[o.n] || 0) + 1;
    });

    const foodDistribution = {};
    allOffers.forEach((o) => {
      foodDistribution[o.f] = (foodDistribution[o.f] || 0) + 1;
    });

    const starsDistribution = {};
    hotels.forEach((h) => {
      starsDistribution[h.s] = (starsDistribution[h.s] || 0) + 1;
    });

    return {
      hotelsCount: hotels.length,
      offersCount: allOffers.length,
      minPrice: prices.length ? Math.min(...prices) : 0,
      maxPrice: prices.length ? Math.max(...prices) : 0,
      avgPrice: prices.length ? Math.round(prices.reduce((s, p) => s + p, 0) / prices.length) : 0,
      operators,
      nightsDistribution,
      foodDistribution,
      starsDistribution,
    };
  }, [apiData]);

  const foundHotel = useMemo(() => {
    const q = hotelIdInput.trim();
    if (!q || !apiData?.hotels) return null;
    const hotel = apiData.hotels[q];
    if (!hotel) return null;
    const nightsCounts = {};
    (hotel.actualOffers || []).forEach((o) => {
      nightsCounts[o.n] = (nightsCounts[o.n] || 0) + 1;
    });
    return { hotel, nightsCounts };
  }, [hotelIdInput, apiData]);

  const foundOffer = useMemo(() => {
    const q = offerIdInput.trim();
    if (!q || !apiData?.hotelsArr) return null;
    for (const hotel of apiData.hotelsArr) {
      const offer = (hotel.actualOffers || []).find((o) => String(o.i) === q);
      if (offer) {
        return { offer, hotelId: hotel.i, hotelName: hotel.n };
      }
    }
    return null;
  }, [offerIdInput, apiData]);

  const operatorDetail = useMemo(() => {
    if (!selectedOperator || !apiData?.results?.[selectedOperator]) return null;
    const opHotels = apiData.results[selectedOperator];
    const offers = [];
    Object.entries(opHotels).forEach(([hotelId, h]) => {
      Object.values(h.offers || {}).forEach((o) => {
        offers.push({ ...o, _hotelId: hotelId });
      });
    });
    const prices = offers.map((o) => o.pl).filter((p) => typeof p === 'number');
    return {
      operatorId: selectedOperator,
      operatorName: apiData.workProgress?.[selectedOperator]?.operator || null,
      hotelsCount: Object.keys(opHotels).length,
      offersCount: offers.length,
      minPrice: prices.length ? Math.min(...prices) : 0,
      maxPrice: prices.length ? Math.max(...prices) : 0,
      sample: offers.slice(0, 5),
    };
  }, [selectedOperator, apiData]);

  if (!stats) {
    return (
      <div className={styles.debug_panel}>
        <div className={styles.header}>
          <strong>DEBUG</strong>
          <span>немає даних getResults</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.debug_panel}>
      <div className={styles.header}>
        <strong>DEBUG PANEL</strong>
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setCollapsed((v) => !v)}
        >
          {collapsed ? 'Розгорнути' : 'Згорнути'}
        </button>
      </div>

      {!collapsed && (
        <div className={styles.body}>
          <div className={styles.section}>
            <h4>Статистика</h4>
            <div className={styles.stats_grid}>
              <div><span>Готелів:</span> <b>{stats.hotelsCount}</b></div>
              <div><span>Оферів:</span> <b>{stats.offersCount}</b></div>
              <div><span>Операторів:</span> <b>{Object.keys(stats.operators).length}</b></div>
              <div><span>Min ціна:</span> <b>{stats.minPrice.toLocaleString()}</b></div>
              <div><span>Max ціна:</span> <b>{stats.maxPrice.toLocaleString()}</b></div>
              <div><span>Avg ціна:</span> <b>{stats.avgPrice.toLocaleString()}</b></div>
              <div><span>total (API):</span> <b>{apiRes?.total ?? '-'}</b></div>
              <div><span>lastResult:</span> <b>{String(apiRes?.lastResult ?? '-')}</b></div>
            </div>
          </div>

          <div className={styles.section}>
            <h4>Розподіл ночей</h4>
            <div className={styles.pill_row}>
              {Object.entries(stats.nightsDistribution)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([nh, count]) => (
                  <span key={nh} className={styles.pill}>
                    {nh}н: <b>{count}</b>
                  </span>
                ))}
            </div>
          </div>

          <div className={styles.section}>
            <h4>Розподіл харчування</h4>
            <div className={styles.pill_row}>
              {Object.entries(stats.foodDistribution).map(([f, count]) => (
                <span key={f} className={styles.pill}>
                  {f}: <b>{count}</b>
                </span>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h4>Розподіл зірок</h4>
            <div className={styles.pill_row}>
              {Object.entries(stats.starsDistribution)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([s, count]) => (
                  <span key={s} className={styles.pill}>
                    {s}★: <b>{count}</b>
                  </span>
                ))}
            </div>
          </div>

          <div className={styles.section}>
            <h4>Оператори</h4>
            <div className={styles.pill_row}>
              {Object.entries(stats.operators)
                .sort(([, a], [, b]) => b.offersCount - a.offersCount)
                .map(([opId, op]) => (
                  <button
                    key={opId}
                    type="button"
                    className={`${styles.pill} ${styles.pill_btn} ${
                      selectedOperator === opId ? styles.pill_active : ''
                    }`}
                    onClick={() => setSelectedOperator(selectedOperator === opId ? '' : opId)}
                  >
                    {op.name ? <b>{op.name}</b> : null} (id {opId}): <b>{op.offersCount}</b> оферів / {op.hotelsCount} готелів
                  </button>
                ))}
            </div>
            {operatorDetail && (
              <div className={styles.detail}>
                <div className={styles.stats_grid}>
                  <div><span>operator:</span> <b>{operatorDetail.operatorName || '-'} (id {operatorDetail.operatorId})</b></div>
                  <div><span>готелів:</span> <b>{operatorDetail.hotelsCount}</b></div>
                  <div><span>оферів:</span> <b>{operatorDetail.offersCount}</b></div>
                  <div><span>min/max ціна:</span> <b>{operatorDetail.minPrice.toLocaleString()} / {operatorDetail.maxPrice.toLocaleString()}</b></div>
                </div>
                <details>
                  <summary>Зразок оферів (5)</summary>
                  <pre className={styles.json}>{JSON.stringify(operatorDetail.sample, null, 2)}</pre>
                </details>
              </div>
            )}
          </div>

          <div className={styles.section}>
            <h4>Пошук по ID готелю</h4>
            <input
              type="text"
              value={hotelIdInput}
              onChange={(e) => setHotelIdInput(e.target.value)}
              placeholder="hotel id"
              className={styles.input}
            />
            {foundHotel && (
              <details open className={styles.detail}>
                <summary>
                  {foundHotel.hotel.n} (id {foundHotel.hotel.i},{' '}
                  {foundHotel.hotel.actualOffers?.length || 0} оферів)
                </summary>
                <div className={styles.pill_row} style={{ marginTop: '8px' }}>
                  {Object.entries(foundHotel.nightsCounts)
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([nh, count]) => (
                      <span key={nh} className={styles.pill}>
                        {nh}н: <b>{count}</b>
                      </span>
                    ))}
                  {!Object.keys(foundHotel.nightsCounts).length && (
                    <span className={styles.not_found}>немає оферів</span>
                  )}
                </div>
                <pre className={styles.json}>{JSON.stringify(foundHotel.hotel, null, 2)}</pre>
              </details>
            )}
            {hotelIdInput && !foundHotel && <div className={styles.not_found}>Готель не знайдено</div>}
          </div>

          <div className={styles.section}>
            <h4>Пошук по ID оферу</h4>
            <input
              type="text"
              value={offerIdInput}
              onChange={(e) => setOfferIdInput(e.target.value)}
              placeholder="offer id"
              className={styles.input}
            />
            {foundOffer && (
              <details open className={styles.detail}>
                <summary>Готель: {foundOffer.hotelName} (id {foundOffer.hotelId})</summary>
                <pre className={styles.json}>{JSON.stringify(foundOffer.offer, null, 2)}</pre>
              </details>
            )}
            {offerIdInput && !foundOffer && <div className={styles.not_found}>Офер не знайдено</div>}
          </div>
        </div>
      )}
    </div>
  );
}
