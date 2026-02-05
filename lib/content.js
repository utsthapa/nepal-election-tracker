import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'content')

// Get all articles from a directory
export function getArticlesFromDir(dir) {
  const fullPath = path.join(CONTENT_DIR, dir)
  
  if (!fs.existsSync(fullPath)) {
    return []
  }

  const files = fs.readdirSync(fullPath)
  const articles = files
    .filter(file => file.endsWith('.mdx') || file.endsWith('.md'))
    .map(file => {
      const filePath = path.join(fullPath, file)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(fileContent)
      
      return {
        slug: file.replace(/\.mdx?$/, ''),
        ...data,
        content,
      }
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return articles
}

// Get a single article by slug
export function getArticleBySlug(dir, slug) {
  const fullPath = path.join(CONTENT_DIR, dir, `${slug}.mdx`)
  
  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContent = fs.readFileSync(fullPath, 'utf-8')
  const { data, content } = matter(fileContent)

  return {
    slug,
    ...data,
    content,
  }
}

// Get all articles
export function getAllArticles() {
  const analysisDir = path.join(CONTENT_DIR, 'analysis')
  
  if (!fs.existsSync(analysisDir)) {
    return []
  }

  const files = fs.readdirSync(analysisDir)
  const articles = files
    .filter(file => file.endsWith('.mdx') || file.endsWith('.md'))
    .map(file => {
      const filePath = path.join(analysisDir, file)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(fileContent)
      
      return {
        slug: file.replace(/\.mdx?$/, ''),
        ...data,
        content,
      }
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return articles
}

// Get articles by category
export function getArticlesByCategory(category) {
  const articles = getAllArticles()
  return articles.filter(article => article.category === category)
}

// Get related articles
export function getRelatedArticles(currentSlug, category, limit = 3) {
  const articles = getArticlesByCategory(category)
  return articles
    .filter(article => article.slug !== currentSlug)
    .slice(0, limit)
}

// Get all categories
export function getAllCategories() {
  const articles = getAllArticles()
  const categories = new Set()
  
  articles.forEach(article => {
    if (article.category) {
      categories.add(article.category)
    }
  })
  
  return Array.from(categories).sort()
}

// Get all tags
export function getAllTags() {
  const articles = getAllArticles()
  const tags = new Set()
  
  articles.forEach(article => {
    if (article.tags) {
      article.tags.forEach(tag => tags.add(tag))
    }
  })
  
  return Array.from(tags).sort()
}

// Search articles
export function searchArticles(query) {
  const articles = getAllArticles()
  const lowerQuery = query.toLowerCase()
  
  return articles.filter(article => {
    const title = (article.title || '').toLowerCase()
    const titleNe = (article.titleNe || '').toLowerCase()
    const excerpt = (article.excerpt || '').toLowerCase()
    const excerptNe = (article.excerptNe || '').toLowerCase()
    const tags = (article.tags || []).join(' ').toLowerCase()
    
    return (
      title.includes(lowerQuery) ||
      titleNe.includes(lowerQuery) ||
      excerpt.includes(lowerQuery) ||
      excerptNe.includes(lowerQuery) ||
      tags.includes(lowerQuery)
    )
  })
}
