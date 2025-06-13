import React from "react";
import { FaCalendarAlt, FaCoins, FaWallet, FaChartBar } from "react-icons/fa";
import CalculatorCard from "../components/CalculatorCard";

const Home = () => {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-2">근로자 계산기</h1>
      <p className="mb-8 text-gray-600">미래를 준비하는, 세련된 계산 도구</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CalculatorCard
          title="연차 계산기"
          description="입사일과 퇴직일 기준 연차 일수 계산"
          icon={<FaCalendarAlt />}
          to="/annual-leave"
          color="text-blue-500"
        />
        <CalculatorCard
          title="퇴직금 계산기"
          description="평균임금과 근속기간으로 퇴직금 산정"
          icon={<FaCoins />}
          to="/retirement"
          color="text-yellow-500"
        />
        <CalculatorCard
          title="실수령액 계산기"
          description="월급에서 4대보험 공제 후 실수령액 계산"
          icon={<FaWallet />}
          to="/salary"
          color="text-gray-700"
        />
        <CalculatorCard
          title="내 연봉 순위"
          description="동종 업종/연령대에서 내 연봉 퍼센타일 확인"
          icon={<FaChartBar />}
          to="/salary-rank"
          color="text-purple-600"
        />
      </div>
    </div>
  );
};

export default Home;
