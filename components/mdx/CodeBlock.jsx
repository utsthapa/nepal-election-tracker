export function CodeBlock({ className, children }) {
  const language = className?.replace(/language-/, '') || 'text'
  
  return (
    <div className="relative">
      <div className="absolute top-2 right-2 text-xs text-gray-800 font-mono">
        {language}
      </div>
      <pre className="bg-neutral rounded-lg p-4 overflow-x-auto mb-4">
        <code className={className}>{children}</code>
      </pre>
    </div>
  )
}
