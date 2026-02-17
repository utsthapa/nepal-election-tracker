import { getAllArticles } from '../lib/content';

const baseUrl = 'https://nepalvotes.com';

const routes = [
  '',
  '/simulator',
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
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));

  const articleRoutes = articles.map(article => {
    const date = article.date ? new Date(article.date) : new Date();
    const validDate = isNaN(date.getTime()) ? new Date() : date;

    return {
      url: `${baseUrl}/analysis/${article.slug}`,
      lastModified: validDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    };
  });

  return [...staticRoutes, ...articleRoutes];
}
