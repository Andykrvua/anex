import styles from './pagination.module.css';
import Link from 'next/link';

const paginationLinksLimit = 7;
const position = {
  first_page: 'first_page',
  last_page: 'last_page',
  prev_page: 'prev_page',
  next_page: 'next_page',
};

const PrevNextPage = ({ current, pagesCount, pos, firstPageUrl }) => {
  return (
    <li>
      {(current === 1 && pos === position.prev_page) ||
      (pagesCount === current && pos === position.next_page) ? (
        <a className={`${styles[pos]} ${styles.disable}`}>current page</a>
      ) : pos === position.prev_page ? (
        <Link
          href={
            current - 1 === 1
              ? firstPageUrl
              : `${firstPageUrl}/page/${current - 1}`
          }
        >
          <a
            className={
              current === 1
                ? `${styles[pos]} ${styles.disable}`
                : `${styles[pos]}`
            }
          >
            next page
          </a>
        </Link>
      ) : (
        <Link href={`${firstPageUrl}/page/${current + 1}`}>
          <a
            className={
              pagesCount === current
                ? `${styles[pos]} ${styles.disable}`
                : `${styles[pos]}`
            }
          >
            next page
          </a>
        </Link>
      )}
    </li>
  );
};

const FirstLastPage = ({ current, pagesCount, pos, firstPageUrl }) => {
  return (
    <li>
      {(current !== 1 && current !== pagesCount) ||
      (current === 1 && pos === position.last_page) ||
      (current === pagesCount && pos === position.first_page) ? (
        <Link
          href={
            pos === position.first_page
              ? firstPageUrl
              : `${firstPageUrl}/page/${pagesCount}`
          }
        >
          <a>{pos === position.first_page ? `1` : `${pagesCount}`}</a>
        </Link>
      ) : (
        <a className={styles.current}>
          {pos === position.first_page ? `1` : `${pagesCount}`}
        </a>
      )}
    </li>
  );
};

const Page = ({ current, ind, pagesCount, variant, firstPageUrl }) => {
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

  return (
    <li
      style={
        isHidden && ind + 1 !== isDotsRight && ind + 1 !== isDotsLeft
          ? { display: 'none' }
          : {}
      }
    >
      {ind + 1 === current ? (
        <a className={styles.current}>
          {ind + 1 === isDotsRight || ind + 1 === isDotsLeft ? '...' : ind + 1}
        </a>
      ) : (
        <Link
          href={
            ind + 1 === 1 ? firstPageUrl : `${firstPageUrl}/page/${ind + 1}`
          }
        >
          <a>
            {ind + 1 === isDotsRight || ind + 1 === isDotsLeft
              ? '...'
              : ind + 1}
          </a>
        </Link>
      )}
    </li>
  );
};

export default function Pagination({ curr = 1, pagesCount, firstPageUrl }) {
  const current = parseInt(curr);

  return (
    <div>
      {pagesCount > 1 && (
        <ul className={styles.pagination}>
          <PrevNextPage
            current={current}
            pagesCount={pagesCount}
            pos={position.prev_page}
            firstPageUrl={firstPageUrl}
          />
          <FirstLastPage
            current={current}
            pagesCount={pagesCount}
            pos={position.first_page}
            firstPageUrl={firstPageUrl}
          />
          {pagesCount > 2 &&
            Array(pagesCount || 0)
              .fill(null)
              .map((_, ind, arr) => {
                {
                  if (ind === 0 || ind === arr.length - 1) return;
                }
                {
                  if (
                    (pagesCount > paginationLinksLimit &&
                      current === pagesCount) ||
                    (pagesCount > paginationLinksLimit &&
                      current === pagesCount - 1)
                  ) {
                    return (
                      <Page
                        key={ind}
                        current={current}
                        ind={ind}
                        pagesCount={pagesCount}
                        variant={1}
                        firstPageUrl={firstPageUrl}
                      />
                    );
                  }
                }
                {
                  if (
                    pagesCount > paginationLinksLimit &&
                    current === pagesCount - 2
                  ) {
                    return (
                      <Page
                        key={ind}
                        current={current}
                        ind={ind}
                        pagesCount={pagesCount}
                        variant={2}
                        firstPageUrl={firstPageUrl}
                      />
                    );
                  }
                }
                {
                  if (
                    pagesCount > paginationLinksLimit &&
                    current > 3 &&
                    current < pagesCount - 2
                  ) {
                    return (
                      <Page
                        key={ind}
                        current={current}
                        ind={ind}
                        pagesCount={pagesCount}
                        variant={3}
                        firstPageUrl={firstPageUrl}
                      />
                    );
                  }
                }
                {
                  if (pagesCount > paginationLinksLimit) {
                    return (
                      <Page
                        key={ind}
                        current={current}
                        ind={ind}
                        pagesCount={pagesCount}
                        variant={4}
                        firstPageUrl={firstPageUrl}
                      />
                    );
                  }
                }
                {
                  if (pagesCount <= paginationLinksLimit) {
                    return (
                      <Page
                        key={ind}
                        current={current}
                        ind={ind}
                        pagesCount={pagesCount}
                        variant={5}
                        firstPageUrl={firstPageUrl}
                      />
                    );
                  }
                }
              })}
          <FirstLastPage
            current={current}
            pagesCount={pagesCount}
            pos={position.last_page}
            firstPageUrl={firstPageUrl}
          />
          <PrevNextPage
            current={current}
            pagesCount={pagesCount}
            pos={position.next_page}
            firstPageUrl={firstPageUrl}
          />
        </ul>
      )}
    </div>
  );
}
