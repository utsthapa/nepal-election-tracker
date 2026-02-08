export function generateArticleMetadata(article, language = 'en') {
  const title = language === 'ne' && article.titleNe ? article.titleNe : article.title
  const description = language === 'ne' && article.excerptNe ? article.excerptNe : article.excerpt
  const author = language === 'ne' && article.authorNe ? article.authorNe : article.author

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
          url: article.featuredImage || '/og-image.jpg',
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
      images: [article.featuredImage || '/og-image.jpg'],
    },
    alternates: {
      canonical: `https://nepalisoch.com/analysis/${article.slug}`,
      languages: {
        en: `https://nepalisoch.com/analysis/${article.slug}`,
        ne: `https://nepalisoch.com/analysis/${article.slug}`,
      },
    },
  }
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
  }
}
