const toMonthlyRate = (annualRate) => {
  if (annualRate <= -1) return -1;
  return Math.pow(1 + annualRate, 1 / 12) - 1;
};

const futureValueOfMonthlyContribution = (monthlyContribution, monthlyRate, months) => {
  if (months <= 0 || monthlyContribution <= 0) return 0;
  if (Math.abs(monthlyRate) < 1e-9) return monthlyContribution * months;
  return monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
};

const requiredPrincipalForMonthlyPayout = (monthlyPayout, monthlyRate, months) => {
  if (months <= 0 || monthlyPayout <= 0) return 0;
  if (Math.abs(monthlyRate) < 1e-9) return monthlyPayout * months;
  return monthlyPayout * ((1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate);
};

const monthlyPayoutFromPrincipal = (principal, monthlyRate, months) => {
  if (months <= 0 || principal <= 0) return 0;
  if (Math.abs(monthlyRate) < 1e-9) return principal / months;
  return principal * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -months)));
};

const calculateWithRate = ({
  currentBalance,
  monthlyContribution,
  yearsToRetirement,
  annualReturn,
  payoutYears,
}) => {
  const monthsToRetirement = Math.max(0, Math.round(yearsToRetirement * 12));
  const payoutMonths = Math.max(1, Math.round(payoutYears * 12));
  const monthlyRate = toMonthlyRate(annualReturn);

  const balanceFromCurrent = currentBalance * Math.pow(1 + monthlyRate, monthsToRetirement);
  const balanceFromContribution = futureValueOfMonthlyContribution(
    monthlyContribution,
    monthlyRate,
    monthsToRetirement
  );
  const totalBalance = balanceFromCurrent + balanceFromContribution;
  const monthlyPension = monthlyPayoutFromPrincipal(totalBalance, monthlyRate, payoutMonths);

  return {
    annualReturn,
    monthsToRetirement,
    payoutMonths,
    totalBalance,
    monthlyPension,
  };
};

export const calculateRetirementPension = ({
  currentAge,
  retirementAge,
  currentBalance,
  monthlyContribution,
  expectedAnnualReturn,
  payoutYears,
  targetMonthlyExpense,
}) => {
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);

  const base = calculateWithRate({
    currentBalance,
    monthlyContribution,
    yearsToRetirement,
    annualReturn: expectedAnnualReturn,
    payoutYears,
  });

  const replacementRate = targetMonthlyExpense > 0
    ? (base.monthlyPension / targetMonthlyExpense) * 100
    : 0;
  const monthlyGap = Math.max(0, targetMonthlyExpense - base.monthlyPension);

  const monthlyRate = toMonthlyRate(expectedAnnualReturn);
  const requiredBalance = requiredPrincipalForMonthlyPayout(
    targetMonthlyExpense,
    monthlyRate,
    base.payoutMonths
  );

  const growthFactor = Math.pow(1 + monthlyRate, base.monthsToRetirement);
  const neededContribution = base.monthsToRetirement === 0
    ? 0
    : Math.max(
        0,
        Math.abs(monthlyRate) < 1e-9
          ? (requiredBalance - currentBalance) / base.monthsToRetirement
          : ((requiredBalance - currentBalance * growthFactor) * monthlyRate) /
              (growthFactor - 1)
      );

  const additionalContribution = Math.max(0, neededContribution - monthlyContribution);

  let recommendedDelayYears = 0;
  for (let y = 1; y <= 5; y += 1) {
    const delayed = calculateWithRate({
      currentBalance,
      monthlyContribution,
      yearsToRetirement: yearsToRetirement + y,
      annualReturn: expectedAnnualReturn,
      payoutYears,
    });
    if (targetMonthlyExpense > 0 && delayed.monthlyPension >= targetMonthlyExpense) {
      recommendedDelayYears = y;
      break;
    }
  }

  const scenarioRates = [
    Math.max(0, expectedAnnualReturn - 0.01),
    expectedAnnualReturn,
    expectedAnnualReturn + 0.01,
  ];

  const scenarios = scenarioRates.map((annualReturn) =>
    calculateWithRate({
      currentBalance,
      monthlyContribution,
      yearsToRetirement,
      annualReturn,
      payoutYears,
    })
  );

  return {
    yearsToRetirement,
    monthsToRetirement: base.monthsToRetirement,
    payoutMonths: base.payoutMonths,
    expectedRetirementBalance: base.totalBalance,
    expectedMonthlyPension: base.monthlyPension,
    replacementRate,
    monthlyGap,
    requiredBalance,
    additionalContribution,
    recommendedDelayYears,
    scenarios,
  };
};

