import { calculateAnnualLeave } from "../lib/calculators/annualLeave";

const MONTH_NAMES = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

// 입사일 1일 기준으로 1년차/2년차 연차 계산
const calcForMonth = (mm) => {
  const joinDate = `2025-${String(mm).padStart(2, "0")}-01`;
  const endDate = `2026-12-31`;
  return calculateAnnualLeave(joinDate, endDate);
};

export const ANNUAL_LEAVE_BUCKETS = Array.from({ length: 12 }, (_, i) => {
  const mm = i + 1;
  const mmStr = String(mm).padStart(2, "0");
  const monthName = MONTH_NAMES[i];
  const r = calcForMonth(mm);
  const firstYearDays = r.breakdown[0]?.days ?? 0;
  const secondYearDays = r.breakdown[1]?.days ?? 0;
  const joinDateExample = `2025-${mmStr}-01`;
  const joinDateExampleMid = `2025-${mmStr}-15`;

  return {
    month: mm,
    mmStr,
    label: `${mm}월 입사`,
    path: `/annual-leave/join-month/${mmStr}`,
    title: `2025년 ${monthName} 입사 연차 계산 (2026년 기준)`,
    description: `2025년 ${monthName}에 입사한 경우 2026년까지 발생하는 연차 일수를 회계연도 기준으로 계산합니다. 1년차 월차, 2년차 연차 발생 규칙과 실무 예시를 확인하세요.`,
    summaryLines: [
      `1년차(입사년도 월차): ${firstYearDays}일 — ${monthName} 1일 입사, 12월까지 개근 기준`,
      `2년차: ${secondYearDays}일 — 1년 이상 근속 후 회계연도 기준 발생`,
      `합계 ${firstYearDays + secondYearDays}일 (2025~2026년 누적, 출근율 80% 이상 가정)`,
    ],
    firstYearDays,
    secondYearDays,
    joinDateExample,
    joinDateExampleMid,
    faqs: [
      {
        question: `${monthName} 입사 시 1년차 연차는 며칠인가요?`,
        answer: `입사일이 ${monthName} 1일이면 ${firstYearDays}일의 월차가 발생합니다. 매월 개근 시 1일씩 발생하며, 회계연도(1~12월) 기준으로 입사월부터 12월까지 개근 가능한 개월 수만큼 부여됩니다. 최대 11일 한도입니다.`,
      },
      {
        question: "입사일이 1일이 아니면 어떻게 다른가요?",
        answer: `입사일이 1일이 아닌 경우(예: ${monthName} 15일) 입사월은 개근이 아닌 것으로 보아, 그 달은 월차 발생에서 제외될 수 있습니다. 따라서 같은 달이라도 1일 입사 대비 1일 적게 발생할 수 있습니다.`,
      },
      {
        question: "회계연도 기준이란 무엇인가요?",
        answer: "회계연도 기준이란 매년 1월 1일~12월 31일을 1년 단위로 보아 연차를 산정하는 방식입니다. 입사일 기준과 달리 회사 전체가 동일한 기준을 적용하므로, 입사월에 따라 첫 해 연차 일수가 달라집니다.",
      },
      {
        question: "2년차 연차 26일은 어떻게 계산하나요?",
        answer: `2년차 연차는 '26일 - 1년차 월차 일수'로 계산합니다. ${monthName} 입사의 경우 1년차 월차 ${firstYearDays}일이므로 2년차에 ${secondYearDays}일이 발생합니다. 이는 입사 1년 후 첫 회계연도 시작 시 부여됩니다.`,
      },
      {
        question: "출근율 80% 미만이면 연차가 달라지나요?",
        answer: "네. 연차는 근로기준법상 출근율 80% 이상인 경우에 발생합니다. 80% 미만이면 1년차 월차는 개근한 달만 발생하고, 2년차 연차 15일(이상)도 발생하지 않을 수 있습니다. 병가·무급휴직 등이 있는 경우 별도 검토가 필요합니다.",
      },
    ],
    sources: [
      { label: "근로기준법 제60조 (연차유급휴가)", url: "https://www.law.go.kr/lsSc.do?section=&menuId=1&subMenuId=15&tabMenuId=81&eventGubun=060101&query=%EA%B7%BC%EB%A1%9C%EA%B8%B0%EC%A4%80%EB%B2%95#undefined" },
      { label: "고용노동부 연차유급휴가 안내", url: "https://www.moel.go.kr" },
    ],
    relatedMonths: Array.from({ length: 12 }, (_, j) => j + 1).filter((m) => m !== mm),
  };
});

export const getBucketByMonth = (mmStr) => {
  const mm = parseInt(mmStr, 10);
  return ANNUAL_LEAVE_BUCKETS.find((b) => b.month === mm) || null;
};
