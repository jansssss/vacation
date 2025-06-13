import React from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaPiggyBank } from "react-icons/fa";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 via-slate-100 to-gray-200 flex flex-col items-center justify-center text-gray-800 px-6 font-[serif] relative">
      <header className="absolute top-6 left-8 text-xl font-bold text-indigo-600 tracking-widest">
        logo
      </header>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Link
          to="/annual-leave"
          className="group bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-xl hover:scale-105 transition-transform hover:shadow-2xl border border-gray-200"
        >
          <FaCalendarAlt className="text-5xl text-indigo-600 mx-auto mb-4 group-hover:animate-bounce" />
          <h2 className="text-2xl font-semibold text-center mb-1">연차 계산기</h2>
          <p className="text-center text-gray-600 text-sm">입사일과 퇴직일 기준 연차 일수 계산</p>
        </Link>

        <Link
          to="/retirement"
          className="group bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-xl hover:scale-105 transition-transform hover:shadow-2xl border border-gray-200"
        >
          <FaPiggyBank className="text-5xl text-yellow-500 mx-auto mb-4 group-hover:animate-bounce" />
          <h2 className="text-2xl font-semibold text-center mb-1">퇴직금 계산기</h2>
          <p className="text-center text-gray-600 text-sm">평균임금 · 근속기간으로 퇴직금 계산</p>
        </Link>
      </div>

      <footer className="mt-16 text-sm text-gray-400 text-center">
        ⓒ 2025 e-work.kr | 이 계산은 참고용이며 실제와 다를 수 있습니다.
      </footer>
    </div>
  );
};

export default Home;
