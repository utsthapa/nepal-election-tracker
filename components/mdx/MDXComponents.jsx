import { CodeBlock } from './CodeBlock'
import { Chart } from './Chart'
import { Table } from './Table'
import { Callout } from './Callout'

export const mdxComponents = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-[rgb(24,26,36)] mb-4 mt-8" style={{ fontFamily: 'Lora, serif' }}>{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold text-[rgb(24,26,36)] mb-3 mt-6" style={{ fontFamily: 'Lora, serif' }}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-bold text-[rgb(24,26,36)] mb-2 mt-4" style={{ fontFamily: 'Lora, serif' }}>{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-lg font-semibold text-[rgb(24,26,36)] mb-2 mt-4" style={{ fontFamily: 'Lora, serif' }}>{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-[rgb(100,110,130)] mb-4 leading-relaxed">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-[#B91C1C] hover:text-[#991B1B] underline"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-[rgb(100,110,130)]">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-[rgb(100,110,130)]">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="ml-4">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-[#B91C1C] pl-4 italic text-[rgb(100,110,130)] mb-4">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    // Inline code
    if (!className) {
      return (
        <code className="bg-[rgb(219,211,196)]/30 px-2 py-1 rounded text-sm font-mono text-[#B91C1C]">
          {children}
        </code>
      )
    }
    // Code block
    return <CodeBlock className={className}>{children}</CodeBlock>
  },
  pre: ({ children }) => (
    <pre className="bg-[rgb(219,211,196)]/30 rounded-lg p-4 overflow-x-auto mb-4">
      {children}
    </pre>
  ),
  hr: () => (
    <hr className="border-[rgb(219,211,196)] my-8" />
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-[rgb(24,26,36)]">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-[rgb(100,110,130)]">{children}</em>
  ),
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt}
      className="rounded-lg w-full my-4"
      loading="lazy"
    />
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full bg-white rounded-lg overflow-hidden border border-[rgb(219,211,196)]">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-[rgb(219,211,196)]/30">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-[rgb(219,211,196)]">
      {children}
    </tbody>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-[rgb(219,211,196)]/20">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-xs font-semibold text-[rgb(24,26,36)] uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-sm text-[rgb(100,110,130)]">
      {children}
    </td>
  ),
  Table,
  Chart,
  Callout,
}
