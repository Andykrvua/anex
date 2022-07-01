import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import CategoryList from './categoryList';
import TagsCountryList from './tagsCountryList';
import PostList from './postList';
import Pagination from './pagination';
import { blogApi } from 'utils/constants';

export default function BlogContent({
  br_arr,
  categoryListItems,
  countryListItems,
  postsList,
  loc,
  curr,
  pagesCount,
  firstPageUrl,
  active = null,
}) {
  return (
    <div className="container">
      <Breadcrumbs data={br_arr} />
      {!categoryListItems.errors && (
        <CategoryList data={categoryListItems} loc={loc} active={active} />
      )}

      <TagsCountryList countryListItems={countryListItems} loc={loc} />
      <PostList data={postsList.data} loc={loc} />
      {postsList.meta.total_count > blogApi.announceLimit && (
        <Pagination
          curr={curr}
          pagesCount={pagesCount}
          firstPageUrl={firstPageUrl}
        />
      )}
    </div>
  );
}
