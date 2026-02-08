export function ArticleStructuredData({ article, language = 'en' }) {
  const title = language === 'ne' && article.titleNe ? article.titleNe : article.title
  const description = language === 'ne' && article.excerptNe ? article.excerptNe : article.excerpt
  const author = language === 'ne' && article.authorNe ? article.authorNe : article.author

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    image: [article.featuredImage],
    datePublished: article.date,
    dateModified: article.date,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'NepaliSoch',
      logo: {
        '@type': 'ImageObject',
        url: 'https://nepalisoch.com/logo.png',
      },
    },
    inLanguage: language === 'ne' ? 'ne-NP' : 'en-US',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebsiteStructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NepaliSoch',
    url: 'https://nepalisoch.com',
    description: 'Data-driven election analysis, polls, and forecasts for Nepal. Interactive tools and in-depth political commentary.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://nepalisoch.com/search',
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'NepaliSoch',
      logo: {
        '@type': 'ImageObject',
        url: 'https://nepalisoch.com/logo.png',
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
