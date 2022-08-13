import { useWindowInfo, useSetWindowInfo } from '/store/store';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { showTime } from '/utils/constants';

const DynamicInfoWindow = dynamic(
  () => import(/* webpackChunkName: "InfoModal" */ './infoModalLayout'),
  {
    ssr: false,
    // loading: () => {
    //   return <LoadingPlaceholder />;
    // },
  }
);

export default function InfoModal() {
  const modalInfo = useWindowInfo();
  const setModalInfo = useSetWindowInfo();
  useEffect(() => {
    if (modalInfo.show) {
      setTimeout(() => {
        setModalInfo({ show: false, type: null, text: null });
      }, showTime.time);
    }
  }, [modalInfo.show]);

  return modalInfo.show && <DynamicInfoWindow data={modalInfo} />;
}
