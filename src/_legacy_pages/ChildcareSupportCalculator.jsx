import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CalculatorTemplate from "../components/CalculatorTemplate";
import ContinueReading from "../components/ContinueReading";
import { SITE_CONFIG } from "../config/siteConfig";
import { TOPIC_GUIDES } from "../config/contentLinks";
import { calculateChildcareSupport } from "../lib/calculators/childcareSupport";
import { formatCurrency } from "../lib/formatters";

const UPDATED_AT = SITE_CONFIG.updatedAt;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const ChildcareSupportCalculator = () => {
  const [type, setType] = useState("reduced-hours");
  const [monthlyWage, setMonthlyWage] = useState(3200000);
  const [months, setMonths] = useState(3);
  const [childAgeMonths, setChildAgeMonths] = useState(10);
  const [useOrder, setUseOrder] = useState(1);
  const [isPrioritySupportCompany, setIsPrioritySupportCompany] = useState(true);
  const [willRetainForSixMonths, setWillRetainForSixMonths] = useState(true);
  const [workloadSharingEnabled, setWorkloadSharingEnabled] = useState(true);
  const [workloadSharingCoworkers, setWorkloadSharingCoworkers] = useState(1);
  const [weeklyHoursBefore, setWeeklyHoursBefore] = useState(40);
  const [weeklyHoursAfter, setWeeklyHoursAfter] = useState(30);

  const result = useMemo(
    () =>
      calculateChildcareSupport({
        type,
        monthlyWage,
        months,
        childAgeMonths,
        useOrder,
        isPrioritySupportCompany,
        willRetainForSixMonths,
        workloadSharingEnabled,
        workloadSharingCoworkers,
        weeklyHoursBefore,
        weeklyHoursAfter,
      }),
    [
      type,
      monthlyWage,
      months,
      childAgeMonths,
      useOrder,
      isPrioritySupportCompany,
      willRetainForSixMonths,
      workloadSharingEnabled,
      workloadSharingCoworkers,
      weeklyHoursBefore,
      weeklyHoursAfter,
    ]
  );

  const summaryLines = result
    ? [
        `근로자 월 예상 수령액 ${formatCurrency(result.workerMonthlyTotal)}`,
        `사업주 월 예상 지원금 ${formatCurrency(result.employerMonthlySupport)}`,
        `회사 월 순부담 ${formatCurrency(result.companyMonthlyNetCost)}`,
      ]
    : ["월 기준 급여를 입력하면 예상 지원금과 회사 부담 변화를 계산합니다."];

  const steps = result
    ? [
        `지원 대상 기간은 최대 12개월 기준으로 ${result.eligibleMonths}개월 반영`,
        `근로자 지급 예상액은 제도 유형별 상한과 비율을 적용해 추정`,
        `사업주 지원금은 우선지원대상기업 여부, 회차 인센티브, 업무분담 지원을 합산`,
        `사업주 지원금의 일부는 복귀 후 6개월 계속고용 요건 충족 시 사후 지급`,
        `회사 순부담은 기존 월 인건비 대비 직접 지급액과 예상 지원금을 반영해 계산`,
      ]
    : [];

  const exceptions = [
    "실제 지급 여부와 지급액은 고용센터 심사 결과에 따라 달라질 수 있습니다.",
    "우선지원대상기업 여부, 자녀 연령, 연속 사용 요건은 반드시 별도 확인해야 합니다.",
    "업무분담 지원금은 동료 보상 지급과 요건 충족이 필요하며 본 계산기는 예상치입니다.",
    "육아휴직 급여와 육아기 근로시간 단축 급여는 상한, 하한, 사용 방식에 따라 달라질 수 있습니다.",
  ];

  const faqs = [
    {
      question: "사업주 지원금은 전액이 바로 지급되나요?",
      answer:
        "아닙니다. 사업주 지원금은 일부가 선지급되고, 나머지는 복귀 후 6개월 계속고용 요건 충족 시 지급되는 구조가 있어 즉시지급분과 사후지급분을 나누어 봐야 합니다.",
    },
    {
      question: "육아기 근로시간 단축은 회사 부담이 무조건 줄어드나요?",
      answer:
        "반드시 그렇지는 않습니다. 단축 후 회사가 지급하는 임금, 정부 급여, 업무분담 지원금, 대체인력 운용 여부에 따라 실제 부담이 달라집니다.",
    },
    {
      question: "업무분담 지원금은 어떻게 반영했나요?",
      answer:
        "동료에게 보상을 지급하는 경우 1인당 월 20만원, 최대 월 60만원으로 예상 반영했습니다. 실제 제도 요건과 지급 기준은 신청 전 확인이 필요합니다.",
    },
    {
      question: "근로자 수급액은 확정 금액인가요?",
      answer:
        "아닙니다. 본 계산기는 공식 안내 기준을 바탕으로 한 예상치입니다. 월 통상임금, 사용 방식, 심사 결과에 따라 실제 수급액은 달라질 수 있습니다.",
    },
  ];

  const quickStats =
    type === "leave"
      ? [
          { label: "집중 점검", value: "육아휴직 지원금" },
          { label: "핵심 출력", value: "사업주 지원 + 근로자 급여" },
          { label: "기준일", value: UPDATED_AT },
        ]
      : [
          { label: "집중 점검", value: "육아기 단축근무 지원금" },
          { label: "핵심 출력", value: "회사 순부담 변화" },
          { label: "기준일", value: UPDATED_AT },
        ];

  const relatedLinks = [
    { title: "2026 육아휴직 지원금 정리", path: "/guides/childcare-leave-support-2026", featured: true },
    { title: "2026 육아기 단축근무 지원금 계산 포인트", path: "/guides/reduced-hours-support-2026", featured: true },
    { title: "육아지원금 자주 틀리는 조건", path: "/guides/childcare-support-faq-2026" },
    { title: "업무분담 지원금 적용 체크리스트", path: "/guides/workload-sharing-support-2026" },
    { title: "실수령액 계산기", path: "/calculators/net-salary" },
    { title: "연차 계산기", path: "/calculators/annual-leave" },
    { title: "게시판 공지 확인", path: "/board" },
  ];

  return (
    <CalculatorTemplate
      seo={{
        title: "육아휴직·육아기 단축근무 지원금 계산기 (2026)",
        description:
          "사업주 지원금, 근로자 예상 급여, 회사 월 순부담을 한 번에 계산하는 2026 육아지원 계산기입니다.",
        path: "/calculators/childcare-support",
      }}
      breadcrumbs={[
        { label: "홈", path: "/" },
        { label: "계산기 허브", path: "/calculators" },
        { label: "육아지원금 계산기", path: "/calculators/childcare-support" },
      ]}
      title="육아휴직·육아기 단축근무 지원금 계산기"
      description="사업주 지원금, 근로자 예상 수령액, 회사 실제 순부담을 한 화면에서 확인합니다. 이번 특집의 대표 계산기로, 숫자보다 조건 예외와 지급 구조를 함께 보여주는 데 초점을 맞췄습니다."
      updatedAt={UPDATED_AT}
      summaryLines={summaryLines}
      steps={steps}
      exceptions={exceptions}
      faqs={faqs}
      relatedLinks={relatedLinks}
      quickStats={quickStats}
      keyPoints={[
        "육아휴직과 육아기 단축근무를 한 계산기에서 비교할 수 있습니다.",
        "즉시지급분과 사후지급분을 구분해 자금 계획에 바로 활용할 수 있습니다.",
        "회사 순부담과 기존 인건비 대비 절감 폭까지 함께 확인할 수 있습니다.",
      ]}
      inputGuide={[
        "월 기준 급여와 사용 개월 수를 먼저 입력합니다.",
        "육아기 단축근무를 선택한 경우 단축 전후 주 근로시간을 입력합니다.",
        "우선지원대상기업 여부와 계속고용 가능성을 구분해서 보셔야 합니다.",
      ]}
      sources={[
        "고용24 사업주 지원금 안내",
        "고용노동부 일가정양립 지원 제도 상담 자료",
        "고용노동부 육아기 근로시간 단축 급여 안내",
      ]}
      trust={{
        checklist: [
          "우선지원대상기업 여부 확인",
          "복귀 후 6개월 계속고용 가능성 점검",
          "자녀 연령과 사용 개월 수 확인",
          "업무분담 보상 지급 여부 기록",
        ],
        disputePoints: [
          "우선지원대상기업 해당 여부 오판",
          "지원금 즉시지급분과 사후지급분 혼동",
          "단축 전후 통상임금과 실제 지급임금 차이",
        ],
        notices: [
          "이 계산기는 정책 안내 기준을 바탕으로 한 예상치입니다.",
          "신청 전 고용센터 최신 공지와 사업장 요건을 반드시 확인해야 합니다.",
        ],
      }}
    >
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">제도 유형</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "reduced-hours", label: "육아기 단축근무" },
                { value: "leave", label: "육아휴직" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    type === option.value
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">월 기준 급여</label>
            <input
              type="number"
              value={monthlyWage}
              min={1000000}
              step={100000}
              onChange={(e) => setMonthlyWage(clamp(Number(e.target.value), 1000000, 10000000))}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">사용 개월 수</label>
            <input
              type="number"
              value={months}
              min={1}
              max={12}
              onChange={(e) => setMonths(clamp(Number(e.target.value), 1, 12))}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">자녀 개월 수</label>
            <input
              type="number"
              value={childAgeMonths}
              min={0}
              max={96}
              onChange={(e) => setChildAgeMonths(clamp(Number(e.target.value), 0, 96))}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">회사 내 사용 회차</label>
            <select
              value={useOrder}
              onChange={(e) => setUseOrder(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            >
              <option value={1}>최초 사용</option>
              <option value={2}>2회차</option>
              <option value={3}>3회차</option>
              <option value={4}>4회차 이상</option>
            </select>
          </div>
        </div>

        {type === "reduced-hours" && (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">단축 전 주 근로시간</label>
              <input
                type="number"
                value={weeklyHoursBefore}
                min={15}
                max={52}
                onChange={(e) => setWeeklyHoursBefore(clamp(Number(e.target.value), 15, 52))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">단축 후 주 근로시간</label>
              <input
                type="number"
                value={weeklyHoursAfter}
                min={10}
                max={weeklyHoursBefore}
                onChange={(e) =>
                  setWeeklyHoursAfter(clamp(Number(e.target.value), 10, weeklyHoursBefore))
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              />
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <span>우선지원대상기업</span>
            <input
              type="checkbox"
              checked={isPrioritySupportCompany}
              onChange={(e) => setIsPrioritySupportCompany(e.target.checked)}
            />
          </label>

          <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <span>복귀 후 6개월 계속고용 예정</span>
            <input
              type="checkbox"
              checked={willRetainForSixMonths}
              onChange={(e) => setWillRetainForSixMonths(e.target.checked)}
            />
          </label>

          <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 md:col-span-2">
            <span>업무분담 지원금 반영</span>
            <input
              type="checkbox"
              checked={workloadSharingEnabled}
              onChange={(e) => setWorkloadSharingEnabled(e.target.checked)}
            />
          </label>
        </div>

        {workloadSharingEnabled && (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">업무분담 보상 대상 인원</label>
            <input
              type="number"
              value={workloadSharingCoworkers}
              min={1}
              max={3}
              onChange={(e) => setWorkloadSharingCoworkers(clamp(Number(e.target.value), 1, 3))}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm md:w-48"
            />
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">근로자 기준</p>
                <p className="mt-2 text-sm text-slate-600">월 예상 수령액</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {formatCurrency(result.workerMonthlyTotal)}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  회사 지급 {formatCurrency(result.workerMonthlyCompanyPay)} + 급여 추정 {formatCurrency(result.workerMonthlyBenefit)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">사업주 기준</p>
                <p className="mt-2 text-sm text-slate-600">월 예상 지원금</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {formatCurrency(result.employerMonthlySupport)}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  즉시지급 {formatCurrency(result.immediateEmployerSupport)} / 사후지급 {formatCurrency(result.deferredEmployerSupport)}
                </p>
              </div>

              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">회사 기준</p>
                <p className="mt-2 text-sm text-slate-600">월 순부담</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {formatCurrency(result.companyMonthlyNetCost)}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  기존 대비 월 {formatCurrency(result.companyMonthlySavings)} 절감 추정
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-slate-100 bg-white p-4 text-sm">
                <p className="font-semibold text-slate-900">근로자 상세</p>
                <div className="mt-3 space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span>회사 지급액</span>
                    <span>{formatCurrency(result.workerMonthlyCompanyPay)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>급여/급여보전 추정</span>
                    <span>{formatCurrency(result.workerMonthlyBenefit)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-2 font-semibold text-slate-900">
                    <span>월 합계</span>
                    <span>{formatCurrency(result.workerMonthlyTotal)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-white p-4 text-sm">
                <p className="font-semibold text-slate-900">사업주 상세</p>
                <div className="mt-3 space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span>총 예상 지원금</span>
                    <span>{formatCurrency(result.employerSupportTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>즉시지급분</span>
                    <span>{formatCurrency(result.immediateEmployerSupport)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>사후지급분</span>
                    <span>{formatCurrency(result.deferredEmployerSupport)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>업무분담 월 반영</span>
                    <span>{formatCurrency(result.workloadSharingMonthlySupport)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-white p-4 text-sm">
                <p className="font-semibold text-slate-900">회사 상세</p>
                <div className="mt-3 space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span>기존 월 인건비</span>
                    <span>{formatCurrency(result.companyMonthlyBaseCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>제도 적용 중 직접지급</span>
                    <span>{formatCurrency(result.companyMonthlyDirectCost)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-2 font-semibold text-slate-900">
                    <span>월 순부담</span>
                    <span>{formatCurrency(result.companyMonthlyNetCost)}</span>
                  </div>
                </div>
              </div>
            </div>

            {(result.flags.retentionPending || result.flags.prioritySupportRequired) && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                {result.flags.prioritySupportRequired && (
                  <p>우선지원대상기업이 아니면 사업주 지원금이 줄거나 제외될 수 있습니다.</p>
                )}
                {result.flags.retentionPending && (
                  <p>복귀 후 6개월 계속고용 조건이 미확정이면 사후지급분은 예상 총액에서 제외해 보는 것이 안전합니다.</p>
                )}
              </div>
            )}
          </div>
        )}

        <ContinueReading
          title="이어서 읽기"
          items={TOPIC_GUIDES["childcare-support"].map((g) => ({
            path: `/guides/${g.slug}`,
            badge: "가이드",
            title: g.title,
            desc: g.desc,
          }))}
        />

        <section className="rounded-[1.75rem] border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                맞춤 검토 요청
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                우리 회사 조건으로 다시 보고 싶다면 상담 흐름으로 넘기세요.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                계산기 결과는 예상치입니다. 실제 운영에서는 우선지원대상기업 여부, 계속고용 가능성,
                업무분담 보상 방식, 내부 급여 기준에 따라 숫자가 달라질 수 있습니다. 계산 결과를 바탕으로
                맞춤 검토를 요청할 수 있게 전환 동선을 붙였습니다.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:min-w-[220px]">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                맞춤 검토 문의하기
              </Link>
              <a
                href={`mailto:${SITE_CONFIG.contactEmail}?subject=${encodeURIComponent("[육아지원금 계산기] 맞춤 검토 문의")}`}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                이메일 바로 보내기
              </a>
            </div>
          </div>
        </section>
      </div>
    </CalculatorTemplate>
  );
};

export default ChildcareSupportCalculator;
