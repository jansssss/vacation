import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CalculatorTemplate from "../components/CalculatorTemplate";
import { calculateNetSalary } from "../lib/calculators/netSalary";
import { formatCurrency } from "../lib/formatters";
import { NET_SALARY_BUCKETS } from "../data/netSalaryBuckets";

const UPDATED_AT = "2026-02-21";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const NetSalaryCalculator = () => {
  const [searchParams] = useSearchParams();

  const initGross = clamp(Number(searchParams.get("gross")) || 3000000, 1000000, 10000000);
  const initDeps = clamp(Number(searchParams.get("deps")) || 1, 0, 5);

  const [gross, setGross] = useState(initGross);
  const [dependents, setDependents] = useState(initDeps);

  // URL 파라미터 변경 시 state 동기화
  useEffect(() => {
    const g = Number(searchParams.get("gross"));
    const d = Number(searchParams.get("deps"));
    if (g > 0) setGross(clamp(g, 1000000, 10000000));
    if (!isNaN(d)) setDependents(clamp(d, 0, 5));
  }, [searchParams]);

  const result = useMemo(() => calculateNetSalary({ gross, dependents }), [gross, dependents]);

  const grossWan = Math.round(gross / 10000);

  const summaryLines = result
    ? [
        `세전 월급 ${formatCurrency(result.gross)}`,
        `총 공제액 ${formatCurrency(result.totalDeduction)} (4대보험 + 소득세·지방소득세)`,
        `실수령액 약 ${formatCurrency(result.net)}`,
      ]
    : ["월급을 입력하면 실수령액을 계산합니다."];

  const steps = result
    ? [
        `국민연금: ${formatCurrency(result.gross)} × 4.5% = ${formatCurrency(result.nationalPension)}`,
        `건강보험: ${formatCurrency(result.gross)} × 3.545% = ${formatCurrency(result.healthInsurance)}`,
        `장기요양: 건강보험료 × 12.95% = ${formatCurrency(result.longTermCare)}`,
        `고용보험: ${formatCurrency(result.gross)} × 0.9% = ${formatCurrency(result.employment)}`,
        `소득세: 간이세액표 적용 (부양가족 ${dependents}인) = ${formatCurrency(result.incomeTax)}`,
        `지방소득세: 소득세 × 10% = ${formatCurrency(result.localTax)}`,
        `실수령액 = ${formatCurrency(result.gross)} - ${formatCurrency(result.totalDeduction)} = ${formatCurrency(result.net)}`,
      ]
    : [];

  const faqs = [
    {
      question: "4대보험료는 어떻게 계산하나요?",
      answer: "2026년 기준 국민연금 4.5%, 건강보험 3.545%, 장기요양(건강보험료×12.95%), 고용보험 0.9%를 월급에 곱해 계산합니다.",
    },
    {
      question: "소득세는 왜 부양가족 수에 따라 다른가요?",
      answer: "국세청 근로소득 간이세액표는 부양가족 수에 따라 공제액이 달라집니다. 부양가족이 많을수록 소득세가 줄어 실수령액이 늘어납니다.",
    },
    {
      question: "비과세 식대는 어떻게 반영되나요?",
      answer: "월 20만 원 비과세 식대를 기본 적용해 소득세 과세 기준액에서 제외합니다. 회사 규정에 따라 실제 비과세 항목이 다를 수 있습니다.",
    },
    {
      question: "연봉으로 환산하면?",
      answer: `세전 연봉은 월급 × 12개월입니다. 세전 ${formatCurrency(gross * 12)}, 실수령 기준 연간 약 ${result ? formatCurrency(result.net * 12) : "-"}입니다.`,
    },
    {
      question: "실제 공제액이 다를 수 있나요?",
      answer: "네. 연장근로수당, 상여금, 식대 외 비과세 항목, 연말정산 환급/추가납부 등에 따라 실제 수령액은 달라질 수 있습니다. 정확한 금액은 급여명세서를 확인하세요.",
    },
  ];

  const relatedLinks = NET_SALARY_BUCKETS.filter(
    (b) => Math.abs(b.bucket - grossWan) <= 100 && b.bucket !== grossWan
  )
    .slice(0, 4)
    .map((b) => ({ title: `월급 ${b.label} 실수령액`, path: b.path }));

  relatedLinks.push(
    { title: "연차 계산기", path: "/calculators/annual-leave" },
    { title: "퇴직금 계산기", path: "/calculators/severance-pay" }
  );

  return (
    <CalculatorTemplate
      seo={{
        title: "실수령액 계산기 (2026)",
        description: "2026년 월급 실수령액을 4대보험·소득세·지방소득세 포함해 계산합니다. 부양가족 수별 공제 내역과 실수령액을 즉시 확인하세요.",
        path: "/calculators/net-salary",
      }}
      breadcrumbs={[
        { label: "홈", path: "/" },
        { label: "계산기 허브", path: "/calculators" },
        { label: "실수령액 계산기", path: "/calculators/net-salary" },
      ]}
      title="실수령액 계산기"
      description="월급(세전)을 입력하면 2026년 기준 4대보험·소득세·지방소득세를 공제한 실수령액을 계산합니다."
      updatedAt={UPDATED_AT}
      summaryLines={summaryLines}
      steps={steps}
      faqs={faqs}
      relatedLinks={relatedLinks}
      sources={[
        "국민연금공단 보험료율 (2026년, www.nps.or.kr)",
        "국민건강보험 보험료율 (2026년, www.nhis.or.kr)",
        "국세청 근로소득 간이세액표 (www.nts.go.kr)",
        "고용보험료율 안내 (고용노동부, www.ei.go.kr)",
      ]}
      quickStats={[
        { label: "국민연금", value: "4.5%" },
        { label: "건강보험", value: "3.545%" },
        { label: "고용보험", value: "0.9%" },
      ]}
      exampleCalc={
        result
          ? {
              title: `월급 ${formatCurrency(gross)} 실수령 예시 (부양가족 ${dependents}인)`,
              input: `4대보험 합계 ${formatCurrency(result.nationalPension + result.healthInsurance + result.longTermCare + result.employment)} + 소득세·지방소득세 ${formatCurrency(result.incomeTax + result.localTax)}`,
              output: `실수령액 약 ${formatCurrency(result.net)}`,
              note: "비과세 식대 20만 원 적용 기준 · 정확한 금액은 급여명세서 확인 권장",
            }
          : null
      }
      trust={{
        checklist: [
          "급여명세서에서 공제 항목별 금액 확인",
          "부양가족 수 변동 시 세무서 신고 여부 확인",
          "연말정산 후 환급/추가납부액 별도 계획",
        ],
        disputePoints: [
          "4대보험료율 변경 시 공제액 재확인 필요",
          "비과세 항목(식대·차량유지비 등) 회사 규정 확인",
          "육아휴직·산재 등 특이 상황은 별도 계산 필요",
        ],
        notices: [
          "이 계산기는 일반적인 참고 정보입니다. 정확한 공제액은 급여담당자 또는 국세청 홈택스를 확인하세요.",
        ],
      }}
    >
      {/* 계산 입력 영역 */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            세전 월급
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1000000}
              max={8000000}
              step={100000}
              value={gross}
              onChange={(e) => setGross(Number(e.target.value))}
              className="flex-1 accent-emerald-600"
            />
            <input
              type="number"
              value={gross}
              onChange={(e) => setGross(clamp(Number(e.target.value), 1000000, 10000000))}
              className="w-36 rounded-lg border border-slate-200 px-3 py-2 text-sm text-right"
              step={100000}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">{formatCurrency(gross)} / 월</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            부양가족 수 (본인 포함)
          </label>
          <div className="flex gap-2 flex-wrap">
            {[0, 1, 2, 3, 4].map((d) => (
              <button
                key={d}
                onClick={() => setDependents(d)}
                className={`rounded-full px-4 py-1.5 text-sm border transition-colors ${
                  dependents === d
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-slate-700 border-slate-200 hover:border-emerald-400"
                }`}
              >
                {d === 0 ? "독신(0인)" : `${d}인`}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>국민연금</span>
              <span>{formatCurrency(result.nationalPension)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>건강보험</span>
              <span>{formatCurrency(result.healthInsurance)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>장기요양</span>
              <span>{formatCurrency(result.longTermCare)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>고용보험</span>
              <span>{formatCurrency(result.employment)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>소득세</span>
              <span>{formatCurrency(result.incomeTax)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>지방소득세</span>
              <span>{formatCurrency(result.localTax)}</span>
            </div>
            <div className="border-t border-emerald-200 pt-2 flex justify-between font-semibold text-slate-800">
              <span>총 공제</span>
              <span>{formatCurrency(result.totalDeduction)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-emerald-700">
              <span>실수령액</span>
              <span>{formatCurrency(result.net)}</span>
            </div>
          </div>
        )}
      </div>
    </CalculatorTemplate>
  );
};

export default NetSalaryCalculator;
