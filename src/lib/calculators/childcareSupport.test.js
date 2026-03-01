import { calculateChildcareSupport } from "./childcareSupport";

describe("calculateChildcareSupport", () => {
  it("returns null for invalid wage", () => {
    expect(calculateChildcareSupport({ monthlyWage: 0 })).toBeNull();
  });

  it("calculates reduced-hours support with employer and worker estimates", () => {
    const result = calculateChildcareSupport({
      type: "reduced-hours",
      monthlyWage: 3000000,
      months: 3,
      weeklyHoursBefore: 40,
      weeklyHoursAfter: 20,
      useOrder: 1,
      isPrioritySupportCompany: true,
      willRetainForSixMonths: true,
      workloadSharingEnabled: true,
      workloadSharingCoworkers: 2,
    });

    expect(result.type).toBe("reduced-hours");
    expect(result.workerMonthlyCompanyPay).toBe(1500000);
    expect(result.employerMonthlySupport).toBeGreaterThan(0);
    expect(result.workerMonthlyTotal).toBeGreaterThan(result.workerMonthlyCompanyPay);
    expect(result.companyMonthlySavings).toBeGreaterThan(0);
  });

  it("calculates leave support with deferred amount split", () => {
    const result = calculateChildcareSupport({
      type: "leave",
      monthlyWage: 2800000,
      months: 4,
      childAgeMonths: 10,
      useOrder: 1,
      isPrioritySupportCompany: true,
      willRetainForSixMonths: false,
    });

    expect(result.type).toBe("leave");
    expect(result.immediateEmployerSupport).toBeGreaterThan(0);
    expect(result.deferredEmployerSupport).toBe(0);
    expect(result.workerBenefitTotal).toBeGreaterThan(0);
  });
});
