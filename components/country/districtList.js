import styles from './tourList.module.css';
import SwitchMenu from '/components/common/switchMenu/switchMenu.js';
import DistrictCards from '/components/common/districtCards/districtCards.js';
import { useState } from 'react';
import { useIntl } from 'react-intl';

export default function DistrictList({ data, title, country, loc }) {
  const intl = useIntl();
  const [name, setName] = useState('popular');

  return (
    <>
      <h2 className={styles.title}>{title}</h2>
      <SwitchMenu
        items={[
          {
            name: `${intl.formatMessage({ id: 'country.popular' })}`,
            value: 'popular',
          },
          {
            name: `${intl.formatMessage({ id: 'country.all' })}`,
            value: 'all',
          },
        ]}
        name={'district_switcher'}
        callback={[name, setName]}
      />
      <DistrictCards current={name} cards={data} country={country} loc={loc} />
    </>
  );
}
