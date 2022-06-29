import styles from './categoryList.module.css';
import Link from 'next/link';
import { links } from 'utils/links';
import { GetLangField } from 'utils/getLangField';

export default function CategoryList({ data, loc }) {
  return (
    <ul className={styles.category_list}>
      {data.map((item, index) => {
        return (
          <li key={index}>
            <Link href={`${links.blog}/category/${item.slug}`}>
              <a className={styles.category_item}>
                {GetLangField(item.translations, 'languages_id', 'name', loc)}
              </a>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
