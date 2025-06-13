// src/pages/SalaryCalculator.jsx
import React, { useState } from "react";

const SalaryCalculator = () => {
  const [gross, setGross] = useState("");
  const [net, setNet] = useState(null);
  const [breakdown, setBreakdown] = useState(null);

  const handleCalculate = () => {
    const grossPay = parseInt(gross, 10);

    // 공제율 (2024 기준 추정치)
    const 국민연금 = grossPay * 0.045;
    const 건강보험 = grossPay * 0.03545;
    const 장기요양 = 건강보험 * 0.1227;
    const 고용보험 = grossPay * 0.009;
    const 소득세 = grossPay * 0.02; // 단순화
    const 지방소득세 = 소득세 * 0.1;

    const totalDeductions = 국민연금 + 건강보험 + 장기요양 + 고용보험 + 소득세 + 지방소득세;
    const 실수령액 = grossPay - totalDeductions;

    setNet(실수령액.toFixed(0));
    setBreakdown({
      국민연금: 국민연금.toFixed(0),
      건강보험: 건강보험.toFixed(0),
      장기요양: 장기요양.toFixed(0),
      고용보험: 고용보험.toFixed(0),
      소득세: 소득세.toFixed(0),
      지방소득세: 지방소득세.toFixed(0),
      총공제: totalDeductions.toFixed(0),
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">💰 실수령액 계산기</h1>

      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4">
        <label className="block font-medium text-gray-700">
          세전 월급 (₩)
          <input
            type="number"
            value={gross}
            onChange={(e) => setGross(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="예: 3000000"
          />
        </label>

        <button
          onClick={handleCalculate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
        >
          계산하기
        </button>

        {net && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-gray-800 text-center">
              👉 실수령액: <span className="text-blue-600">{net}원</span>
            </h2>

            <div className="mt-4 text-sm text-gray-600 space-y-1">
              {Object.entries(breakdown).map(([key, val]) => (
                <div key={key} className="flex justify-between">
                  <span>{key}</span>
                  <span>{parseInt(val).toLocaleString()} 원</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryCalculator;
