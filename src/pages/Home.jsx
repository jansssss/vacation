import React from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaCoins, FaWallet, FaChartBar } from "react-icons/fa";


const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-[#eef7f6] to-[#eaf4eb] text-gray-800 flex flex-col justify-center items-center px-6 font-sans">
      {/* 상단 로고 */}
     

      {/* 타이틀 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3 tracking-tight">
          근로자 계산기
        </h1>
        <p className="text-lg text-gray-500">
          미래를 준비하는, 세련된 계산 도구
        </p>
      </div>

      {/* 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Link
          to="/annual-leave"
          className="bg-white hover:bg-blue-50 border border-gray-200 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all text-center"
        >
          <FaCalendarAlt className="text-4xl text-blue-500 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            연차 계산기
          </h2>
          <p className="text-sm text-gray-500">
            입사일과 퇴직일을 기준으로 연차 일수 계산
          </p>
        </Link>

        <Link
          to="/retirement"
          className="bg-white hover:bg-yellow-50 border border-gray-200 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all text-center"
        >
          <FaCoins className="text-4xl text-yellow-500 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            퇴직금 계산기
          </h2>
          <p className="text-sm text-gray-500">
            평균임금과 근속기간을 기반으로 퇴직금 산정
          </p>
        </Link>
      </div>

      {/* 하단 안내 */}
      <footer className="mt-16 text-sm text-gray-400 text-center">
        ⓒ 2025 e-work.kr | 참고용 계산 결과입니다.
      </footer>
    </div>
  );
};

export default Home;
