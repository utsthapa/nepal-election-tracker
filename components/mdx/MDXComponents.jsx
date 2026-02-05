import { CodeBlock } from './CodeBlock'
import { Chart } from './Chart'
import { Table } from './Table'
import { Callout } from './Callout'

export const mdxComponents = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-white mb-4 mt-8">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold text-white mb-3 mt-6">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-bold text-white mb-2 mt-4">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-lg font-semibold text-white mb-2 mt-4">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-blue-400 hover:text-blue-300 underline"
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-gray-300">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-300">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="ml-4">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400 mb-4">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    // Inline code
    if (!className) {
      return (
        <code className="bg-neutral px-2 py-1 rounded text-sm font-mono text-blue-300">
          {children}
        </code>
      )
    }
    // Code block
    return <CodeBlock className={className}>{children}</CodeBlock>
  },
  pre: ({ children }) => (
    <pre className="bg-neutral rounded-lg p-4 overflow-x-auto mb-4">
      {children}
    </pre>
  ),
  hr: () => (
    <hr className="border-neutral my-8" />
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-white">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-gray-300">{children}</em>
  ),
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt}
      className="rounded-lg w-full my-4"
      loading="lazy"
    />
  ),
  table: Table,
  Chart,
  Callout,
}
