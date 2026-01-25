import { RULES_2026 } from "../../config/rules/2026";

export const calculateSeverancePay = ({ avgMonthlyWage, years, months }) => {
  const monthlyWage = Number(avgMonthlyWage);
  const serviceYears = Number(years) + Number(months) / 12;

  if (!monthlyWage || monthlyWage <= 0 || serviceYears <= 0) {
    return { error: "평균임금과 근속기간을 올바르게 입력해 주세요.", pay: 0, serviceYears: 0 };
  }

  const pay = monthlyWage * serviceYears;

  return {
    pay,
    serviceYears,
    averageWagePeriodMonths: RULES_2026.severancePay.averageWagePeriodMonths,
    payDaysPerYear: RULES_2026.severancePay.payDaysPerYear,
  };
};
