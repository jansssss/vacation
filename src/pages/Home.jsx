import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarCheck, FaPiggyBank } from "react-icons/fa";

const Home = () => {
  const [visitCount, setVisitCount] = useState(0);

  // 방문자 수 증가 (로컬 저장 기준)
  useEffect(() => {
    const visits = localStorage.getItem("visitCount");
    const newCount = visits ? parseInt(visits) + 1 : 1;
    localStorage.setItem("visitCount", newCount);
    setVisitCount(newCount);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* 상단 헤더 */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-indigo-600">logo</div>
        <nav className="hidden md:flex space-x-4 text-sm text-gray-600">
          <Link to="/annual" className="hover:text-indigo-600">
            연차 계산기
          </Link>
          <Link to="/retirement" className="hover:text-indigo-600">
            퇴직금 계산기
          </Link>
        </nav>
      </header>

      {/* 본문 */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">📊 계산기 홈</h1>
        <p className="text-gray-600 mb-10">
          사용하실 계산기를 선택하세요.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/annual"
            className="bg-white border rounded-2xl p-6 shadow-md hover:scale-105 transition-transform"
          >
            <FaCalendarCheck className="text-5xl text-indigo-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-1">연차 계산기</h2>
            <p className="text-sm text-gray-500">입사일과 퇴직일을 기준으로 연차 일수 계산</p>
          </Link>

          <Link
            to="/retirement"
            className="bg-white border rounded-2xl p-6 shadow-md hover:scale-105 transition-transform"
          >
            <FaPiggyBank className="text-5xl text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-1">퇴직금 계산기</h2>
            <p className="text-sm text-gray-500">평균임금과 근속기간으로 퇴직금 계산</p>
          </Link>
        </div>
      </main>

      {/* 하단 푸터 */}
      <footer className="bg-white text-center text-sm text-gray-400 py-4 border-t">
        ⓒ 2025 e-work.kr |
        방문자 수: <span className="text-indigo-600 font-semibold">{visitCount}</span> |
        결과는 참고용이며 실제 지급액과 다를 수 있습니다.
      </footer>
    </div>
  );
};

export default Home;
