import React, { useState } from "react";

// 연차법 완전 반영 (1년 미만: 입사년 12월까지, 2년차: 익년 1월~만1년월+15, 이후 3년차~)
function calculateAnnualLeaveByYears(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (endDate < startDate) {
    return {
      years: [],
      detail: [],
      total: 0,
      msg: "종료일이 입사일보다 빠릅니다"
    };
  }

  let years = [];
  let detail = [];
  let total = 0;

  let pointer = new Date(startDate);
  let firstYear = startDate.getFullYear();
  let firstYearEnd = new Date(firstYear, 11, 31);
  let first = 0;
  pointer.setMonth(pointer.getMonth() + 1);
  while (pointer <= firstYearEnd && pointer <= endDate) {
    first++;
    pointer.setMonth(pointer.getMonth() + 1);
  }
  if (first > 0) {
    years.push("1년차");
    detail.push(first);
    total += first;
  }

  let anniv = new Date(startDate);
  anniv.setFullYear(anniv.getFullYear() + 1);
  let secondYearStart = new Date(firstYear + 1, 0, 1);
  let second = 0;
  if (endDate >= secondYearStart) {
    let pointer2 = new Date(secondYearStart);
    while (
      (pointer2.getFullYear() < anniv.getFullYear() ||
        (pointer2.getFullYear() === anniv.getFullYear() &&
          pointer2.getMonth() < anniv.getMonth())) &&
      pointer2 <= endDate
    ) {
      second++;
      pointer2.setMonth(pointer2.getMonth() + 1);
    }
    if (endDate >= anniv) {
      second += 15;
    }
    years.push("2년차");
    detail.push(second);
    total += second;
  }

  let currAnniv = new Date(anniv);
  currAnniv.setFullYear(currAnniv.getFullYear() + 1);
  let careerYear = 3;
  while (currAnniv <= endDate) {
    let count = 15 + Math.floor((careerYear - 2) / 2);
    if (careerYear === 3) count = 16;
    if (
      currAnniv.getFullYear() > endDate.getFullYear() ||
      (currAnniv.getFullYear() === endDate.getFullYear() &&
        currAnniv.getMonth() > endDate.getMonth())
    ) {
      years.push(`${careerYear}년차`);
      detail.push(0);
    } else {
      years.push(`${careerYear}년차`);
      detail.push(count);
      total += count;
    }
    currAnniv.setFullYear(currAnniv.getFullYear() + 1);
    careerYear++;
  }

  return {
    years,
    detail,
    total,
    msg: null
  };
}

function AnnualLeaveCalculator() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = () => {
    if (!startDate || !endDate) {
      alert("입사일과 퇴직일을 모두 입력하세요.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setResult(calculateAnnualLeaveByYears(startDate, endDate));
      setLoading(false);
    }, 1400);
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setResult(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">📅 연차휴가 계산기</h1>
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">입사일</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">퇴직일</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-md"
          >
            초기화
          </button>
          <button
            onClick={handleCalculate}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md"
          >
            계산
          </button>
        </div>
        {loading && (
          <div className="text-center text-indigo-500 font-medium mt-4">계산 중...</div>
        )}
        {result && !loading && (
          <div className="mt-4 text-center">
            <div className="text-lg font-bold mb-2">연차 총합: <span className="text-indigo-600">{result.total}일</span></div>
            <ul className="text-sm text-gray-700 space-y-1">
              {result.years.map((year, i) => (
                <li key={i}>{year}: {result.detail[i]}일</li>
              ))}
            </ul>
            {result.msg && <div className="text-red-500 font-semibold mt-2">{result.msg}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default AnnualLeaveCalculator;
