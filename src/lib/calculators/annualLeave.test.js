import { calculateAnnualLeave } from "./annualLeave";

describe("calculateAnnualLeave", () => {
  test("returns error when end date is before start date", () => {
    const result = calculateAnnualLeave("2026-01-10", "2026-01-01");
    expect(result.error).toBeTruthy();
  });

  test("calculates first year monthly leave (11 months)", () => {
    const result = calculateAnnualLeave("2025-03-01", "2026-02-28");
    expect(result.total).toBe(11);
    expect(result.breakdown).toHaveLength(1);
    expect(result.breakdown[0].days).toBe(11);
  });

  test("calculates 2nd year: 25 - first year days (11 months in first year)", () => {
    const result = calculateAnnualLeave("2025-03-01", "2026-03-01");
    expect(result.total).toBe(25); // 11 (1년차) + 14 (2년차: 25-11)
    expect(result.breakdown).toHaveLength(2);
    expect(result.breakdown[0].days).toBe(11); // 1년차
    expect(result.breakdown[1].days).toBe(14); // 2년차: 25 - 11
  });

  test("calculates 2nd year: 25 - first year days (partial first year)", () => {
    const result = calculateAnnualLeave("2025-07-01", "2026-07-01");
    expect(result.total).toBe(25); // 11 (1년차) + 14 (2년차: 25-11)
    expect(result.breakdown).toHaveLength(2);
    expect(result.breakdown[0].days).toBe(11); // 1년차 (최대 11개월)
    expect(result.breakdown[1].days).toBe(14); // 2년차: 25 - 11
  });

  test("calculates 3rd year: base 15 days", () => {
    const result = calculateAnnualLeave("2025-03-01", "2027-03-01");
    expect(result.total).toBe(40); // 11 (1년차) + 14 (2년차) + 15 (3년차)
    expect(result.breakdown).toHaveLength(3);
    expect(result.breakdown[2].days).toBe(15); // 3년차
  });

  test("calculates 4th year: base 15 days", () => {
    const result = calculateAnnualLeave("2025-03-01", "2028-03-01");
    expect(result.total).toBe(55); // 11 + 14 + 15 + 15
    expect(result.breakdown).toHaveLength(4);
    expect(result.breakdown[3].days).toBe(15); // 4년차
  });

  test("calculates 5th year: 15 + 1 extra", () => {
    const result = calculateAnnualLeave("2025-03-01", "2029-03-01");
    expect(result.total).toBe(71); // 11 + 14 + 15 + 15 + 16
    expect(result.breakdown).toHaveLength(5);
    expect(result.breakdown[4].days).toBe(16); // 5년차: 15 + 1
  });

  test("calculates 7th year: 15 + 2 extra", () => {
    const result = calculateAnnualLeave("2025-03-01", "2031-03-01");
    expect(result.total).toBe(104); // 11 + 14 + 15 + 15 + 16 + 16 + 17
    expect(result.breakdown).toHaveLength(7);
    expect(result.breakdown[6].days).toBe(17); // 7년차: 15 + 2
  });
});
