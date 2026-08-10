// 질문형 페이지 본문에서 공통으로 쓰는 서술 요소.
// 페이지마다 스타일을 다시 정의하지 않도록 여기서만 관리한다.

const CALLOUT_TONES = {
  blue: 'border-blue-200 bg-blue-50 text-blue-900',
  amber: 'border-amber-200 bg-amber-50 text-amber-900',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  rose: 'border-rose-200 bg-rose-50 text-rose-900',
  slate: 'border-slate-200 bg-slate-50 text-slate-800',
}

export function H2({ id, children }) {
  return (
    <h2
      id={id}
      className="mt-10 mb-4 scroll-mt-24 border-b border-slate-100 pb-2 text-xl font-bold text-slate-900"
    >
      {children}
    </h2>
  )
}

export function H3({ children }) {
  return <h3 className="mt-6 mb-2 text-base font-semibold text-slate-800">{children}</h3>
}

export function P({ children }) {
  return <p className="mb-4 text-[15px] leading-relaxed text-slate-700">{children}</p>
}

export function Ul({ children }) {
  return <ul className="mb-4 list-disc space-y-2 pl-5 text-[15px] text-slate-700">{children}</ul>
}

export function Ol({ children }) {
  return <ol className="mb-4 list-decimal space-y-2 pl-5 text-[15px] text-slate-700">{children}</ol>
}

export function Callout({ tone = 'blue', title, children }) {
  return (
    <div className={`mb-4 rounded-xl border px-4 py-3 text-sm leading-relaxed ${CALLOUT_TONES[tone]}`}>
      {title && <p className="mb-1.5 font-bold">{title}</p>}
      {children}
    </div>
  )
}

/** 계산 과정을 한 줄씩 따라갈 수 있게 보여주는 블록 */
export function Formula({ lines, result }) {
  return (
    <div className="mb-4 overflow-x-auto rounded-xl border border-slate-200 bg-slate-900 px-4 py-3">
      <div className="min-w-max space-y-1 font-mono text-[13px] leading-relaxed text-slate-100">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
        {result && (
          <p className="mt-2 border-t border-slate-700 pt-2 font-semibold text-emerald-300">{result}</p>
        )}
      </div>
    </div>
  )
}

export function Table({ head, rows, emphasizeLast = false }) {
  return (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead className="bg-slate-50">
          <tr>
            {head.map((cell) => (
              <th
                key={cell}
                className="border border-slate-200 px-4 py-2.5 text-left font-semibold text-slate-700"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.join('|')} className={i % 2 === 1 ? 'bg-slate-50/60' : undefined}>
              {row.map((cell, j) => (
                <td
                  key={`${j}-${cell}`}
                  className={`border border-slate-200 px-4 py-2.5 text-slate-700 ${
                    emphasizeLast && j === row.length - 1 ? 'font-semibold text-slate-900' : ''
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** ⑤ 자주 오해하는 부분 — 오해와 실제를 한 쌍으로 대비시킨다 */
export function MythList({ items }) {
  return (
    <div className="mb-4 space-y-3">
      {items.map((item) => (
        <div key={item.myth} className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-rose-700">✕ {item.myth}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
            <span className="font-semibold text-emerald-700">○ </span>
            {item.truth}
          </p>
        </div>
      ))}
    </div>
  )
}
