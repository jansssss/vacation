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
  childcareSupport: {
    maxEligibleMonths: 12,
    employerRetentionPayoutRatio: 0.5,
    workloadSharing: {
      perCoworkerMonthly: 200000,
      monthlyCap: 600000,
    },
    leave: {
      employerMonthly: 300000,
      employerIncentiveMonthly: 100000,
      specialMonthly: 2000000,
      specialMonths: 3,
      specialChildAgeMonths: 12,
      workerBenefit: {
        firstPeriodMonths: 3,
        firstPeriodRate: 1,
        firstPeriodCap: 2500000,
        secondPeriodMonths: 3,
        secondPeriodRate: 1,
        secondPeriodCap: 2000000,
        laterRate: 0.8,
        laterCap: 1600000,
      },
    },
    reducedHours: {
      employerMonthly: 300000,
      employerIncentiveMonthly: 100000,
      workerBenefit: {
        firstTenHoursCap: 2200000,
        remainingHoursCap: 1500000,
        remainingHoursRate: 0.8,
        monthlyCap: 1112500,
        monthlyMin: 62500,
      },
    },
  },
};
