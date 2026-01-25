import React, { useMemo, useState } from "react";
import CalculatorTemplate from "../components/CalculatorTemplate";
import { calculateAnnualLeave } from "../lib/calculators/annualLeave";
import { formatNumber, formatDate } from "../lib/formatters";
import { RULES_2026 } from "../config/rules/2026";

const AnnualLeaveCalculator = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [attendanceRate, setAttendanceRate] = useState(80);

  const result = useMemo(() => {
    if (!startDate || !endDate) return null;
    return calculateAnnualLeave(startDate, endDate);
  }, [startDate, endDate]);

  const remainderMonths = result ? result.months % 12 : 0;

  const summaryLines = result && !result.error
    ? [
        `총 발생 연차: ${formatNumber(result.total)}일`,
        `근속기간: ${result.years}년 ${remainderMonths}개월 (기준일 ${formatDate(endDate)})`,
        result.months < 12
          ? `1년 미만 구간 월차 ${formatNumber(result.breakdown[0]?.days || 0)}일 발생`
          : "",
        result.months >= 12
          ? `1년 이상 구간은 기본 ${RULES_2026.annualLeave.baseAfterOneYear}일 + 가산 연차 적용`
          : "",
        attendanceRate < 80 ? "출근율 80% 미만 가정: 실제 발생 연차가 줄어들 수 있습니다." : "",
      ].filter(Boolean)
    : [
        "입사일과 기준일을 입력하면 예상 연차 발생 일수를 확인할 수 있습니다.",
        "출근율 80% 미만, 휴직 등은 별도 검토가 필요합니다.",
        "계산 결과는 실무 참고용이며 최종 판단은 내부 규정에 따릅니다.",
      ];

  const steps = result && !result.error
    ? [
        `입사일 ${formatDate(startDate)}부터 기준일 ${formatDate(endDate)}까지 ${result.years}년 ${remainderMonths}개월 경과`,
        `1년 미만 구간 월차 합계 ${formatNumber(result.breakdown[0]?.days || 0)}일`,
        result.months >= 12
          ? `1년 이상 구간 기본 ${RULES_2026.annualLeave.baseAfterOneYear}일 + 2년마다 ${RULES_2026.annualLeave.extraPerTwoYears}일 가산(최대 ${RULES_2026.annualLeave.maxTotal}일)`
          : "",
        `총 발생 연차 ${formatNumber(result.total)}일`,
      ].filter(Boolean)
    : [
        "입사일과 기준일을 입력",
        "근속기간을 월 단위로 계산",
        "1년 미만 월차 + 1년 이상 연차를 합산",
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
    "사례 1) 2025-03-01 입사, 2026-02-28 퇴사 예정: 1년 미만 구간 월차 11일 발생, 2026-03-01 이후 2년차 기본 15일이 발생.",
    "사례 2) 무급휴직 2개월 포함: 월차 2일이 제외될 수 있어 기준일 재계산 필요.",
    "사례 3) 주 4일 근무: 연차 일수는 동일하나, 연차수당 환산 시 통상임금 기준을 다시 확인.",
  ];

  const faqs = [
    {
      question: "연차 발생 기준일은 입사일인가요?",
      answer: "통상 입사일을 기준으로 하나, 회사 규정에 따라 회계연도 기준을 적용할 수 있습니다.",
    },
    {
      question: "1년 미만 기간에는 몇 일이 발생하나요?",
      answer: "매월 1일씩 발생하되, 출근율 요건 충족 여부를 함께 확인해야 합니다.",
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

  const relatedLinks = [
    { title: "퇴직금 계산기", path: "/calculators/severance-pay" },
    { title: "연차 기본 규칙 한 장 요약", path: "/guides/annual-leave-basics" },
    { title: "연차 이월 기준과 소멸 시점", path: "/guides/annual-leave-carryover" },
    { title: "연차수당 정산 시 흔한 오류", path: "/guides/annual-leave-encashment" },
    { title: "무급휴직이 연차/퇴직금에 미치는 영향", path: "/guides/unpaid-leave-impact" },
    { title: "퇴직금 지급 대상 판단 기준", path: "/guides/severance-pay-eligibility" },
    { title: "평균임금 산정 시 포함/제외 항목", path: "/guides/severance-pay-average-wage" },
    { title: "급여명세서 읽는 법", path: "/guides/payroll-slip-reading" },
    { title: "계산기 허브로 이동", path: "/calculators" },
  ];

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
      </div>
    </CalculatorTemplate>
  );
};

export default AnnualLeaveCalculator;
