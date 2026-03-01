import { RULES_2026 } from "../../config/rules/2026";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const roundCurrency = (value) => Math.round(Number.isFinite(value) ? value : 0);

const getWorkloadSharingSupport = (enabled, coworkerCount) => {
  if (!enabled) return 0;
  const { perCoworkerMonthly, monthlyCap } = RULES_2026.childcareSupport.workloadSharing;
  return Math.min(Math.max(0, coworkerCount) * perCoworkerMonthly, monthlyCap);
};

const getLeaveWorkerBenefit = (monthlyWage, monthIndex) => {
  const { workerBenefit } = RULES_2026.childcareSupport.leave;

  if (monthIndex <= workerBenefit.firstPeriodMonths) {
    return Math.min(monthlyWage * workerBenefit.firstPeriodRate, workerBenefit.firstPeriodCap);
  }

  if (monthIndex <= workerBenefit.firstPeriodMonths + workerBenefit.secondPeriodMonths) {
    return Math.min(monthlyWage * workerBenefit.secondPeriodRate, workerBenefit.secondPeriodCap);
  }

  return Math.min(monthlyWage * workerBenefit.laterRate, workerBenefit.laterCap);
};

const calculateLeaveSupport = ({
  monthlyWage,
  months,
  childAgeMonths,
  useOrder,
  isPrioritySupportCompany,
  willRetainForSixMonths,
  workloadSharingEnabled,
  workloadSharingCoworkers,
}) => {
  const policy = RULES_2026.childcareSupport.leave;
  const eligibleMonths = clamp(Math.round(months), 1, RULES_2026.childcareSupport.maxEligibleMonths);
  const specialEligible = childAgeMonths <= policy.specialChildAgeMonths && eligibleMonths >= policy.specialMonths;
  const workloadSharingSupport = getWorkloadSharingSupport(
    workloadSharingEnabled,
    workloadSharingCoworkers
  );

  let employerSupportTotal = 0;
  let workerBenefitTotal = 0;

  for (let monthIndex = 1; monthIndex <= eligibleMonths; monthIndex += 1) {
    workerBenefitTotal += getLeaveWorkerBenefit(monthlyWage, monthIndex);

    if (!isPrioritySupportCompany) continue;

    const employerMonthly =
      specialEligible && monthIndex <= policy.specialMonths
        ? policy.specialMonthly
        : policy.employerMonthly;

    const incentiveMonthly = useOrder <= 3 ? policy.employerIncentiveMonthly : 0;
    employerSupportTotal += employerMonthly + incentiveMonthly + workloadSharingSupport;
  }

  const immediateEmployerSupport = employerSupportTotal * RULES_2026.childcareSupport.employerRetentionPayoutRatio;
  const deferredEmployerSupport = willRetainForSixMonths
    ? employerSupportTotal - immediateEmployerSupport
    : 0;
  const expectedEmployerSupport = immediateEmployerSupport + deferredEmployerSupport;

  return {
    type: "leave",
    eligibleMonths,
    workerMonthlyCompanyPay: 0,
    workerMonthlyBenefit: roundCurrency(workerBenefitTotal / eligibleMonths),
    workerMonthlyTotal: roundCurrency(workerBenefitTotal / eligibleMonths),
    workerBenefitTotal: roundCurrency(workerBenefitTotal),
    employerMonthlySupport: roundCurrency(expectedEmployerSupport / eligibleMonths),
    employerSupportTotal: roundCurrency(expectedEmployerSupport),
    immediateEmployerSupport: roundCurrency(immediateEmployerSupport),
    deferredEmployerSupport: roundCurrency(deferredEmployerSupport),
    companyMonthlyBaseCost: roundCurrency(monthlyWage),
    companyMonthlyDirectCost: 0,
    companyMonthlyNetCost: roundCurrency(
      Math.max(0, 0 - expectedEmployerSupport / eligibleMonths)
    ),
    companyMonthlySavings: roundCurrency(monthlyWage + expectedEmployerSupport / eligibleMonths),
    workloadSharingMonthlySupport: workloadSharingSupport,
    flags: {
      specialEligible,
      retentionPending: !willRetainForSixMonths,
      prioritySupportRequired: !isPrioritySupportCompany,
    },
  };
};

