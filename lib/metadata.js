import { BASE_URL } from './config';

const loc = (en, ne, language) => (language === 'ne' && ne ? ne : en);

export function generateArticleMetadata(article, language = 'en') {
  const title = loc(article.title, article.titleNe, language);
  const description = loc(article.excerpt, article.excerptNe, language);
  const author = loc(article.author, article.authorNe, language);

  return {
    title: `${title} | NepaliSoch`,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: article.date,
      authors: [author],
      images: [
        {
          url: `${BASE_URL}${article.featuredImage || '/images/og-default.png'}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: language === 'ne' ? 'ne_NP' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}${article.featuredImage || '/images/og-default.png'}`],
    },
    alternates: {
      canonical: `${BASE_URL}/analysis/${article.slug}`,
      languages: {
        en: `${BASE_URL}/analysis/${article.slug}`,
        ne: `${BASE_URL}/analysis/${article.slug}`,
      },
    },
  };
}

export function generatePageMetadata(title, description, language = 'en') {
  return {
    title: `${title} | NepaliSoch`,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: language === 'ne' ? 'ne_NP' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
