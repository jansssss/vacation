import { RULES_2026 } from "../../config/rules/2026";

export const calculateSeverancePay = ({ avgMonthlyWage, years, months }) => {
  const monthlyWage = Number(avgMonthlyWage);
  const serviceYears = Number(years) + Number(months) / 12;

  if (!monthlyWage || monthlyWage <= 0 || serviceYears <= 0) {
    return { error: "?????熬곥룊????잙????몃Ь?⑤슣???????紐??곗벟 ???놁졑???낅슣?섋땻??", pay: 0, serviceYears: 0 };
  }

  const pay = monthlyWage * serviceYears;

  return {
    pay,
    serviceYears,
    averageWagePeriodMonths: RULES_2026.severancePay.averageWagePeriodMonths,
    payDaysPerYear: RULES_2026.severancePay.payDaysPerYear,
  };
};
