/**
 * MDX Components Mapping
 * Server-safe components for use with next-mdx-remote/rsc
 */

import Image from 'next/image';
import { Children, isValidElement } from 'react';
import { Callout } from '../../components/mdx/Callout';
import { CodeBlock } from '../../components/mdx/CodeBlock';
import { Table } from '../../components/mdx/Table';
import { MDXBarChart, MDXLineChart, MDXMultiBarChart, MDXPieChart } from './mdx-charts';

const BLOCK_LIKE_TAGS = new Set([
  'div',
  'p',
  'ul',
  'ol',
  'li',
  'table',
  'thead',
  'tbody',
  'tr',
  'td',
  'th',
  'blockquote',
  'pre',
  'hr',
  'h1',
  'h2',
  'h3',
  'h4',
]);

function hasBlockChildren(children) {
  return Children.toArray(children).some(child => {
    if (!isValidElement(child)) {
      return false;
    }
    const type = child.type;
    return typeof type === 'string' && BLOCK_LIKE_TAGS.has(type);
  });
}

export const MDXArticleComponents = {
  // Headings
  h1: ({ children }) => (
    <h1
      className="text-3xl font-bold text-[rgb(24,26,36)] mb-4 mt-8"
      style={{ fontFamily: 'Lora, serif' }}
    >
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2
      className="text-2xl font-bold text-[rgb(24,26,36)] mb-3 mt-6"
      style={{ fontFamily: 'Lora, serif' }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      className="text-xl font-bold text-[rgb(24,26,36)] mb-2 mt-4"
      style={{ fontFamily: 'Lora, serif' }}
    >
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4
      className="text-lg font-semibold text-[rgb(24,26,36)] mb-2 mt-4"
      style={{ fontFamily: 'Lora, serif' }}
    >
      {children}
    </h4>
  ),

  // Text
  p: ({ children }) => {
    if (hasBlockChildren(children)) {
      return <div className="text-[rgb(100,110,130)] mb-4 leading-relaxed">{children}</div>;
    }
    return <p className="text-[rgb(100,110,130)] mb-4 leading-relaxed">{children}</p>;
  },
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
  strong: ({ children }) => <strong className="font-bold text-[rgb(24,26,36)]">{children}</strong>,
  em: ({ children }) => <em className="italic text-[rgb(100,110,130)]">{children}</em>,

  // Lists
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-[rgb(100,110,130)]">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-[rgb(100,110,130)]">{children}</ol>
  ),
  li: ({ children }) => <li className="ml-4">{children}</li>,

  // Blockquote
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-[#B91C1C] pl-4 italic text-[rgb(100,110,130)] mb-4">
      {children}
    </blockquote>
  ),

  // Code
  code: ({ children, className }) => {
    if (!className) {
      return (
        <code className="bg-[rgb(219,211,196)]/30 px-2 py-1 rounded text-sm font-mono text-[#B91C1C]">
          {children}
        </code>
      );
    }
    return <CodeBlock className={className}>{children}</CodeBlock>;
  },
  pre: ({ children }) => (
    <pre className="bg-[rgb(219,211,196)]/30 rounded-lg p-4 overflow-x-auto mb-4">{children}</pre>
  ),

  // Divider
  hr: () => <hr className="border-[rgb(219,211,196)] my-8" />,

  // Image
  img: ({ src, alt }) => (
    <div className="relative w-full aspect-video my-4">
      <Image src={src} alt={alt || ''} fill className="rounded-lg object-cover" />
    </div>
  ),

  // Table
  table: ({ children }) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full bg-white rounded-lg overflow-hidden border border-[rgb(219,211,196)]">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-[rgb(219,211,196)]/30">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-[rgb(219,211,196)]">{children}</tbody>,
  tr: ({ children }) => <tr className="hover:bg-[rgb(219,211,196)]/20">{children}</tr>,
  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-xs font-semibold text-[rgb(24,26,36)] uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="px-4 py-3 text-sm text-[rgb(100,110,130)]">{children}</td>,

  // Pull Quote — styled callout used throughout articles
  PullQuote: ({ children }) => (
    <blockquote className="my-8 px-6 py-5 bg-[rgb(250,249,246)] border-l-4 border-[#B91C1C] rounded-r-lg">
      <div className="text-lg font-medium text-[rgb(24,26,36)] leading-relaxed italic m-0">
        {children}
      </div>
    </blockquote>
  ),

  // Sidebar — inset box for supplementary context
  Sidebar: ({ title, children }) => (
    <aside className="my-6 p-5 bg-[rgb(250,249,246)] border border-[rgb(219,211,196)] rounded-lg text-sm text-[rgb(100,110,130)] leading-relaxed">
      {title && (
        <p className="text-xs font-bold uppercase tracking-wider text-[#B91C1C] mb-3">{title}</p>
      )}
      {children}
    </aside>
  ),

  // KeyFindings — highlighted summary box at article top
  KeyFindings: ({ children }) => (
    <div className="my-6 p-5 bg-blue-50 border border-blue-200 rounded-lg">{children}</div>
  ),

  // Custom components
  Table,
  Callout,

  // Chart components (client-side)
  BarChart: MDXBarChart,
  LineChart: MDXLineChart,
  MultiBarChart: MDXMultiBarChart,
  PieChart: MDXPieChart,
};
