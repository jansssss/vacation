// src/pages/salary-rank/SalaryRankPage.jsx
import React, { useState } from 'react';
import SalaryInputForm from './SalaryInputForm';
import SalaryChart from './SalaryChart';
import salaryStats from './data/salaryStats.json';

function calculatePercentile(salary, salaryArray) {
  const sorted = [...salaryArray].sort((a, b) => a - b);
  let count = 0;
  for (let i = 0; i < sorted.length; i++) {
    if (salary > sorted[i]) count++;
  }
  const percentile = Math.round((count / sorted.length) * 100);
  return percentile;
}

const SalaryRankPage = () => {
  const [result, setResult] = useState(null);

  const handleSubmit = ({ job, ageGroup, salary }) => {
    const data = salaryStats[job]?.[ageGroup];
    if (data) {
      const percentile = calculatePercentile(salary, data);
      setResult({ job, ageGroup, salary, percentile, data });
    } else {
      alert('선택한 항목의 데이터가 없습니다.');
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <h1 className="text-3xl font-bold text-center mb-6">내 연봉 순위는?</h1>
      {!result ? (
        <SalaryInputForm stats={salaryStats} onSubmit={handleSubmit} />
      ) : (
        <SalaryChart result={result} onReset={() => setResult(null)} />
      )}
    </div>
  );
};

export default SalaryRankPage;
