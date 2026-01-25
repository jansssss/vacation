import { calculateSeverancePay } from "./severancePay";

describe("calculateSeverancePay", () => {
  test("returns error on invalid input", () => {
    const result = calculateSeverancePay({ avgMonthlyWage: 0, years: 1, months: 0 });
    expect(result.error).toBeTruthy();
  });

  test("calculates severance pay for full years", () => {
    const result = calculateSeverancePay({ avgMonthlyWage: 3000000, years: 3, months: 0 });
    expect(result.pay).toBe(9000000);
  });

  test("calculates severance pay with months", () => {
    const result = calculateSeverancePay({ avgMonthlyWage: 3000000, years: 1, months: 6 });
    expect(result.pay).toBe(4500000);
  });
});
