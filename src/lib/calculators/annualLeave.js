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
    return { error: "???얩뀬???ㅺ땁 ?リ옇????源녿굵 嶺뚮ㅄ維筌????놁졑???낅슣?섋땻??", total: 0, breakdown: [] };
  }

  if (endDate < startDate) {
    return { error: "?リ옇????源녿턄 ???얩뀬??怨뺢텠????伊볟럴???덈펲.", total: 0, breakdown: [] };
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
      breakdown.push({ label: "1?熬곣뫕而???븐슙而?", days: firstYearMonthly });
      total += firstYearMonthly;
    }
  }

  if (months >= 12) {
    const leaveYears = years + 1;
    for (let year = 2; year <= leaveYears; year += 1) {
      const extra = Math.min(
        RULES_2026.annualLeave.extraCap,
        Math.floor((year - 1) / 2) * RULES_2026.annualLeave.extraPerTwoYears
      );
      const days = Math.min(RULES_2026.annualLeave.maxTotal, RULES_2026.annualLeave.baseAfterOneYear + extra);
      breakdown.push({ label: `${year}?熬곣뫕而?, days });
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
