import DynamicWrapper from './dynamicWrapper';

export default function MainFormBtn({
  cName,
  title,
  aria,
  svg,
  SecondaryBtn = null,
  modalIsOpen,
  setModalIsOpen,
  children,
}) {
  const clickHandler = () => {
    if (modalIsOpen === cName) {
      // if popup is open and we click on the same button - close popup
      setModalIsOpen('');
    } else {
      setModalIsOpen(cName);
    }
  };

  return (
    <div className={`main_formfield_wrapper wrapper_${cName}`}>
      <button
        className={
          modalIsOpen === cName
            ? `main_formfield open ${cName}`
            : `main_formfield ${cName}`
        }
        onClick={clickHandler}
        aria-label={aria}
      >
        <div>
          <span
            className="formfield_btn_icon"
            dangerouslySetInnerHTML={{ __html: svg }}
          ></span>
          <span className="formfield_btn_title">{title}</span>
        </div>
      </button>
      {SecondaryBtn && <SecondaryBtn />}
      <DynamicWrapper modalIsOpen={modalIsOpen} cName={cName}>
        {children}
      </DynamicWrapper>
    </div>
  );
}
