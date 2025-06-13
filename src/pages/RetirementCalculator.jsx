import React, { useState } from "react";

function RetirementCalculator() {
  const [avgSalary, setAvgSalary] = useState(3000000);
  const [yearsWorked, setYearsWorked] = useState(3);
  const [result, setResult] = useState(null);

  const calculateRetirement = () => {
    if (!avgSalary || !yearsWorked || avgSalary < 0 || yearsWorked <= 0) {
      alert("평균임금과 근속연수를 올바르게 입력하세요.");
      return;
    }
    const retirementPay = avgSalary * 0.5 * yearsWorked;
    setResult(retirementPay);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-green-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md text-center">
        <div className="text-3xl font-bold mb-1">퇴직금 계산기</div>
        <div className="text-sm text-gray-500 mb-6">평균임금과 근속기간을 기준으로 퇴직금 산정</div>

        <div className="text-left mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">평균임금 (월)</label>
          <input
            type="number"
            value={avgSalary}
            onChange={(e) => setAvgSalary(Number(e.target.value))}
            placeholder="예: 3000000"
            className="w-full px-4 py-2 border rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="text-left mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">근속연수 (년)</label>
          <input
            type="number"
            value={yearsWorked}
            onChange={(e) => setYearsWorked(Number(e.target.value))}
            placeholder="예: 3"
            className="w-full px-4 py-2 border rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          onClick={calculateRetirement}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl shadow"
        >
          계산하기
        </button>

        {result !== null && (
          <div className="mt-6 text-xl text-gray-800 font-bold">
            퇴직금: {result.toLocaleString()} 원
          </div>
        )}
      </div>
    </div>
  );
}

export default RetirementCalculator;
