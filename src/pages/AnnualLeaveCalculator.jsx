import React, { useEffect, useMemo, useState } from "react";
import CalculatorTemplate from "../components/CalculatorTemplate";
import { calculateAnnualLeave } from "../lib/calculators/annualLeave";
import { formatNumber, formatDate } from "../lib/formatters";
import { RULES_2026 } from "../config/rules/2026";
import { fetchGuidesBySlugs } from "../lib/api/guides";

const RELATED_GUIDE_SLUGS = [
  "why-second-year-25-days",
  "first-year-26-days",
  "annual-leave-basics",
  "annual-leave-carryover",
  "annual-leave-encashment",
  "unpaid-leave-impact",
  "severance-pay-eligibility",
  "severance-pay-average-wage",
  "payroll-slip-reading",
];

const RELATED_CALCULATORS = [
  { title: "퇴직금 계산기", path: "/calculators/severance-pay" },
  { title: "계산기 허브로 이동", path: "/calculators" },
];

const AnnualLeaveCalculator = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [attendanceRate, setAttendanceRate] = useState(80);
  const [relatedGuides, setRelatedGuides] = useState([]);

  const result = useMemo(() => {
    if (!startDate || !endDate) return null;
    return calculateAnnualLeave(startDate, endDate);
  }, [startDate, endDate]);

  useEffect(() => {
    const loadRelatedGuides = async () => {
      try {
        const guides = await fetchGuidesBySlugs(RELATED_GUIDE_SLUGS);
        const slugOrder = Object.fromEntries(RELATED_GUIDE_SLUGS.map((slug, i) => [slug, i]));
        guides.sort((a, b) => (slugOrder[a.slug] ?? 999) - (slugOrder[b.slug] ?? 999));
        setRelatedGuides(guides);
      } catch (err) {
        console.error("Failed to load related guides:", err);
      }
    };
    loadRelatedGuides();
  }, []);

  const relatedLinks = useMemo(() => {
    const guideLinks = relatedGuides.map((guide, index) => ({
      title: guide.title,
      path: `/guides/${guide.slug}`,
      featured: index === 0,
    }));
    return [...guideLinks, ...RELATED_CALCULATORS];
  }, [relatedGuides]);

  const remainderMonths = result ? result.months % 12 : 0;

  const summaryLines = result && !result.error
    ? [
        `총 발생 연차: ${formatNumber(result.total)}일`,
        `근속기간: ${result.years}년 ${remainderMonths}개월 (기준일 ${formatDate(endDate)})`,
        `회계연도 기준: 1년차 ${formatNumber(result.breakdown[0]?.days || 0)}일${result.breakdown.length >= 2 ? `, 2년차 ${formatNumber(result.breakdown[1]?.days || 0)}일` : ""}`,
        attendanceRate < 80 ? "출근율 80% 미만 가정: 실제 발생 연차가 줄어들 수 있습니다." : "",
      ].filter(Boolean)
    : [
        "입사일과 기준일을 입력하면 예상 연차 발생 일수를 확인할 수 있습니다.",
        "회계연도(1~12월) 기준으로 계산됩니다.",
        "출근율 80% 미만, 휴직 등은 별도 검토가 필요합니다.",
        "계산 결과는 실무 참고용이며 최종 판단은 내부 규정에 따릅니다.",
      ];

  const steps = result && !result.error
    ? [
        `입사일 ${formatDate(startDate)}부터 기준일 ${formatDate(endDate)}까지 ${result.years}년 ${remainderMonths}개월 경과`,
        `1년차(입사년도) 월차: ${formatNumber(result.breakdown[0]?.days || 0)}일`,
        result.breakdown.length >= 2
          ? `2년차: 26 - ${result.breakdown[0]?.days || 0} = ${formatNumber(result.breakdown[1]?.days || 0)}일`
          : "",
        result.breakdown.length >= 3
          ? `3년차 이상: 기본 15일 + 2년마다 1일 가산`
          : "",
        `총 발생 연차 ${formatNumber(result.total)}일`,
      ].filter(Boolean)
    : [
        "입사일과 기준일을 입력",
        "회계연도(1~12월) 기준으로 계산",
        "1년차는 입사년도 월차, 2년차는 26-1년차, 3년차 이상은 15일+가산",
        "출근율/휴직 등 예외를 별도 점검",
      ];

  const exceptions = [
    "출근율이 80% 미만이면 월차 발생이 제한될 수 있습니다.",
    "무급휴직·휴업 기간은 근속 산정에 영향이 있을 수 있습니다.",
    "주 4일/탄력근로 등 소정근로일 변경 시 연차 일수와 임금 환산이 달라집니다.",
    "기간제/단시간 근로자는 근로계약 기간과 실제 근로일을 함께 확인해야 합니다.",
    "연차 촉진제도 운영 여부에 따라 이월·소멸 처리 방식이 달라집니다.",
  ];

  const cases = [
    "사례 1) 2025-03-01 입사, 2026-02-28 퇴사 예정: 1년 미만(11개월 28일) 퇴사이므로 2025년 월차 10일만 발생. 2년차 연차는 차년도 근무를 전제로 하므로 미발생.",
    "사례 2) 2025-03-01 입사, 2026-03-01 이후 퇴사: 1년 이상 근속이므로 2025년 월차 10일 + 2026년 연차 16일(26-10) 발생.",
    "사례 3) 2025-10-26 입사, 2027-11-28 퇴사: 2025년 2일(11~12월), 2026년 24일(26-2), 2027년 15일 발생.",
    "사례 4) 무급휴직 2개월 포함: 월차 2일이 제외될 수 있어 기준일 재계산 필요.",
    "사례 5) 주 4일 근무: 연차 일수는 동일하나, 연차수당 환산 시 통상임금 기준을 다시 확인.",
  ];

  const faqs = [
    {
      question: "연차 발생 기준일은 입사일인가요?",
      answer: "이 계산기는 회계연도(1~12월) 기준으로 계산합니다. 1년차는 입사년도 12월까지 월차, 2년차는 26-1년차 개수로 계산됩니다.",
    },
    {
      question: "1년 미만 기간에는 몇 일이 발생하나요?",
      answer: "입사일이 1일이면 입사월부터, 1일이 아니면 다음 달부터 개근 월마다 1일씩 발생합니다. 최대 11일까지 발생 가능합니다.",
    },
    {
      question: "2년차에 왜 26개가 발생하나요?",
      answer: "1년차 월차 발생분을 감안하여 26 - 1년차 개수로 계산됩니다. 1월 입사(1년차 11개)면 2년차 15개, 10월 입사(1년차 2개)면 2년차 24개가 됩니다.",
    },
    {
      question: "출근율 80% 기준은 어떻게 계산하나요?",
      answer: "소정근로일 대비 실제 출근일 비율을 기준으로 산정합니다.",
    },
    {
      question: "무급휴직 기간도 근속에 포함되나요?",
      answer: "휴직 종류와 회사 규정에 따라 달라질 수 있어 별도 확인이 필요합니다.",
    },
    {
      question: "연차수당은 어떤 임금 기준으로 계산하나요?",
      answer: "통상임금 또는 평균임금 적용 여부를 확인해야 하며 회사 규정도 영향을 줍니다.",
    },
    {
      question: "연차 촉진제도를 운영하면 소멸되나요?",
      answer: "안내 절차를 적법하게 진행한 경우 소멸 처리될 수 있습니다.",
    },
    {
      question: "퇴사 시 미사용 연차는 어떻게 정산하나요?",
      answer: "미사용 연차에 대해 수당 지급이 발생할 수 있으며 산정 기준일을 확인해야 합니다.",
    },
    {
      question: "주 4일 근무자의 연차 일수는 줄어드나요?",
      answer: "연차 일수는 동일하나, 임금 환산 기준이 달라질 수 있습니다.",
    },
    {
      question: "연차 발생 상한은 있나요?",
      answer: `통상 최대 ${RULES_2026.annualLeave.maxTotal}일 한도가 적용됩니다.`,
    },
    {
      question: "계산 결과와 실제 부여 연차가 다를 수 있나요?",
      answer: "회사의 부여 기준일, 휴직 처리, 촉진제도 등 실무 요인이 반영될 수 있습니다.",
    },
  ];

  const sources = [
    "근로기준법상 연차 유급휴가 규정(요약 적용)",
    `기준일: ${RULES_2026.effectiveDate} / 업데이트: ${RULES_2026.updatedAt}`,
    "출근율 요건 및 휴직 처리 기준은 사업장 규정과 행정해석 확인 필요",
  ];

  const keyPoints = [
    "입사일·기준일 기준으로 연차 발생 일수를 계산합니다.",
    "1년 미만 월차 + 1년 이상 연차를 합산합니다.",
    "출근율 80% 미만 구간은 발생 제한 가능성이 있습니다.",
  ];

  const inputGuide = [
    "입사일과 기준일(퇴직 예정일)을 입력합니다.",
    "출근율 가정치를 입력해 예외 가능성을 확인합니다.",
    "휴직/휴업 등 특이사항은 예외 항목을 참고합니다.",
  ];

  const quickStats = [
    { label: "기준일", value: RULES_2026.effectiveDate },
    { label: "업데이트", value: RULES_2026.updatedAt },
    { label: "상한", value: `${RULES_2026.annualLeave.maxTotal}일` },
  ];

  const exampleCalc = {
    title: "예시: 2025-03-01 입사, 2026-02-28 기준",
    input: "입사일 2025-03-01, 기준일 2026-02-28, 출근율 100%",
    output: "발생 연차: 10일 (2025년 3월~12월 월차)",
    note: "1년 미만 퇴사이므로 2년차 연차는 미발생. 2026-03-01 이후까지 근무 시 2년차 연차 16일(26-10)이 발생합니다.",
  };

  const trust = {
    checklist: [
      "입사일/기준일 기준 연차 발생 테이블 확인",
      "출근율 산정 근거와 근태 자료 확보",
      "휴직/휴업 기간 처리 기준 문서화",
      "연차 촉진제도 시행 여부와 안내 기록",
      "연차수당 지급 기준(통상임금/평균임금) 점검",
      "퇴사자 연차 정산 일정과 지급 방식 확인",
    ],
    disputePoints: [
      "기준일을 회계연도로 적용할 때 직원 안내 미흡",
      "무급휴직 기간 포함 여부에 대한 해석 차이",
      "연차 촉진제도 절차 누락으로 인한 소멸 분쟁",
    ],
    notices: [
      "연차 발생일 및 사용기한은 입사일 기준으로 적용되며, 개인별 잔여일수는 포털에서 확인 바랍니다.",
      "연차 미사용 시 촉진 안내를 발송하오니 메일 확인 후 일정 내 사용 계획을 등록해 주세요.",
      "무급휴직/휴업 기간은 연차 발생에 영향을 줄 수 있으니 인사팀에 사전 문의 바랍니다.",
    ],
  };

  const breadcrumbs = [
    { label: "홈", path: "/" },
    { label: "계산기", path: "/calculators" },
    { label: "연차 계산기", path: "/calculators/annual-leave" },
  ];

  return (
    <CalculatorTemplate
      seo={{
        title: "연차 계산기",
        description: "입사일과 기준일을 입력하면 연차 발생 일수를 단계별로 계산합니다.",
        path: "/calculators/annual-leave",
      }}
      breadcrumbs={breadcrumbs}
      title="연차 계산기"
      description="입사일과 기준일 기준으로 발생 가능한 연차 일수를 계산하고, 실무 예외와 FAQ까지 함께 제공합니다."
      updatedAt={RULES_2026.updatedAt}
      summaryLines={summaryLines}
      keyPoints={keyPoints}
      inputGuide={inputGuide}
      quickStats={quickStats}
      exampleCalc={exampleCalc}
      steps={steps}
      exceptions={exceptions}
      cases={cases}
      faqs={faqs}
      sources={sources}
      relatedLinks={relatedLinks}
      trust={trust}
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-600">
            입사일
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="text-sm text-slate-600">
            기준일(퇴직 예정일)
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
        </div>

        <label className="text-sm text-slate-600">
          출근율 가정(%)
          <input
            type="number"
            value={attendanceRate}
            onChange={(event) => setAttendanceRate(Number(event.target.value))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
            min={0}
            max={100}
          />
          <p className="mt-2 text-xs text-slate-400">
            출근율 {attendanceRate}% 기준. 80% 미만이면 월차 발생이 제한될 수 있습니다.
          </p>
        </label>

        {result && result.error && (
          <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-600">
            {result.error}
          </div>
        )}

        {result && !result.error && (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <div className="flex items-baseline justify-between">
              <p className="text-sm text-emerald-700">총 발생 연차</p>
              <p className="text-2xl font-semibold text-emerald-800">
                {formatNumber(result.total)}일
              </p>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              {result.breakdown.map((item) => (
                <div key={item.label} className="flex justify-between">
                  <span>{item.label}</span>
                  <span>{formatNumber(item.days)}일</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <section className="mt-12 space-y-8 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">연차 계산의 핵심 원리</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed">
                연차 유급휴가는 근로기준법 제60조에 따라 발생하며, 근속기간과 출근율에 따라 일수가 결정됩니다.
                <strong>1년 미만 근로자는 1개월 개근 시 1일씩 발생</strong>(최대 11일)하고,
                <strong>1년 이상 근로자는 전년도 80% 이상 출근 시 15일</strong>이 발생합니다.
                3년 이상 근속 시에는 2년마다 1일씩 가산되어 최대 25일까지 받을 수 있습니다.
              <p className="text-slate-700 leading-relaxed mt-4">
                이 계산기는 회계연도(1~12월) 기준으로 계산합니다. 입사년도에는 입사월부터 12월까지 월차가 발생하고,
                2년차에는 26일에서 1년차 발생 개수를 뺀 만큼 발생합니다. 예를 들어 1년차에 10개를 받았다면 2년차에는 16개(26-10)가 발생합니다.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">실무에서 자주 나오는 사례</h2>
            <div className="space-y-6">
              <div className="rounded-lg border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">사례 1. "10년차도 18개인데, 2년차가 왜 26개를 주나요?"</h3>
                <p className="text-slate-700 leading-relaxed">
                  회사에서 가장 많이 나오는 질문입니다. <strong>2년차라서 특별히 많이 주는 것이 아니라</strong>,
                  1년 미만 기간의 월차(최대 11일)와 1년 이상 연차(15일)가 겹쳐 보이는 구조 때문입니다.
                  예를 들어 8월 입사자는 첫 해에 5개(8~12월)를 받고, 다음 해 8월에 15개가 발생하면서
                  한 시점에 20개 넘게 보이는 착시가 발생합니다. 실제로는 기본 15일에 근속에 따라 점진적으로 증가하므로,
                  <strong>장기근속자가 지속적으로 더 많습니다</strong>.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">사례 2. "1년 딱 채우고 퇴사하면 26개인가요?"</h3>
                <p className="text-slate-700 leading-relaxed">
                  대법원 판례와 고용노동부 해석에 따르면, <strong>1년간의 근로를 마친 다음 날에도 근로관계가 유지되어야 15일 연차가 발생</strong>합니다.
                  입사 1년 되는 날(365일) 퇴사하면 월차 11일만 발생하지만,
                  1년 + 1일(366일) 근무 후 퇴사하면 월차 11일 + 연차 15일 = 26일이 발생합니다.
                  퇴사일 하루 차이가 연차 15일, 즉 수백만 원의 수당 차이를 만들 수 있습니다.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">사례 3. "회계연도 기준이면 연차가 여러 번 나뉘나요?"</h3>
                <p className="text-slate-700 leading-relaxed">
                  회계연도(1월~12월) 기준 회사는 연차가 여러 번 나뉘어 발생합니다.
                  8월 입사자의 경우, 입사 첫 해에는 월차 5개가 발생하고, 다음 해 1월에는 근무 비율 계산 후 연차 일부를 선부여하며,
                  입사 1년 되는 8월에 15일이 추가 발생합니다. 직원 입장에서는 '연차가 계속 늘어난다'고 느끼지만
                  실제로는 계산 시점이 나뉜 것뿐입니다.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">자주 묻는 질문 FAQ</h2>
            <div className="space-y-4">
              <div className="rounded-lg bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900 mb-2">Q. 입사일 기준과 회계연도 기준의 차이는?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  입사일 기준은 개인별 입사 기념일에 연차가 발생하고, 회계연도 기준은 매년 1월 1일에 일괄 발생합니다.
                  이 계산기는 회계연도 기준으로, 입사 연도에는 월차로 시작해 다음 해부터 연차로 전환되는 구조입니다.
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900 mb-2">Q. 월차와 연차는 어떻게 다른가요?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  월차는 1년 미만 근로자에게 1개월 개근 시 1일씩 발생하는 휴가(최대 11일)이고,
                  연차는 1년 이상 근로자에게 전년도 출근율 80% 이상 시 발생하는 휴가(기본 15일)입니다.
                  법적으로는 구분되지만 사용 방법은 동일합니다.
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900 mb-2">Q. 연차를 못 쓰면 이월되나요?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  근로기준법은 연차 이월을 원칙적으로 보장하지 않습니다. 이월은 노사 합의(취업규칙, 단체협약 등)로 허용 가능하며,
                  회사가 연차 촉진제도를 적법하게 시행하면 미사용 연차는 소멸되고 수당 지급 의무가 없습니다.
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900 mb-2">Q. 퇴사 시 미사용 연차는 어떻게 되나요?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  퇴사 시에는 미사용 연차에 대해 수당으로 정산하여 지급해야 합니다.
                  정산 기준은 통상임금 또는 평균임금이며, 이월분도 정산 대상에 포함됩니다.
                  연차 촉진제도 시행 여부와 무관하게 퇴사 시에는 수당 지급 의무가 있습니다.
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900 mb-2">Q. 무급휴직 기간은 연차에 영향을 주나요?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  일반 무급휴직은 근로가 아닌 휴직으로 간주되어 근속 기간에서 제외됩니다.
                  단, 육아휴직은 근로한 것으로 간주되어 근속 기간에 포함되고 출근율 계산 시에도 유리하게 적용됩니다.
                  휴직 복귀 시 연차 발생 기준일을 재확인해야 합니다.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">공식 출처 및 참고 자료</h2>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">•</span>
                <span>근로기준법 제60조 (연차 유급휴가)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">•</span>
                <span>근로기준법 시행령 제30조 (연차 촉진제도)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">•</span>
                <span>고용노동부 공식 Q&A (www.moel.go.kr)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">•</span>
                <span>대법원 판례 (연차 발생 시점 관련)</span>
              </li>
            </ul>
            <p className="mt-4 text-sm text-slate-500 leading-relaxed">
              이 계산기는 참고용이며, 최종 판단은 회사의 취업규칙, 단체협약, 노무사 상담 등을 통해 확인하시기 바랍니다.
              특히 휴직, 휴업, 단시간 근로 등 특수한 경우에는 별도의 검토가 필요합니다.
            </p>
          </div>
        </section>
      </div>
    </CalculatorTemplate>
  );
};

export default AnnualLeaveCalculator;
