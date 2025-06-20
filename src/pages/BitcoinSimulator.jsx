import React, { useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

function BitcoinSimulator({ user }) {
  const [bitcoinPrice, setBitcoinPrice] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [bitcoinAmount, setBitcoinAmount] = useState(0);
  const [investAmount, setInvestAmount] = useState(100000);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chargeAmount, setChargeAmount] = useState(0);
  const [showChargePopup, setShowChargePopup] = useState(false);
  const [userLevel, setUserLevel] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=krw"
        );
        setBitcoinPrice(response.data.bitcoin.krw);
        setLoading(false);
      } catch (error) {
        console.error("가격 조회 실패:", error);
        setBitcoinPrice(95000000);
        setLoading(false);
      }
    };
    fetchBitcoinPrice();
    const interval = setInterval(fetchBitcoinPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user) {
      initializeUserAssets().then(() => {
        fetchUserAssets();
        fetchTrades();
      });
    }
  }, [user]);

  const initializeUserAssets = async () => {
    const { count, error } = await supabase
      .from("member")
      .select("*", { count: "exact", head: true })
      .eq("email", user.email);

    if (error) {
      console.error("❌ 사용자 자산 확인 실패:", error.message);
      return;
    }

    if (count === 0) {
      const { error: insertError } = await supabase.from("member").insert({
        email: user.email,
        cash: 1000000,
        btc: 0,
        initial_cash: 1000000,
        level: 1,
      });
      if (insertError) {
        console.error("❌ 초기 자산 삽입 실패:", insertError.message);
      } else {
        console.log("✅ 최초 사용자 100만원 지급 완료");
      }
    }
  };

  const fetchUserAssets = async () => {
    const { data, error } = await supabase
      .from("member")
      .select("cash, btc, level")
      .eq("email", user.email)
      .single();

    if (data) {
      setWallet(data.cash);
      setBitcoinAmount(data.btc);
      setUserLevel(data.level || 1);
    } else {
      console.error("자산 정보 불러오기 실패:", error.message);
    }
  };

  const fetchTrades = async () => {
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) console.error("❌ 거래 불러오기 실패:", error.message);
    else setTrades(data);
  };

  const getTotalBuyCost = () => {
    return trades
      .filter((trade) => trade.type === "BUY")
      .reduce((sum, trade) => sum + trade.cost, 0);
  };

  const requestCharge = async () => {
    if (chargeAmount <= 0) {
      alert("충전 금액을 올바르게 입력하세요.");
      return;
    }

    const { error } = await supabase.from("charge_requests").insert({
      member_email: user.email,
      amount: chargeAmount,
      status: "pending",
      requested_at: new Date().toISOString(),
    });

    if (error) {
      console.error("충전 요청 실패:", error.message);
      alert("충전 요청에 실패했습니다.");
    } else {
      alert("충전 요청이 접수되었습니다. 관리자 승인 후 반영됩니다.");
      setChargeAmount(0);
      setShowChargePopup(false);
    }
  };

  const goToAdmin = () => {
    if (userLevel >= 5) {
      navigate("/charge-admin");
    } else {
      alert("접근 권한이 없습니다. 관리자만 접근할 수 있습니다.");
    }
  };

  const totalAssets = wallet + bitcoinAmount * bitcoinPrice;
  const totalBuyCost = getTotalBuyCost();
  const profitLoss = totalAssets - totalBuyCost;

  let profitRateDisplay = "0%";
  if (totalBuyCost > 0) {
    const rate = ((profitLoss / totalBuyCost) * 100).toFixed(2);
    profitRateDisplay = `${rate > 0 ? "+" : ""}${rate}%`;
  }

  const buyBitcoin = async () => {
    if (investAmount <= 0 || investAmount > wallet) {
      alert("투자 금액이 올바르지 않거나 보유 현금을 초과했습니다.");
      return;
    }

    const btcAmount = investAmount / bitcoinPrice;

    const { error: insertError } = await supabase.from("trades").insert({
      user_id: user.id,
      type: "BUY",
      amount: btcAmount,
      price: bitcoinPrice,
      cost: investAmount,
    });

    if (insertError) {
      alert("거래 실패: " + insertError.message);
      return;
    }

    const { error: updateError } = await supabase
      .from("member")
      .update({
        cash: wallet - investAmount,
        btc: bitcoinAmount + btcAmount,
      })
      .eq("email", user.email);

    if (!updateError) {
      fetchUserAssets();
      fetchTrades();
    }
  };

  const sellBitcoin = async () => {
    if (bitcoinAmount <= 0) {
      alert("보유한 비트코인이 없습니다.");
      return;
    }

    const sellValue = bitcoinAmount * bitcoinPrice;

    const { error: insertError } = await supabase.from("trades").insert({
      user_id: user.id,
      type: "SELL",
      amount: bitcoinAmount,
      price: bitcoinPrice,
      cost: sellValue,
    });

    if (insertError) {
      alert("거래 실패: " + insertError.message);
      return;
    }

    const { error: updateError } = await supabase
      .from("member")
      .update({
        cash: wallet + sellValue,
        btc: 0,
      })
      .eq("email", user.email);

    if (!updateError) {
      fetchUserAssets();
      fetchTrades();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6 text-sm text-gray-700">
          <div>👤 {user?.email}</div>
          <div className="flex gap-2">
            {userLevel >= 5 && (
              <button
                onClick={goToAdmin}
                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded"
              >
                관리자 전환
              </button>
            )}
            <button
              onClick={() => setShowChargePopup(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              충전
            </button>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/bitcoin-simulator";
              }}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
            >
              로그아웃
            </button>
          </div>
        </div>

        {showChargePopup && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-80">
              <h2 className="text-lg font-semibold mb-4">충전 요청</h2>
              <input
                type="number"
                value={chargeAmount}
                onChange={(e) => setChargeAmount(Number(e.target.value))}
                placeholder="충전할 금액"
                className="w-full px-3 py-2 border rounded mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowChargePopup(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  취소
                </button>
                <button
                  onClick={requestCharge}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  요청
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-xl text-center">
            <div className="text-sm text-gray-600">보유 현금</div>
            <div className="text-lg font-bold text-blue-600">₩{wallet.toLocaleString()}</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl text-center">
            <div className="text-sm text-gray-600">보유 BTC</div>
            <div className="text-lg font-bold text-orange-600">{bitcoinAmount.toFixed(8)} BTC</div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl text-center">
            <div className="text-sm text-gray-600">총 자산</div>
            <div className="text-lg font-bold text-green-600">₩{totalAssets.toLocaleString()}</div>
          </div>
          <div className={`p-4 rounded-xl text-center ${profitLoss >= 0 ? "bg-green-50" : "bg-red-50"}`}>
            <div className="text-sm text-gray-600">수익률</div>
            <div className={`text-lg font-bold ${profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>{profitRateDisplay}</div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">투자 금액</label>
          <input
            type="number"
            value={investAmount}
            onChange={(e) => setInvestAmount(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4"
          />
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={buyBitcoin}
              disabled={loading || wallet < investAmount}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl shadow"
            >
              매수
            </button>
            <button
              onClick={sellBitcoin}
              disabled={loading || bitcoinAmount <= 0}
              className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl shadow"
            >
              전량 매도
            </button>
          </div>
        </div>

        {trades.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="text-sm font-semibold text-gray-700 mb-3">최근 거래 내역</div>
            <div className="max-h-40 overflow-y-auto">
              {trades.slice(0, 5).map((trade, index) => (
                <div
                  key={trade.id || index}
                  className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        trade.type === "BUY"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {trade.type}
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      {new Date(trade.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      ₩{Number(trade.cost).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Number(trade.amount).toFixed(8)} BTC
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BitcoinSimulator;
