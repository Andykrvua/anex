import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import CategoryList from './categoryList';
import TagsCountryList from './tagsCountryList';
import PostList from './postList';
import Pagination from './pagination';
import { blogApi } from 'utils/constants';

export default function BlogContent({
  br_arr,
  categoryListItems,
  tagsCountryListItems,
  postsList,
  loc,
  curr,
  pagesCount,
  firstPageUrl,
}) {
  return (
    <div className="container">
      <Breadcrumbs data={br_arr} />
      {!categoryListItems.errors && (
        <CategoryList data={categoryListItems} loc={loc} />
      )}

      <TagsCountryList data={tagsCountryListItems} />
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
