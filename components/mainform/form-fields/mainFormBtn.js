import DynamicWrapper from './dynamicWrapper';

export default function MainFormBtn({
      cName,
      title,
      aria,
      svg,
      SecondaryBtn = null,
      plusDays = null,
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
        <span className="main_formfield_inner">
          <span
              className="formfield_btn_icon"
              dangerouslySetInnerHTML={{ __html: svg }}
          ></span>
          <span className="formfield_btn_title">
            {title}
            {cName === 'btn_date' && (
                <span className="formfield_btn_title_plusdays">
                {'+'}
                  {plusDays}
              </span>
            )}
          </span>
        </span>
        </button>
        {SecondaryBtn && <SecondaryBtn />}
        <DynamicWrapper modalIsOpen={modalIsOpen} cName={cName}>
          {children}
        </DynamicWrapper>
      </div>
  );
}
