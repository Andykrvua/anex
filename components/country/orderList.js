import styles from './orderList.module.css';
import SwitchMenu from '/components/common/switchMenu/switchMenu.js';
import { useState } from 'react';

export default function OrderList() {
  const [name, setName] = useState('ru2');
  // console.log(name);
  return (
    <>
      <h2 className={styles.title}>Сейчас заказывают</h2>
      <SwitchMenu
        items={[
          { name: 'Економ', value: 'ru2' },
          { name: 'Лучшие', value: 'uk22' },
          { name: 'Топ 5 звёзд', value: 'uk2' },
        ]}
        name={'order_switcher'}
        callback={[name, setName]}
      />
    </>
  );
}
