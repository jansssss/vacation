import siteConfigJson from "../siteConfig.json";

export const RULES_2026 = {
  effectiveDate: siteConfigJson.rulesEffectiveDate,
  updatedAt: siteConfigJson.updatedAt,
  annualLeave: {
    firstYearMonthlyAccrual: 1,
    firstYearMonthlyCap: 11,
    baseAfterOneYear: 15,
    extraPerTwoYears: 1,
    extraCap: 10,
    maxTotal: 25,
    attendanceThreshold: 0.8,
  },
  severancePay: {
    averageWagePeriodMonths: 3,
    payDaysPerYear: 30,
  },
  netSalary: {
    nationalPensionRate: 0.045,       // 국민연금 4.5% (근로자 부담)
    healthInsuranceRate: 0.03545,     // 건강보험 3.545% (근로자 부담)
    longTermCareRate: 0.1295,         // 장기요양 = 건강보험료 × 12.95%
    employmentInsuranceRate: 0.009,   // 고용보험 0.9% (근로자 부담)
  },
};
