import React from 'react';

export default function DataTable({
  columns,
  data,
  actions,
  isLoading,
  emptyMessage = 'Không có dữ liệu',
}) {
  if (isLoading) {
    return (
      <div className="w-full space-y-2 p-4 bg-[#0E0E12] border border-white/10 rounded-lg">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-12 bg-white/5 animate-pulse rounded border border-white/5"
          />
        ))}
      </div>
    );
  }

  if (!data || !data.length) {
    return (
      <div className="w-full text-center py-16 px-4 bg-[#0E0E12] border border-white/10 rounded-lg space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] mx-auto flex items-center justify-center text-lg">
          📂
        </div>
        <p className="text-xs font-mono-lux text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-[#0E0E12] border border-white/10 rounded-lg shadow-xl">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-[#14141C] border-b border-[#D4AF37]/30">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className="px-5 py-4 font-mono-lux uppercase text-[11px] tracking-wider text-slate-300 font-semibold whitespace-nowrap text-left"
              >
                {c.label}
              </th>
            ))}
            {actions && (
              <th className="px-5 py-4 font-mono-lux uppercase text-[11px] tracking-wider text-[#D4AF37] font-semibold whitespace-nowrap text-right">
                Hành Động
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-slate-200">
          {data.map((row, ri) => (
            <tr
              key={row._id || ri}
              className="hover:bg-white/[0.03] transition-colors duration-150"
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className="px-5 py-4 align-middle whitespace-nowrap text-xs text-slate-200"
                >
                  {c.render ? c.render(row) : row[c.key] ?? '—'}
                </td>
              ))}

              {actions && (
                <td className="px-5 py-4 align-middle text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    {actions(row)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}