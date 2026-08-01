export default function DataTable({
  columns, data, actions,
  isLoading, emptyMessage = 'Không có dữ liệu',
}) {
  if (isLoading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="skeleton"
          style={{ height: 52, background: 'var(--card)' }} />
      ))}
    </div>
  );

  if (!data?.length) return (
    <div style={{
      textAlign: 'center', padding: '48px 0',
      background: 'var(--card)', border: '1px solid var(--border)',
    }}>
      <p style={{ fontSize: 16, color: 'var(--muted)' }}>{emptyMessage}</p>
    </div>
  );

  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--border)' }}>
      <table className="lux-table">
        <thead>
          <tr>
            {columns.map(c => <th key={c.key}>{c.label}</th>)}
            {actions && <th style={{ textAlign: 'right' }}>Hành động</th>}
          </tr>
        </thead>
        <tbody>
  {data.map((row, ri) => (
    <tr
      key={row._id || ri}
      style={{
        borderBottom: "1px solid #2d2d2d",
      }}
    >
          {columns.map((c) => (
            <td
              key={c.key}
              style={{
                padding: "16px 20px",
                verticalAlign: "middle",
                whiteSpace: "nowrap",
              }}
            >
              {c.render ? c.render(row) : (row[c.key] ?? "—")}
            </td>
          ))}

          {actions && (
            <td
              style={{
                padding: "16px 20px",
                textAlign: "right",
                whiteSpace: "nowrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
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