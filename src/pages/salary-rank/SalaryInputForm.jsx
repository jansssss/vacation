// src/pages/salary-rank/SalaryInputForm.jsx
import React, { useState } from 'react';

const SalaryInputForm = ({ stats, onSubmit }) => {
  const [job, setJob] = useState('개발');
  const [ageGroup, setAgeGroup] = useState('30대');
  const [salary, setSalary] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!salary || isNaN(salary)) {
      alert('유효한 연봉을 입력해주세요.');
      return;
    }
    onSubmit({ job, ageGroup, salary: Number(salary) });
  };

  const jobOptions = Object.keys(stats);
  const ageOptions = stats[job] ? Object.keys(stats[job]) : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <div>
        <label className="block font-medium mb-1">업종</label>
        <select value={job} onChange={(e) => setJob(e.target.value)} className="w-full border rounded p-2">
          {jobOptions.map((j) => (
            <option key={j} value={j}>{j}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">연령대</label>
        <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} className="w-full border rounded p-2">
          {ageOptions.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">연봉 (만원)</label>
        <input
          type="number"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="예: 4500"
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        내 연봉 순위 확인하기
      </button>
    </form>
  );
};

export default SalaryInputForm;