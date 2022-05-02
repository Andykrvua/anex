export default function Test() {
  return (
    <style global jsx>{`
      .react-datepicker {
        position: relative;
      }

      .react-datepicker__header {
        position: relative;
        text-align: center;
      }

      .react-datepicker__current-month {
        line-height: 50px;
        text-transform: capitalize;
      }

      .react-datepicker__navigation {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        top: 5px;
        width: 40px;
        height: 40px;
        padding: 0;
        border: 1px solid var(--line);
        text-indent: -999em;
        cursor: pointer;
        overflow: hidden;
        z-index: 1;
        background: url(assets/img/svg/arrow.svg) var(--font-white) no-repeat;
      }

      .react-datepicker__navigation--previous {
        left: 5px;
        transform: rotate(180deg);
        box-shadow: var(--arrow-btn-shadow-up);
      }

      .react-datepicker__navigation--next {
        right: 5px;
        box-shadow: var(--arrow-btn-shadow);
      }

      .react-datepicker__month {
        margin: 5px 0;
      }

      .react-datepicker__day-names,
      .react-datepicker__week {
        display: flex;
        justify-content: space-between;
        white-space: nowrap;
      }

      .react-datepicker__day {
        width: 40px;
        margin: 5px 0;
        text-align: center;
        border: 1px solid transparent;
        line-height: 38px;
      }

      .react-datepicker__day-name {
        width: 40px;
        font-size: 12px;
        line-height: 36px;
        color: var(--primary-light);
      }

      .react-datepicker__day,
      .react-datepicker__month-text,
      .react-datepicker__quarter-text,
      .react-datepicker__year-text {
        cursor: pointer;
      }

      .react-datepicker__day:hover:not(.react-datepicker__day--disabled),
      .react-datepicker__month-text:hover,
      .react-datepicker__quarter-text:hover,
      .react-datepicker__year-text:hover {
        border: 1px solid var(--line);
        border-radius: var(--def-radius);
        font-weight: 600;
        background-color: var(--white);
      }

      .react-datepicker__day--today,
      .react-datepicker__month-text--today,
      .react-datepicker__quarter-text--today,
      .react-datepicker__year-text--today {
        font-weight: 600;
      }

      .react-datepicker__day--highlighted-custom-1,
      .react-datepicker__month-text--highlighted-custom-1,
      .react-datepicker__quarter-text--highlighted-custom-1,
      .react-datepicker__year-text--highlighted-custom-1 {
        color: magenta;
      }

      .react-datepicker__day--highlighted-custom-2,
      .react-datepicker__month-text--highlighted-custom-2,
      .react-datepicker__quarter-text--highlighted-custom-2,
      .react-datepicker__year-text--highlighted-custom-2 {
        border: 1px solid var(--line);
        border-radius: var(--def-radius);
        background-color: var(--white);
      }

      .react-datepicker__day--selected,
      .react-datepicker__day--in-selecting-range,
      .react-datepicker__day--in-range,
      .react-datepicker__month-text--selected,
      .react-datepicker__month-text--in-selecting-range,
      .react-datepicker__month-text--in-range,
      .react-datepicker__quarter-text--selected,
      .react-datepicker__quarter-text--in-selecting-range,
      .react-datepicker__quarter-text--in-range,
      .react-datepicker__year-text--selected,
      .react-datepicker__year-text--in-selecting-range,
      .react-datepicker__year-text--in-range {
        border: 1px solid var(--line);
        border-radius: var(--def-radius);
        font-weight: 600;
        background-color: var(--white);
        color: var(--secondary);
      }

      .react-datepicker__day--keyboard-selected,
      .react-datepicker__month-text--keyboard-selected,
      .react-datepicker__quarter-text--keyboard-selected,
      .react-datepicker__year-text--keyboard-selected {
        border: 1px solid var(--line);
        border-radius: var(--def-radius);
        background-color: var(--white);
        color: var(--secondary);
      }

      .react-datepicker__day--keyboard-selected:hover,
      .react-datepicker__month-text--keyboard-selected:hover,
      .react-datepicker__quarter-text--keyboard-selected:hover,
      .react-datepicker__year-text--keyboard-selected:hover {
        background-color: #1d5d90;
      }

      .react-datepicker__day--disabled,
      .react-datepicker__month-text--disabled,
      .react-datepicker__quarter-text--disabled,
      .react-datepicker__year-text--disabled {
        cursor: default;
        color: var(--placeholder);
      }

      .react-datepicker__day--disabled:hover,
      .react-datepicker__month-text--disabled:hover,
      .react-datepicker__quarter-text--disabled:hover,
      .react-datepicker__year-text--disabled:hover {
        background-color: transparent;
      }

      .react-datepicker__close-icon {
        position: absolute;
        top: 0;
        right: 0;
        display: table-cell;
        vertical-align: middle;
        height: 100%;
        padding: 0 6px 0 0;
        border: 0;
        cursor: pointer;
        background-color: transparent;
        outline: 0;
      }

      .react-datepicker__close-icon::after {
        content: '×';
        display: table-cell;
        text-align: center;
        vertical-align: middle;
        width: 16px;
        height: 16px;
        padding: 2px;
        border-radius: 50%;
        font-size: 12px;
        line-height: 1;
        cursor: pointer;
        background-color: #216ba5;
        color: #fff;
      }

      .react-datepicker__today-button {
        clear: left;
        text-align: center;
        padding: 5px 0;
        border-top: 1px solid #aeaeae;
        font-weight: bold;
        cursor: pointer;
        background: #f0f0f0;
      }
    `}</style>
  );
}
