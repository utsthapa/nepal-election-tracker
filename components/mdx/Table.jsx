export function Table({ children }) {
  return (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full bg-neutral rounded-lg overflow-hidden">
        {children}
      </table>
    </div>
  )
}

Table.Head = function TableHead({ children }) {
  return (
    <thead className="bg-neutral/50">
      <tr>{children}</tr>
    </thead>
  )
}

Table.Header = function TableHeader({ children }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
      {children}
    </th>
  )
}

Table.Body = function TableBody({ children }) {
  return <tbody className="divide-y divide-neutral">{children}</tbody>
}

Table.Row = function TableRow({ children }) {
  return <tr className="hover:bg-neutral/30">{children}</tr>
}

Table.Cell = function TableCell({ children }) {
  return (
    <td className="px-4 py-3 text-sm text-gray-300">{children}</td>
  )
}
