import React from "react";

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          📊 자산 포트폴리오 관리
        </h1>

        <div className="bg-white shadow-md rounded-2xl p-6 space-y-6">
          {/* 자산 등록 폼 */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-gray-700">➕ 자산 추가</h2>
            <form className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="자산명 (예: BTC, SCHD)"
                className="border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                placeholder="보유 수량"
                className="border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                placeholder="매입 단가"
                className="border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select className="border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>자산 유형 선택</option>
                <option value="stock">주식/ETF</option>
                <option value="bitcoin">비트코인</option>
              </select>
              <button
                type="submit"
                className="col-span-full mt-2 bg-indigo-600 text-white py-2 rounded-xl shadow hover:bg-indigo-700 transition"
              >
                등록하기
              </button>
            </form>
          </div>

          {/* 자산 리스트 */}
          <div>
            <h2 className="text-xl font-medium text-gray-700 mb-3">📄 보유 자산</h2>
            <div className="space-y-3">
              {/* 자산 카드 반복 영역 */}
              <div className="bg-gray-100 p-4 rounded-xl shadow-sm flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-gray-800">BTC</p>
                  <p className="text-sm text-gray-500">보유량: 0.1, 매입가: 30,000</p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-bold">+3.2%</p>
                  <p className="text-sm text-gray-400">수익률</p>
                </div>
              </div>
              {/* ...추가 자산 카드 */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
