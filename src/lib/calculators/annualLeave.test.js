import { calculateAnnualLeave } from "./annualLeave";

describe("calculateAnnualLeave", () => {
  test("returns error when end date is before start date", () => {
    const result = calculateAnnualLeave("2026-01-10", "2026-01-01");
    expect(result.error).toBeTruthy();
  });

  test("calculates first year monthly leave", () => {
    const result = calculateAnnualLeave("2025-03-01", "2026-02-28");
    expect(result.total).toBe(11);
  });

  test("calculates leave after one year", () => {
    const result = calculateAnnualLeave("2025-03-01", "2026-03-01");
    expect(result.total).toBe(26);
  });
});
