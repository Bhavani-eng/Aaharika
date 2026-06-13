export const Table = ({ columns, data, keyField = '_id', onRowClick, emptyMessage = 'No data found' }) => (
  <div className="overflow-x-auto rounded-xl border border-border-light bg-surface">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-50/80 border-b border-border-light">
          {columns.map((col) => (
            <th
              key={col.key}
              className={`text-left px-4 py-3.5 font-semibold text-text text-xs uppercase tracking-wider whitespace-nowrap sticky top-0 bg-gray-50/95 ${col.className || ''}`}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border-light">
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="px-4 py-12 text-center text-text-light">
              {emptyMessage}
            </td>
          </tr>
        ) : (
          data.map((row) => (
            <tr
              key={row[keyField]}
              onClick={() => onRowClick?.(row)}
              className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-primary/4' : 'hover:bg-gray-50/50'}`}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-4 text-text ${col.cellClass || ''}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export const TableCard = ({ children }) => (
  <div className="md:hidden space-y-3">
    {children}
  </div>
);

export const MobileTableRow = ({ children, onClick }) => (
  <div
    onClick={onClick}
    className={`card p-4 space-y-2 ${onClick ? 'cursor-pointer card-hover' : ''}`}
  >
    {children}
  </div>
);
