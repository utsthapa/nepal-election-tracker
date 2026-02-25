import { BASE_URL } from '../lib/config';
import { getAllArticles } from '../lib/content';

const routes = [
  '',
  '/simulator/2026',
  '/simulator/2022',
  '/simulator/2017',
  '/elections',
  '/polls',
  '/analysis',
  '/demographics',
  '/nepal-data',
  '/districts',
  '/about',
  '/newsletter',
];

export default function sitemap() {
  const articles = getAllArticles();

  const staticRoutes = routes.map(route => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));

  const articleRoutes = articles.map(article => {
    const date = article.date ? new Date(article.date) : new Date();
    const validDate = isNaN(date.getTime()) ? new Date() : date;

    return {
      url: `${BASE_URL}/analysis/${article.slug}`,
      lastModified: validDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    };
  });

  return [...staticRoutes, ...articleRoutes];
}
