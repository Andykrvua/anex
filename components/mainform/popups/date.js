import { useRef, useEffect } from 'react';
import useOutsideClick from '../../../utils/clickOutside';
import {
  useSetBodyScroll,
  getSize,
  enableScroll,
  clear,
  disableScroll,
  maxWidth,
  BODY,
} from '../../../utils/useBodyScroll';
import Header from './header';
import { svgDate } from '../form-fields/svg';
// import styles from './date.module.css';

export default function Date({
  setModalIsOpen,
  modalIsOpen,
  cName,
  popupName,
}) {
  const size = getSize();
  const wrapperRef = useRef(null);
  const scrollable = useRef(null);

  useOutsideClick(wrapperRef, setModalIsOpen, modalIsOpen, cName);
  useSetBodyScroll(modalIsOpen, maxWidth, size.width);

  useEffect(() => {
    if (size.width < maxWidth) {
      if (modalIsOpen) {
        disableScroll(scrollable.current);
      }
    }
    return () => {
      clear();
    };
  }, [modalIsOpen, size.width]);

  const closeModalHandler = () => {
    if (size.width < maxWidth) {
      enableScroll(BODY);
    }
    setModalIsOpen('');
  };

  // const ttt = setUp();

  return (
    <div className="main_form_popup_mobile_wrapper" ref={wrapperRef}>
      <Header closeModalHandler={closeModalHandler} svg={svgDate} />
      <h3 className="title">{popupName}</h3>
      <div className="popup_scrollable_content" ref={scrollable}>
        222Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit earum
        atque perspiciatis vel molestiae, nostrum aperiam dolores adipisci cum
        nobis eligendi commodi temporibus? Sapiente error similique, molestiae a
        hic aliquid accusantium! Omnis velit sed reprehenderit nemo quia?
        Corporis, repellendus minima consectetur quod nam expedita ratione vitae
        harum quaerat temporibus modi doloribus blanditiis odio voluptate
        quisquam, officiis delectus quae odit consequuntur ex! Dicta molestias
        iusto itaque, eos reiciendis deleniti doloribus officiis placeat, hic
        rem vero id nesciunt perferendis quod officia consectetur repudiandae.
        At impedit vitae, accusantium ut id asperiores vero quod maxime,
        voluptatem praesentium et ex quibusdam, est esse tempora in dicta natus
        necessitatibus molestiae quisquam tempore distinctio sunt? Ex pariatur
        dolore ducimus eligendi hic deleniti quis harum ad ut nisi esse labore,
        explicabo quae. Sit, eius porro! Quo aliquid dignissimos architecto
        quasi officia. Necessitatibus, similique debitis assumenda doloremque
        pariatur perspiciatis non esse aperiam voluptates labore vero obcaecati
        consequuntur culpa ratione praesentium officia quam vitae illo voluptas
        sunt alias! Optio iure commodi culpa suscipit totam excepturi! Placeat
        sint, illo exercitationem expedita voluptatibus pariatur. Sed ea, quasi
        voluptatem quas recusandae dignissimos. Illum nihil modi provident,
        recusandae blanditiis unde laudantium eum libero mollitia ab dolore,
        maxime quae! Quae, eaque! Aspernatur cupiditate ipsam sint repudiandae
        rerum, id deserunt quaerat, molestias quibusdam, eos vitae sunt quis
        ipsum quisquam error ducimus assumenda impedit expedita quos similique
        architecto? Omnis similique deserunt, quae quasi ex, labore quod
        veritatis enim dolores doloribus, explicabo nisi accusamus aperiam
        doloremque. Iure dolore accusamus amet officia ad autem voluptatum
        exercitationem cumque, tenetur a. Incidunt velit magnam esse mollitia
        similique sed nostrum eum blanditiis in pariatur ipsa fuga consectetur,
        ducimus voluptates reprehenderit animi maxime dicta sit, excepturi
        nesciunt alias. A inventore minima nobis mollitia eos consectetur
        voluptatum itaque voluptatibus veniam, perferendis aliquid nostrum
        recusandae ut beatae animi! Doloribus voluptas illo sit quasi. Velit
        alias fuga sit, iusto at cumque temporibus delectus, nesciunt possimus
        quo maxime, ipsa necessitatibus ullam quas tempora qui fugit quae sunt?
        Odit minus dicta rerum possimus soluta consequatur nesciunt quasi
        inventore asperiores aspernatur commodi veniam, fugit quisquam quidem
        fuga doloremque esse! Porro suscipit pariatur quisquam error. Maiores
        eius magni, esse totam vel eos necessitatibus non omnis nesciunt
        deleniti provident numquam enim aperiam eveniet quibusdam accusamus
        voluptas reiciendis reprehenderit similique molestias autem quis.
        Incidunt eum, exercitationem assumenda doloribus corporis atque
        voluptate molestias eaque repellat vel odio tempore placeat sapiente
        officiis fugiat optio qui inventore facilis dolor excepturi? Veniam
        autem qui rem, placeat quam necessitatibus dolore animi deserunt ipsam
        quibusdam assumenda, earum sunt. Vitae, inventore excepturi. Eius
        voluptates dolorem iusto fugit cum expedita? Nihil ab repellendus, iusto
        voluptatem tempora quos culpa ea expedita sapiente consequatur odit et
        modi illo, doloremque ut aliquam dolores repellat totam assumenda.
        Commodi facilis delectus unde libero blanditiis, in sequi laudantium,
        consequatur impedit possimus a inventore at maxime, cumque aliquid.
        Rerum, odio modi consequatur iusto voluptas, dignissimos asperiores
        expedita suscipit nihil, omnis exercitationem cupiditate. Ex sit
        consequuntur architecto placeat, voluptas doloremque nostrum quas ullam
        dolorem quibusdam veritatis ipsum quod expedita eum maxime porro saepe
        vel eos minima molestiae tempore.
      </div>
      <div className="apply_btn_wrapper">
        <button className="apply_btn" onClick={closeModalHandler}>
          Применить
        </button>
      </div>
    </div>
  );
}
