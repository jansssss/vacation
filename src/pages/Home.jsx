import React from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaRegMoneyBillAlt } from "react-icons/fa";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f9f9] via-[#f3f4f6] to-[#eef1f5] text-gray-800 font-serif px-6 flex flex-col justify-center items-center">
      {/* 로고 */}
      <header className="absolute top-6 left-8 text-[20px] font-bold text-gray-700 tracking-wider">
        <span className="text-indigo-600">e</span>-Work.kr
      </header>

      {/* 제목 */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
        계산기 홈
      </h1>
      <p className="text-gray-500 text-base md:text-lg mb-12 text-center">
        미래지향적 근로자 지원 계산기 플랫폼
      </p>

      {/* 카드 박스 */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center items-center">
        <Link
          to="/annual-leave"
          className="w-72 h-44 bg-white/40 backdrop-blur-md border border-white/20 rounded-3xl shadow-xl p-6 flex flex-col justify-center items-center hover:scale-105 transition-all duration-300 hover:shadow-2xl"
        >
          <FaCalendarAlt className="text-indigo-500 text-5xl mb-3 drop-shadow" />
          <h2 className="text-xl font-semibold mb-1 text-gray-800">연차 계산기</h2>
          <p className="text-gray-500 text-sm text-center">
            입사일과 퇴직일 기준으로 연차 일수 계산
          </p>
        </Link>

        <Link
          to="/retirement"
          className="w-72 h-44 bg-white/40 backdrop-blur-md border border-white/20 rounded-3xl shadow-xl p-6 flex flex-col justify-center items-center hover:scale-105 transition-all duration-300 hover:shadow-2xl"
        >
          <FaRegMoneyBillAlt className="text-amber-500 text-5xl mb-3 drop-shadow" />
          <h2 className="text-xl font-semibold mb-1 text-gray-800">퇴직금 계산기</h2>
          <p className="text-gray-500 text-sm text-center">
            평균임금 · 근속기간으로 퇴직금 계산
          </p>
        </Link>
      </div>

      {/* 푸터 */}
      <footer className="mt-16 text-sm text-gray-400 text-center">
        ⓒ 2025 e-work.kr | 이 계산은 참고용이며 실제와 다를 수 있습니다.
      </footer>
    </div>
  );
};

export default Home;
