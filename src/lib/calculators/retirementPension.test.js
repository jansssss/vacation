import { calculateRetirementPension } from "./retirementPension";

describe("calculateRetirementPension", () => {
  it("returns expected key outputs", () => {
    const result = calculateRetirementPension({
      currentAge: 35,
      retirementAge: 60,
      currentBalance: 20000000,
      monthlyContribution: 300000,
      expectedAnnualReturn: 0.045,
      payoutYears: 20,
      targetMonthlyExpense: 2500000,
    });

    expect(result.yearsToRetirement).toBe(25);
    expect(result.expectedRetirementBalance).toBeGreaterThan(0);
    expect(result.expectedMonthlyPension).toBeGreaterThan(0);
    expect(result.scenarios).toHaveLength(3);
    expect(result.additionalContribution).toBeGreaterThanOrEqual(0);
  });
});

