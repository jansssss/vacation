import { RULES_2026 } from "../../config/rules/2026";

export const calculateSeverancePay = ({ avgMonthlyWage, years, months }) => {
  const monthlyWage = Number(avgMonthlyWage);
  const serviceYears = Number(years) + Number(months) / 12;

  if (!monthlyWage || monthlyWage <= 0 || serviceYears <= 0) {
    return { error: "???뇧?袁㏉닊??域뱀눘?썸묾怨뚯퍢????而?몴?우쓺 ??낆젾??雅뚯눘苑??", pay: 0, serviceYears: 0 };
  }

  const pay = monthlyWage * serviceYears;

  return {
    pay,
    serviceYears,
    averageWagePeriodMonths: RULES_2026.severancePay.averageWagePeriodMonths,
    payDaysPerYear: RULES_2026.severancePay.payDaysPerYear,
  };
};
