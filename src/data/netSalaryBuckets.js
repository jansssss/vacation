import { calculateNetSalary } from "../lib/calculators/netSalary";

const fmt = (n) => Math.round(n).toLocaleString("ko-KR");

const makeExample = (gross, deps) => {
  const r = calculateNetSalary({ gross, dependents: deps });
  const depsLabel = deps === 0 ? "본인만(독신)" : deps === 1 ? "본인+배우자" : "본인+배우자+자녀1";
  return {
    deps,
    depsLabel,
    gross: r.gross,
    totalDeduction: r.totalDeduction,
    net: r.net,
    breakdown: {
      nationalPension: r.nationalPension,
      healthInsurance: r.healthInsurance,
      longTermCare: r.longTermCare,
      employment: r.employment,
      incomeTax: r.incomeTax,
      localTax: r.localTax,
    },
    summary: `세전 ${fmt(r.gross)}원 → 총 공제 ${fmt(r.totalDeduction)}원 → 실수령 약 ${fmt(r.net)}원`,
  };
};

const BUCKETS_RAW = [200, 250, 300, 350, 400, 450, 500, 550, 600];

export const NET_SALARY_BUCKETS = BUCKETS_RAW.map((wan) => {
  const gross = wan * 10000;
  const examples = [0, 1, 2].map((d) => makeExample(gross, d));
  const ref = examples[1]; // 부양가족 1인 기준

  return {
    bucket: wan,
    label: `${wan}만원`,
    gross,
    path: `/net-salary/${wan}`,
    title: `2026년 월급 ${wan}만원 실수령액 계산`,
    description: `월급 ${wan}만원(세전)의 2026년 실수령액을 4대보험(국민연금·건강보험·고용보험·장기요양)과 소득세·지방소득세를 적용해 계산합니다. 부양가족 수별 예시와 공제 내역을 확인하세요.`,
    summaryLines: [
      `세전 월급 ${fmt(gross)}원 기준 (비과세 식대 20만 원 제외)`,
      `부양가족 1인 기준 실수령 약 ${fmt(ref.net)}원 (총 공제 ${fmt(ref.totalDeduction)}원)`,
      `4대보험 + 소득세·지방소득세 합산 적용, 2026년 보험료율 기준`,
    ],
    examples,
    faqs: [
      {
        question: `월급 ${wan}만원 실수령액은 얼마인가요?`,
        answer: `부양가족 1인(본인+배우자) 기준 2026년 실수령액은 약 ${fmt(ref.net)}원입니다. 국민연금·건강보험·고용보험·장기요양보험·소득세·지방소득세 공제 후 금액이며, 부양가족 수와 비과세 항목에 따라 달라질 수 있습니다.`,
      },
      {
        question: "4대보험이 얼마나 공제되나요?",
        answer: `국민연금 ${fmt(ref.breakdown.nationalPension)}원, 건강보험 ${fmt(ref.breakdown.healthInsurance)}원, 장기요양 ${fmt(ref.breakdown.longTermCare)}원, 고용보험 ${fmt(ref.breakdown.employment)}원으로 4대보험 합계 약 ${fmt(ref.breakdown.nationalPension + ref.breakdown.healthInsurance + ref.breakdown.longTermCare + ref.breakdown.employment)}원이 공제됩니다.`,
      },
      {
        question: "소득세는 어떻게 계산하나요?",
        answer: "소득세는 국세청 근로소득 간이세액표를 기준으로 계산합니다. 월급에서 비과세 식대(20만 원)와 4대보험료를 뺀 과세 기준액에 세율을 적용하고, 부양가족 수에 따라 공제액이 달라집니다. 정확한 세액은 국세청 홈택스(www.hometax.go.kr)에서 확인하세요.",
      },
      {
        question: "비과세 식대가 포함되면 실수령액이 달라지나요?",
        answer: "네. 비과세 식대(월 20만 원)는 소득세 과세 대상에서 제외되어 소득세가 줄어들고 실수령액이 늘어납니다. 이 계산기는 비과세 식대 20만 원을 기본 적용합니다.",
      },
      {
        question: "연봉으로 환산하면 얼마인가요?",
        answer: `세전 연봉은 ${fmt(gross * 12)}원입니다. 실수령 기준 연간 수령액은 부양가족 1인 기준 약 ${fmt(ref.net * 12)}원입니다.`,
      },
    ],
    sources: [
      { label: "국민연금공단 보험료율 안내", url: "https://www.nps.or.kr" },
      { label: "국민건강보험 보험료율", url: "https://www.nhis.or.kr" },
      { label: "국세청 근로소득 간이세액표", url: "https://www.nts.go.kr" },
      { label: "고용보험료율 안내 (고용노동부)", url: "https://www.ei.go.kr" },
    ],
    relatedBuckets: BUCKETS_RAW.filter((b) => Math.abs(b - wan) <= 100 && b !== wan).slice(0, 4),
  };
});

export const getBucketData = (bucketStr) => {
  const n = parseInt(bucketStr, 10);
  return NET_SALARY_BUCKETS.find((b) => b.bucket === n) || null;
};
