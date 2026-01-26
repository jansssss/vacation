import { calculateAnnualLeave } from "./annualLeave";

describe("calculateAnnualLeave", () => {
  test("returns error when end date is before start date", () => {
    const result = calculateAnnualLeave("2026-01-10", "2026-01-01");
    expect(result.error).toBeTruthy();
  });

  test("calculates first year monthly leave (10 months for March 1 start)", () => {
    const result = calculateAnnualLeave("2025-03-01", "2026-02-28");
    expect(result.total).toBe(10); // 3월~12월 = 10개월
    expect(result.breakdown).toHaveLength(1);
    expect(result.breakdown[0].days).toBe(10);
  });

  test("calculates 2nd year: 26 - first year days (March 1 start)", () => {
    const result = calculateAnnualLeave("2025-03-01", "2026-03-01");
    expect(result.total).toBe(26); // 10 (1년차) + 16 (2년차: 26-10)
    expect(result.breakdown).toHaveLength(2);
    expect(result.breakdown[0].days).toBe(10); // 1년차
    expect(result.breakdown[1].days).toBe(16); // 2년차: 26 - 10
  });

  test("calculates for January 1 start (max first year)", () => {
    const result = calculateAnnualLeave("2025-01-01", "2026-01-01");
    expect(result.total).toBe(26); // 11 (1년차 최대) + 15 (2년차: 26-11)
    expect(result.breakdown).toHaveLength(2);
    expect(result.breakdown[0].days).toBe(11); // 1년차 최대
    expect(result.breakdown[1].days).toBe(15); // 2년차: 26 - 11
  });

  test("calculates for October 26 start (real case)", () => {
    const result = calculateAnnualLeave("2025-10-26", "2027-11-28");
    expect(result.total).toBe(41); // 2 (1년차) + 24 (2년차: 26-2) + 15 (3년차)
    expect(result.breakdown).toHaveLength(3);
    expect(result.breakdown[0].days).toBe(2); // 1년차: 11월, 12월
    expect(result.breakdown[1].days).toBe(24); // 2년차: 26 - 2
    expect(result.breakdown[2].days).toBe(15); // 3년차
  });

  test("calculates 3rd year: base 15 days", () => {
    const result = calculateAnnualLeave("2025-03-01", "2027-03-01");
    expect(result.total).toBe(41); // 10 (1년차) + 16 (2년차) + 15 (3년차)
    expect(result.breakdown).toHaveLength(3);
    expect(result.breakdown[2].days).toBe(15); // 3년차
  });

  test("calculates 4th year: base 15 days", () => {
    const result = calculateAnnualLeave("2025-03-01", "2028-03-01");
    expect(result.total).toBe(56); // 10 + 16 + 15 + 15
    expect(result.breakdown).toHaveLength(4);
    expect(result.breakdown[3].days).toBe(15); // 4년차
  });

  test("calculates 5th year: 15 + 1 extra", () => {
    const result = calculateAnnualLeave("2025-03-01", "2029-03-01");
    expect(result.total).toBe(72); // 10 + 16 + 15 + 15 + 16
    expect(result.breakdown).toHaveLength(5);
    expect(result.breakdown[4].days).toBe(16); // 5년차: 15 + 1
  });

  test("calculates 7th year: 15 + 2 extra", () => {
    const result = calculateAnnualLeave("2025-03-01", "2031-03-01");
    expect(result.total).toBe(105); // 10 + 16 + 15 + 15 + 16 + 16 + 17
    expect(result.breakdown).toHaveLength(7);
    expect(result.breakdown[6].days).toBe(17); // 7년차: 15 + 2
  });
});
