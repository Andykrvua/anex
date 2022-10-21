import styles from './filterContent.module.css';
import { useSetFilter } from 'store/store';
import { FormattedMessage as FM } from 'react-intl';
import InputRange from 'components/controls/inputRange/inputRange';
import Checkbox from 'components/controls/checkbox/checkbox';
import { useIntl } from 'react-intl';
import Accordion from 'components/controls/accordion/accordion';
import CloseSvg from 'components/common/closeSvg';

export default function FilterContent({ mobile }) {
  const intl = useIntl();

  const min = 0;
  const max = 100000;
  const step = 1000;

  const Stars = (star) => {
    return new Array(parseInt(star)).fill(null).map((_, ind) => {
      return (
        <div className={styles.stars} key={ind}>
          <img
            src="/assets/img/svg/tour/star.svg"
            alt="star"
            width="12"
            height="12"
          />
        </div>
      );
    });
  };

  return (
    <>
      <div className={styles.filter_header}>
        {!mobile && (
          <h3 className={styles.title}>
            <FM id="result.filter.title" />
          </h3>
        )}
        <button className={`${styles.reset_btn} svg_btn_stroke`}>
          <FM id="result.filter.reset" />
          <CloseSvg />
        </button>
      </div>
      <div
        className={
          mobile ? `${styles.filter_parts_mobile}` : `${styles.filter_parts}`
        }
      >
        <h4 className={styles.filter_parts_title}>Бюджет</h4>
        <InputRange min={min} max={max} step={step} />
      </div>
      <div
        className={
          mobile ? `${styles.filter_parts_mobile}` : `${styles.filter_parts}`
        }
      >
        <h4 className={styles.filter_parts_title}>Категория отеля</h4>
        <div className={mobile ? `${styles.filter_parts_row_stars}` : ''}>
          <Checkbox label={Stars(5)} check={null} setCheck={null} />
          <Checkbox label={Stars(4)} check={null} setCheck={null} />
          <Checkbox label={Stars(3)} check={null} setCheck={null} />
        </div>
      </div>
      <div
        className={
          mobile ? `${styles.filter_parts_mobile}` : `${styles.filter_parts}`
        }
      >
        <h4 className={styles.filter_parts_title}>Транспорт</h4>
        <div className={styles.filter_parts_row}>
          <Checkbox
            label={
              <span className={styles.checkbox_icon_wrapper}>
                <img src="/assets/img/svg/fly-up.svg" alt="air" />
              </span>
            }
            check={null}
            setCheck={null}
          />
          <Checkbox
            label={
              <span className={styles.checkbox_icon_wrapper}>
                <img src="/assets/img/svg/results/bus.svg" alt="bus" />
              </span>
            }
            check={null}
            setCheck={null}
          />
        </div>
      </div>
      <div
        className={
          mobile ? `${styles.filter_parts_mobile}` : `${styles.filter_parts}`
        }
      >
        <h4 className={styles.filter_parts_title}>Питание</h4>
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>Без питания</div>
          }
          check={null}
          setCheck={null}
        />
        <Checkbox
          label={<div className={styles.checkbox_text_wrapper}>Завтрак</div>}
          check={null}
          setCheck={null}
        />
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>Завтрак и ужин</div>
          }
          check={null}
          setCheck={null}
        />
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>Полный пансион</div>
          }
          check={null}
          setCheck={null}
        />
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>Всё включено</div>
          }
          check={null}
          setCheck={null}
        />
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>
              Ультра всё включено
            </div>
          }
          check={null}
          setCheck={null}
        />
      </div>
      <div
        className={
          mobile ? `${styles.filter_parts_mobile}` : `${styles.filter_parts}`
        }
      >
        <h4 className={styles.filter_parts_title}>Пляж</h4>
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>Первая линия</div>
          }
          check={null}
          setCheck={null}
        />
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>Вторая линия</div>
          }
          check={null}
          setCheck={null}
        />
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>Собственный пляж</div>
          }
          check={null}
          setCheck={null}
        />
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>Песчаный пляж</div>
          }
          check={null}
          setCheck={null}
        />
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>Галечный пляж</div>
          }
          check={null}
          setCheck={null}
        />
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>
              Песчано-галечный пляж
            </div>
          }
          check={null}
          setCheck={null}
        />
      </div>
      <div
        className={
          mobile ? `${styles.filter_parts_mobile}` : `${styles.filter_parts}`
        }
      >
        <h4 className={styles.filter_parts_title}>Пляж</h4>
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>Первая линия</div>
          }
          check={null}
          setCheck={null}
        />
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>Вторая линия</div>
          }
          check={null}
          setCheck={null}
        />
      </div>
      <div
        className={
          mobile ? `${styles.filter_parts_mobile}` : `${styles.filter_parts}`
        }
      >
        <Accordion title={'В отеле'} open={false}>
          <Checkbox
            label={
              <div className={styles.checkbox_text_wrapper}>
                Бесплатный Wi-Fi
              </div>
            }
            check={null}
            setCheck={null}
          />
          <Checkbox
            label={
              <div className={styles.checkbox_text_wrapper}>
                Бассейн с подогревом
              </div>
            }
            check={null}
            setCheck={null}
          />
          <Checkbox
            label={
              <div className={styles.checkbox_text_wrapper}>
                Отель для взрослых
              </div>
            }
            check={null}
            setCheck={null}
          />
          <Checkbox
            label={
              <div className={styles.checkbox_text_wrapper}>
                Большая территория
              </div>
            }
            check={null}
            setCheck={null}
          />
        </Accordion>
      </div>
      <div
        className={
          mobile ? `${styles.filter_parts_mobile}` : `${styles.filter_parts}`
        }
      >
        <Accordion title={'Для детей'} open={false}>
          <Checkbox
            label={
              <div className={styles.checkbox_text_wrapper}>Детский клуб</div>
            }
            check={null}
            setCheck={null}
          />
          <Checkbox
            label={
              <div className={styles.checkbox_text_wrapper}>
                Детский бассейн
              </div>
            }
            check={null}
            setCheck={null}
          />
          <Checkbox
            label={
              <div className={styles.checkbox_text_wrapper}>
                Детское меню в ресторане
              </div>
            }
            check={null}
            setCheck={null}
          />
        </Accordion>
      </div>
    </>
  );
}
