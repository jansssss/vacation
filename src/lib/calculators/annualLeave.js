import { RULES_2026 } from "../../config/rules/2026";

const diffFullMonths = (startDate, endDate) => {
  let months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
  if (endDate.getDate() < startDate.getDate()) {
    months -= 1;
  }
  return Math.max(0, months);
};

const diffFullYears = (startDate, endDate) => {
  let years = endDate.getFullYear() - startDate.getFullYear();
  if (
    endDate.getMonth() < startDate.getMonth() ||
    (endDate.getMonth() === startDate.getMonth() && endDate.getDate() < startDate.getDate())
  ) {
    years -= 1;
  }
  return Math.max(0, years);
};

export const calculateAnnualLeave = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (!start || !end || Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return { error: "입사일과 기준일을 모두 입력해 주세요.", total: 0, breakdown: [] };
  }

  if (endDate < startDate) {
    return { error: "기준일이 입사일보다 빠릅니다.", total: 0, breakdown: [] };
  }

  const months = diffFullMonths(startDate, endDate);
  const years = diffFullYears(startDate, endDate);

  const breakdown = [];
  let total = 0;

  // 회계연도 기준 계산
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  const startMonth = startDate.getMonth(); // 0-based (0 = January)
  const startDay = startDate.getDate();

  // 1년차 (입사년도): 입사월부터 12월까지 월차
  // 입사일이 1일이 아니면 입사월은 개근이 아니므로 다음 달부터 계산
  const firstMonthOffset = startDay === 1 ? 0 : 1;
  const firstYearMonths = 12 - startMonth - firstMonthOffset; // 입사월부터 12월까지 개근 가능 개월 수
  const firstYearDays = Math.min(Math.max(0, firstYearMonths), RULES_2026.annualLeave.firstYearMonthlyCap);

  if (firstYearDays > 0) {
    breakdown.push({ label: "1년차(월차)", days: firstYearDays });
    total += firstYearDays;
  }

  // 2년차 이상: 1년 이상 근속한 경우에만 발생
  // 연차는 전년도 근무에 따른 차년도 휴가이므로, 1년 미만 퇴사 시 2년차 연차는 발생하지 않음
  if (endYear > startYear && years >= 1) {
    const totalYears = endYear - startYear + 1;

    for (let yearIndex = 2; yearIndex <= totalYears; yearIndex++) {
      let days;

      if (yearIndex === 2) {
        // 2년차: 26 - 1년차 발생 개수
        days = 26 - firstYearDays;
      } else {
        // 3년차 이상: 15개 + (2년마다 1개씩 가산)
        const extra = Math.min(
          RULES_2026.annualLeave.extraCap,
          Math.floor((yearIndex - 3) / 2) * RULES_2026.annualLeave.extraPerTwoYears
        );
        days = RULES_2026.annualLeave.baseAfterOneYear + extra;
      }

      breakdown.push({ label: `${yearIndex}년차`, days });
      total += days;
    }
  }

  return {
    total,
    breakdown,
    months,
    years,
  };
};
