import styles from './pagination.module.css';
import Link from 'next/link';

const paginationLinksLimit = 7;
const POSITION = {
  first_page: 'first_page',
  last_page: 'last_page',
  prev_page: 'prev_page',
  next_page: 'next_page',
};

function buildHref(page, firstPageUrl, filterStr) {
  return page === 1
    ? `${firstPageUrl}${filterStr}`
    : `${firstPageUrl}/page/${page}${filterStr}`;
}

const NavLink = ({
  targetPage,
  onPageChange,
  firstPageUrl,
  filterStr,
  className,
  children,
}) => {
  if (onPageChange) {
    return (
      <button
        type="button"
        onClick={() => onPageChange(targetPage)}
        className={className}
      >
        {children}
      </button>
    );
  }
  return (
    <Link href={buildHref(targetPage, firstPageUrl, filterStr)}>
      <a className={className}>{children}</a>
    </Link>
  );
};

const PrevNextPage = ({
  current,
  pagesCount,
  pos,
  firstPageUrl,
  filterStr,
  onPageChange,
}) => {
  const isDisabled =
    (current === 1 && pos === POSITION.prev_page) ||
    (pagesCount === current && pos === POSITION.next_page);
  const targetPage = pos === POSITION.prev_page ? current - 1 : current + 1;

  if (isDisabled) {
    return (
      <li>
        <a className={`${styles[pos]} ${styles.disable}`}>current page</a>
      </li>
    );
  }

  return (
    <li>
      <NavLink
        targetPage={targetPage}
        onPageChange={onPageChange}
        firstPageUrl={firstPageUrl}
        filterStr={filterStr}
        className={styles[pos]}
      >
        {pos === POSITION.prev_page ? 'prev page' : 'next page'}
      </NavLink>
    </li>
  );
};

const FirstLastPage = ({
  current,
  pagesCount,
  pos,
  firstPageUrl,
  filterStr,
  onPageChange,
}) => {
  const isFirst = pos === POSITION.first_page;
  const label = isFirst ? 1 : pagesCount;
  const shouldRenderLink =
    (current !== 1 && current !== pagesCount) ||
    (current === 1 && pos === POSITION.last_page) ||
    (current === pagesCount && pos === POSITION.first_page);

  if (!shouldRenderLink) {
    return (
      <li>
        <a className={styles.current}>{label}</a>
      </li>
    );
  }

  return (
    <li>
      <NavLink
        targetPage={label}
        onPageChange={onPageChange}
        firstPageUrl={firstPageUrl}
        filterStr={filterStr}
      >
        {label}
      </NavLink>
    </li>
  );
};

const Page = ({
  current,
  ind,
  pagesCount,
  variant,
  firstPageUrl,
  filterStr,
  onPageChange,
}) => {
  let isHidden = false;
  let isDotsRight = 0;
  let isDotsLeft = 0;
  if (variant === 1) {
    isHidden = ind + 1 > 3 && ind + 1 < pagesCount - 2;
    isDotsLeft = parseInt(pagesCount / 2 + 1);
  } else if (variant === 2) {
    isHidden = ind + 1 > 2 && ind + 1 < pagesCount - 3;
    isDotsLeft = parseInt((current - 1) / 2 + 2);
  } else if (variant === 3) {
    isHidden = !(
      current + 1 === ind + 1 ||
      current - 1 === ind + 1 ||
      current === ind + 1
    );
    isDotsLeft = parseInt((current - 1) / 2 + 1);
    isDotsRight = parseInt((pagesCount - 1 - (current + 1)) / 2 + current + 2);
  } else if (variant === 4) {
    isHidden = ind + 1 > 5;
    isDotsRight = parseInt((pagesCount - 5) / 2 + 5);
  }

  const page = ind + 1;
  const isDots = page === isDotsRight || page === isDotsLeft;
  const label = isDots ? '...' : page;

  return (
    <li
      style={
        isHidden && page !== isDotsRight && page !== isDotsLeft
          ? { display: 'none' }
          : {}
      }
    >
      {page === current ? (
        <a className={styles.current}>{label}</a>
      ) : (
        <NavLink
          targetPage={page}
          onPageChange={onPageChange}
          firstPageUrl={firstPageUrl}
          filterStr={filterStr}
        >
          {label}
        </NavLink>
      )}
    </li>
  );
};

export default function Pagination({
  curr = 1,
  pagesCount,
  firstPageUrl,
  filter = null,
  onPageChange = null,
}) {
  const filterStr = filter ? `/?f=${filter}` : '';
  const current = parseInt(curr);

  if (!pagesCount || pagesCount <= 1) return null;

  const shared = { firstPageUrl, filterStr, onPageChange, current, pagesCount };

  return (
    <div>
      <ul className={styles.pagination}>
        <PrevNextPage {...shared} pos={POSITION.prev_page} />
        <FirstLastPage {...shared} pos={POSITION.first_page} />
        {pagesCount > 2 &&
          Array(pagesCount || 0)
            .fill(null)
            .map((_, ind, arr) => {
              if (ind === 0 || ind === arr.length - 1) return null;

              let variant = 5;
              if (pagesCount > paginationLinksLimit) {
                if (current === pagesCount || current === pagesCount - 1) {
                  variant = 1;
                } else if (current === pagesCount - 2) {
                  variant = 2;
                } else if (current > 3 && current < pagesCount - 2) {
                  variant = 3;
                } else {
                  variant = 4;
                }
              }

              return <Page key={ind} ind={ind} variant={variant} {...shared} />;
            })}
        <FirstLastPage {...shared} pos={POSITION.last_page} />
        <PrevNextPage {...shared} pos={POSITION.next_page} />
      </ul>
    </div>
  );
}
