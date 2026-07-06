const ZONE_ORDER = ['RED', 'YELLOW', 'BLUE']

const ZONE_META = {
  RED: { label: 'RED', badgeStyle: 'background:#fee2e2;color:#b91c1c;border:1px solid #fecaca;' },
  YELLOW: { label: 'YELLOW', badgeStyle: 'background:#fef3c7;color:#b45309;border:1px solid #fde68a;' },
  BLUE: { label: 'BLUE', badgeStyle: 'background:#dbeafe;color:#1d4ed8;border:1px solid #bfdbfe;' },
}

const STATUS_LABEL = {
  VIOLATION: '위반',
  RISK: '위반 의심',
  CHECK_NEEDED: '확인 필요',
  OK: '이상 없음',
  NOT_APPLICABLE: '해당 없음',
  MANUAL_REVIEW: '전문가 검토 필요',
}

const ZONE_SECTION_TITLE = {
  RED: '⚠ 즉시 조치가 필요한 항목',
  YELLOW: '주의가 필요한 항목',
  BLUE: '참고 확인 항목',
}

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]))
}

function renderFinding(f) {
  const zoneMeta = ZONE_META[f.zone] || ZONE_META.BLUE
  const statusLabel = STATUS_LABEL[f.status] || f.status

  return `
  <div style="border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:12px;">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
      <span style="display:inline-block;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:600;${zoneMeta.badgeStyle}">${zoneMeta.label}</span>
      <span style="font-size:13px;color:#475569;">${escapeHtml(statusLabel)}</span>
      <strong style="font-size:15px;color:#0f172a;">${escapeHtml(f.title)}</strong>
    </div>
    <p style="margin:6px 0;font-size:13px;color:#334155;"><b>회사 문서 근거:</b> ${escapeHtml(f.evidence)}</p>
    <p style="margin:6px 0;font-size:13px;color:#334155;">${escapeHtml(f.explanation)}</p>
    <p style="margin:6px 0;font-size:13px;color:#334155;"><b>법적 근거:</b> ${escapeHtml(f.basis_citation)}</p>
    ${f.risk_detail ? `<p style="margin:6px 0;font-size:13px;color:#334155;"><b>방치 시 리스크:</b> ${escapeHtml(f.risk_detail)}</p>` : ''}
    ${f.recommendation ? `<p style="margin:6px 0;font-size:13px;color:#334155;"><b>권고 조치:</b> ${escapeHtml(f.recommendation)}</p>` : ''}
    ${f.status === 'CHECK_NEEDED' && f.self_check_question ? `<p style="margin:6px 0;font-size:13px;color:#7c2d12;"><b>확인 필요:</b> ${escapeHtml(f.self_check_question)}</p>` : ''}
  </div>`
}

export function buildReportHtml(diagnosisResult) {
  const { company_summary: summary, findings = [] } = diagnosisResult

  const byZone = { RED: [], YELLOW: [], BLUE: [] }
  for (const f of findings) {
    if (byZone[f.zone]) byZone[f.zone].push(f)
  }

  const sections = ZONE_ORDER.filter((zone) => byZone[zone].length > 0)
    .map((zone) => `
    <section style="margin-bottom:24px;">
      <h2 style="font-size:16px;color:#0f172a;margin-bottom:10px;">${ZONE_SECTION_TITLE[zone]} (${byZone[zone].length}건)</h2>
      ${byZone[zone].map(renderFinding).join('')}
    </section>`)
    .join('')

  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif;color:#1e293b;">
  <h1 style="font-size:20px;color:#0f172a;">${escapeHtml(summary?.headline || '노무진단 결과')}</h1>
  <p style="font-size:13px;color:#64748b;">
    상시근로자 규모: ${escapeHtml(summary?.employee_band)} · 최종 개정연도: ${escapeHtml(summary?.last_revision_year || '미기재')} · 종합 등급: <b>${escapeHtml(summary?.overall_grade)}</b>
  </p>
  ${sections}
  <p style="font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px;margin-top:24px;">
    본 진단은 제출된 문서에 대한 1차 점검 결과이며 법률 자문이 아닙니다. 최종 판단은 노무사 등 전문가 확인을 권장합니다.
  </p>
</div>`
}