const calculateReducedHoursSupport = ({
  monthlyWage,
  months,
  weeklyHoursBefore,
  weeklyHoursAfter,
  useOrder,
  isPrioritySupportCompany,
  willRetainForSixMonths,
  workloadSharingEnabled,
  workloadSharingCoworkers,
}) => {
  const policy = RULES_2026.childcareSupport.reducedHours;
  const eligibleMonths = clamp(Math.round(months), 1, RULES_2026.childcareSupport.maxEligibleMonths);
  const reducedHours = clamp(weeklyHoursBefore - weeklyHoursAfter, 0, weeklyHoursBefore);
  const firstTenHours = Math.min(reducedHours, 10);
  const remainingHours = Math.max(reducedHours - firstTenHours, 0);
  const workloadSharingSupport = getWorkloadSharingSupport(
    workloadSharingEnabled,
    workloadSharingCoworkers
  );

  const workerMonthlyCompanyPay =
    weeklyHoursBefore > 0 ? monthlyWage * (weeklyHoursAfter / weeklyHoursBefore) : 0;
  const firstTenSupport =
    weeklyHoursBefore > 0
      ? Math.min(monthlyWage, policy.workerBenefit.firstTenHoursCap) *
        (firstTenHours / weeklyHoursBefore)
      : 0;
  const remainingSupport =
    weeklyHoursBefore > 0
      ? Math.min(
          monthlyWage * policy.workerBenefit.remainingHoursRate,
          policy.workerBenefit.remainingHoursCap
        ) * (remainingHours / weeklyHoursBefore)
      : 0;

  const workerMonthlyBenefit = clamp(
    firstTenSupport + remainingSupport,
    policy.workerBenefit.monthlyMin,
    policy.workerBenefit.monthlyCap
  );

  const employerMonthlySupportBase = isPrioritySupportCompany ? policy.employerMonthly : 0;
  const employerMonthlyIncentive =
    isPrioritySupportCompany && useOrder <= 3 ? policy.employerIncentiveMonthly : 0;
  const employerMonthlySupport =
    employerMonthlySupportBase + employerMonthlyIncentive + workloadSharingSupport;
  const employerSupportGross = employerMonthlySupport * eligibleMonths;
  const immediateEmployerSupport =
    employerSupportGross * RULES_2026.childcareSupport.employerRetentionPayoutRatio;
  const deferredEmployerSupport = willRetainForSixMonths
    ? employerSupportGross - immediateEmployerSupport
    : 0;
  const expectedEmployerSupport = immediateEmployerSupport + deferredEmployerSupport;
  const companyMonthlyNetCost = Math.max(
    0,
    workerMonthlyCompanyPay - expectedEmployerSupport / eligibleMonths
  );
  const companyMonthlySavings = Math.max(0, monthlyWage - companyMonthlyNetCost);

  return {
    type: "reduced-hours",
    eligibleMonths,
    workerMonthlyCompanyPay: roundCurrency(workerMonthlyCompanyPay),
    workerMonthlyBenefit: roundCurrency(workerMonthlyBenefit),
    workerMonthlyTotal: roundCurrency(workerMonthlyCompanyPay + workerMonthlyBenefit),
    workerBenefitTotal: roundCurrency(workerMonthlyBenefit * eligibleMonths),
    employerMonthlySupport: roundCurrency(expectedEmployerSupport / eligibleMonths),
    employerSupportTotal: roundCurrency(expectedEmployerSupport),
    immediateEmployerSupport: roundCurrency(immediateEmployerSupport),
    deferredEmployerSupport: roundCurrency(deferredEmployerSupport),
    companyMonthlyBaseCost: roundCurrency(monthlyWage),
    companyMonthlyDirectCost: roundCurrency(workerMonthlyCompanyPay),
    companyMonthlyNetCost: roundCurrency(companyMonthlyNetCost),
    companyMonthlySavings: roundCurrency(companyMonthlySavings),
    workloadSharingMonthlySupport: workloadSharingSupport,
    flags: {
      reducedHours,
      retentionPending: !willRetainForSixMonths,
      prioritySupportRequired: !isPrioritySupportCompany,
    },
  };
};

export const calculateChildcareSupport = (input) => {
  const {
    type = "reduced-hours",
    monthlyWage,
    months = 3,
    childAgeMonths = 18,
    useOrder = 1,
    isPrioritySupportCompany = true,
    willRetainForSixMonths = true,
    workloadSharingEnabled = false,
    workloadSharingCoworkers = 0,
    weeklyHoursBefore = 40,
    weeklyHoursAfter = 20,
  } = input;

  const safeMonthlyWage = Number(monthlyWage);
  if (!safeMonthlyWage || safeMonthlyWage <= 0) return null;

  if (type === "leave") {
    return calculateLeaveSupport({
      monthlyWage: safeMonthlyWage,
      months,
      childAgeMonths,
      useOrder,
      isPrioritySupportCompany,
      willRetainForSixMonths,
      workloadSharingEnabled,
      workloadSharingCoworkers,
    });
  }

  return calculateReducedHoursSupport({
    monthlyWage: safeMonthlyWage,
    months,
    weeklyHoursBefore,
    weeklyHoursAfter,
    useOrder,
    isPrioritySupportCompany,
    willRetainForSixMonths,
    workloadSharingEnabled,
    workloadSharingCoworkers,
  });
};
