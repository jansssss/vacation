import React from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaCoins,
  FaWallet,
  FaChartBar,
  FaBitcoin,
  FaExchangeAlt,
} from "react-icons/fa";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-[#eef7f6] to-[#eaf4eb] text-gray-800 flex flex-col justify-center items-center px-6 font-sans">
      {/* 카드 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl">
        <Link
          to="/annual-leave"
          className="bg-white hover:bg-blue-50 border border-gray-200 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all text-center"
        >
          <FaCalendarAlt className="text-4xl text-blue-500 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-800 mb-1">연차 계산기</h2>
          <p className="text-sm text-gray-500">입사일과 퇴직일을 기준으로 연차 일수 계산</p>
        </Link>

        <Link
          to="/retirement"
          className="bg-white hover:bg-yellow-50 border border-gray-200 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all text-center"
        >
          <FaCoins className="text-4xl text-yellow-500 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-800 mb-1">퇴직금 계산기</h2>
          <p className="text-sm text-gray-500">평균임금과 근속기간을 기반으로 퇴직금 산정</p>
        </Link>

        <Link
          to="/bitcoin-simulator"
          className="bg-white hover:bg-orange-50 border border-gray-200 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all text-center"
        >
          <FaBitcoin className="text-4xl text-orange-500 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-800 mb-1">비트코인 시뮬레이터</h2>
          <p className="text-sm text-gray-500">가상 투자로 비트코인 거래 전략 연습하기</p>
        </Link>

        <Link
          to="/xrp-xlm-compare"
          className="bg-white hover:bg-purple-50 border border-gray-200 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all text-center"
        >
          <FaExchangeAlt className="text-4xl text-purple-500 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-800 mb-1">XRP-XLM 비교</h2>
          <p className="text-sm text-gray-500">리플과 스텔라 실시간 가격차 분석</p>
        </Link>

        {/* ✅ 포트폴리오 카드 추가 */}
        <Link
          to="/portfolio"
          className="bg-white hover:bg-green-50 border border-gray-200 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all text-center"
        >
          <FaChartBar className="text-4xl text-green-500 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-800 mb-1">포트폴리오</h2>
          <p className="text-sm text-gray-500">주식·코인 기반 헷지 포트폴리오 구성</p>
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
