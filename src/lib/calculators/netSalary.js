import { RULES_2026 } from "../../config/rules/2026";

/**
 * 국세청 근로소득 간이세액표 근사 계산 (2026년 기준)
 * 과세표준 = 월 급여 - 비과세(식대 20만 원 가정) - 4대보험료
 * 간이세액표를 구간별로 근사한 값 (정확한 값은 국세청 홈택스 참조)
 */
const calcIncomeTax = (taxableMonthly, dependents) => {
  // 부양가족 공제: 0인=기본, 1인=본인만, 2인 이상은 추가 공제
  // 아래는 간이세액표 구간 근사값 (단위: 원)
  // 실제 세액은 국세청 간이세액표(www.nts.go.kr) 기준으로 달라질 수 있음
  const base = taxableMonthly;

  let tax = 0;

  if (base <= 1060000) {
    tax = 0;
  } else if (base <= 1500000) {
    tax = Math.max(0, (base - 1060000) * 0.06);
  } else if (base <= 3000000) {
    tax = Math.max(0, (base - 1500000) * 0.15 + 26400);
  } else if (base <= 4500000) {
    tax = Math.max(0, (base - 3000000) * 0.24 + 251400);
  } else if (base <= 8000000) {
    tax = Math.max(0, (base - 4500000) * 0.35 + 611400);
  } else {
    tax = Math.max(0, (base - 8000000) * 0.38 + 1836400);
  }

  // 부양가족 공제 (간이세액표 기준 근사)
  // 1인(본인): 기본공제 포함, 2인: 배우자 또는 자녀 1인 추가
  const deduction =
    dependents === 0
      ? 0
      : dependents === 1
      ? Math.min(tax, 120000)
      : Math.min(tax, 240000);

  return Math.max(0, Math.round(tax - deduction));
};

/**
 * 실수령액 계산
 * @param {number} gross - 세전 월급 (원)
 * @param {number} dependents - 부양가족 수 (본인 포함, 0=독신)
 * @param {number} mealAllowance - 비과세 식대 (기본 200,000원)
 */
export const calculateNetSalary = ({ gross, dependents = 1, mealAllowance = 200000 }) => {
  const { netSalary: R } = RULES_2026;

  const grossNum = Number(gross);
  if (!grossNum || grossNum <= 0) return null;

  // 4대보험 계산 (원 이하 절사)
  const nationalPension = Math.floor(grossNum * R.nationalPensionRate);
  const healthInsurance = Math.floor(grossNum * R.healthInsuranceRate);
  const longTermCare = Math.floor(healthInsurance * R.longTermCareRate);
  const employment = Math.floor(grossNum * R.employmentInsuranceRate);

  // 소득세 과세 기준: 월급 - 비과세 - 4대보험료
  const insuranceTotal = nationalPension + healthInsurance + longTermCare + employment;
  const taxable = Math.max(0, grossNum - mealAllowance - insuranceTotal);

  const incomeTax = calcIncomeTax(taxable, Number(dependents));
  const localTax = Math.round(incomeTax * 0.1);

  const totalDeduction = insuranceTotal + incomeTax + localTax;
  const net = grossNum - totalDeduction;

  return {
    gross: grossNum,
    nationalPension,
    healthInsurance,
    longTermCare,
    employment,
    incomeTax,
    localTax,
    totalDeduction,
    net,
  };
};

/**
 * 특정 월급 구간(만 원 단위)에 대해 부양가족 0/1/2인 예시 생성
 */
export const getExamples = (grossWan) => {
  const gross = grossWan * 10000;
  return [0, 1, 2].map((deps) => {
    const r = calculateNetSalary({ gross, dependents: deps });
    return { deps, ...r };
  });
};
