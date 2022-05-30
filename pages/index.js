import MainForm from '/components/mainform/mainForm.js';
import { useIntl } from 'react-intl';
import PopularCountry from '/components/mainpage/popularCountry.js';
import Blog from '/components/mainpage/blog.js';
import { countryData, blogData } from '/utils/data/countryData';
import Faq from '/components/mainpage/faq.js';
import { accordionData } from 'utils/data/accordionData';
import SeoBlock from '/components/mainpage/seoBlock.js';

export default function Home() {
  const intl = useIntl();

  //нужно для передачи в HEAD
  const title = intl.formatMessage({ id: 'nav.tour' });
  const description = intl.formatMessage({
    id: 'nav.country',
  });

  return (
    <div className="container">
      <MainForm />
      <PopularCountry data={countryData} />
      <Blog data={blogData} />
      <Faq data={accordionData} />
      <SeoBlock />
    </div>
  );
}
