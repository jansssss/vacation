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

  if (months > 0) {
    const firstYearMonthly = Math.min(
      RULES_2026.annualLeave.firstYearMonthlyCap,
      Math.min(months, RULES_2026.annualLeave.firstYearMonthlyCap)
    );
    if (firstYearMonthly > 0) {
      breakdown.push({ label: "1년차(월차)", days: firstYearMonthly });
      total += firstYearMonthly;
    }
  }

  if (months >= 12) {
    const leaveYears = years + 1;
    for (let year = 2; year <= leaveYears; year += 1) {
      let days;
      if (year === 2) {
        // 2년차: 25개 - 1년차 발생 개수
        const firstYearDays = breakdown[0]?.days || 0;
        days = RULES_2026.annualLeave.maxTotal - firstYearDays;
      } else {
        // 3년차 이상: 15개 + (2년마다 1개씩 가산)
        const extra = Math.min(
          RULES_2026.annualLeave.extraCap,
          Math.floor((year - 3) / 2) * RULES_2026.annualLeave.extraPerTwoYears
        );
        days = RULES_2026.annualLeave.baseAfterOneYear + extra;
      }
      breakdown.push({ label: `${year}년차`, days });
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
