import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SalaryChart = ({ result, onReset }) => {
  const { salary, percentile, data } = result;

  const chartData = [...data.map((value, index) => ({
    name: `${index + 1}위`,
    연봉: value
  })), {
    name: '나',
    연봉: salary
  }];

  return (
    <div className="space-y-6 bg-white p-4 rounded shadow">
      <p className="text-lg font-semibold">
        💰 당신의 연봉은 상위 <span className="text-blue-600">{percentile}%</span> 입니다.
      </p>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="연봉">
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.name === '나' ? '#f97316' : '#60a5fa'} // 🟧 주황색으로 '나' 표시
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <button onClick={onReset} className="bg-gray-500 text-white px-4 py-2 rounded w-full">
        다시 계산하기
      </button>
    </div>
  );
};

export default SalaryChart;
