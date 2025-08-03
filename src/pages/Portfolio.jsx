// Portfolio.jsx — BitcoinSimulator 구조에 맞춰 작성

import React, { useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

function Portfolio() {
  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    buyPrice: 0,
    type: "stock",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addAsset = (e) => {
    e.preventDefault();
    if (!formData.name || formData.quantity <= 0 || formData.buyPrice <= 0) {
      alert("입력값을 올바르게 입력해주세요.");
      return;
    }
    setAssets((prev) => [...prev, formData]);
    setFormData({ name: "", quantity: 0, buyPrice: 0, type: "stock" });
  };

  const totalAssetValue = assets.reduce(
    (sum, a) => sum + a.quantity * a.buyPrice,
    0
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          📊 자산 포트폴리오 관리
        </h1>

        <form onSubmit={addAsset} className="grid grid-cols-1 gap-4 mb-8">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="자산명 (예: BTC, SCHD)"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="보유 수량"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="number"
            name="buyPrice"
            value={formData.buyPrice}
            onChange={handleChange}
            placeholder="매입 단가"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="stock">주식/ETF</option>
            <option value="bitcoin">비트코인</option>
          </select>
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg font-semibold shadow"
          >
            자산 등록
          </button>
        </form>

        {assets.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-xl">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              📋 보유 자산 목록
            </h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {assets.map((asset, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  <div>
                    <div className="font-semibold text-gray-800">{asset.name}</div>
                    <div className="text-sm text-gray-500">
                      {asset.quantity} x ₩{asset.buyPrice.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    ₩{(asset.quantity * asset.buyPrice).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-right font-semibold text-indigo-600">
              총 자산 평가금액: ₩{totalAssetValue.toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Portfolio;
