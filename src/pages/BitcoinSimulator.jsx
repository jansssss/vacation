import React, { useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "../lib/supabaseClient";

function BitcoinSimulator({ user }) {
  const [bitcoinPrice, setBitcoinPrice] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [bitcoinAmount, setBitcoinAmount] = useState(0);
  const [investAmount, setInvestAmount] = useState(100000);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialCash, setInitialCash] = useState(0);

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

  const initializeUserAssets = async () => {
    const { data, error, status } = await supabase
      .from("member")
      .select("cash, btc, initial_cash")
      .eq("email", user.email)
      .maybeSingle();

    if (!data && status === 200) {
      const { error: insertError } = await supabase.from("member").insert({
        email: user.email,
        cash: 1000000,
        btc: 0,
        initial_cash: 1000000,
      });
      if (insertError) {
        console.error("❌ 초기 자산 생성 실패:", insertError.message);
      } else {
        console.log("✅ 사용자 최창 로그인, 자산 등록 완료");
      }
    } else {
      console.log("ℹ️ 기존 사용자 자산 있음");
    }
  };

  const fetchUserAssets = async () => {
    const { data, error } = await supabase
      .from("member")
      .select("cash, btc, initial_cash")
      .eq("email", user.email)
      .single();

    if (data) {
      setWallet(data.cash);
      setBitcoinAmount(data.btc);
      setInitialCash(data.initial_cash || 0);
    } else {
      console.error("자산 정보 불러오기 실패:", error.message);
    }
  };

  const insertTrade = async ({ type, amount, price, cost }) => {
    const { error } = await supabase.from("trades").insert([
      {
        user_id: user.id,
        type,
        amount,
        price,
        cost,
      },
    ]);
    if (error) console.error("📋 거래 저장 실패:", error.message);
    else fetchTrades();
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

  useEffect(() => {
    if (user) {
      const init = async () => {
        await initializeUserAssets();
        await fetchUserAssets();
        await fetchTrades();
      };
      init();
    }
  }, [user]);

  const buyBitcoin = async () => {
    if (investAmount <= 0) {
      alert("투자 금액을 올바르게 입력하세요.");
      return;
    }

    const { data: current, error } = await supabase
      .from("member")
      .select("cash, btc")
      .eq("email", user.email)
      .single();

    if (error || !current) {
      alert("자산 정보를 불러오수 없습니다.");
      return;
    }

    const currentCash = current.cash;
    const currentBtc = current.btc;

    if (investAmount > currentCash) {
      alert("보유 현금보다 많은 금액은 투자할 수 없습니다.");
      return;
    }

    const btcAmount = investAmount / bitcoinPrice;

    await insertTrade({ type: "BUY", amount: btcAmount, price: bitcoinPrice, cost: investAmount });

    const { error: updateError } = await supabase
      .from("member")
      .update({
        cash: currentCash - investAmount,
        btc: currentBtc + btcAmount,
      })
      .eq("email", user.email);

    if (updateError) {
      console.error("❌ 자산 업데이트 실패:", updateError.message);
      alert("자산 업데이트에 실패했습니다.");
      return;
    }

    await fetchUserAssets();
  };

  const sellBitcoin = async () => {
    const { data: current, error } = await supabase
      .from("member")
      .select("cash, btc")
      .eq("email", user.email)
      .single();

    if (error || !current) {
      alert("자산 정보를 불러오수 없습니다.");
      return;
    }

    const currentCash = current.cash;
    const currentBtc = current.btc;

    if (currentBtc <= 0) {
      alert("보유한 비트코인이 없습니다.");
      return;
    }

    const sellValue = currentBtc * bitcoinPrice;

    await insertTrade({ type: "SELL", amount: currentBtc, price: bitcoinPrice, cost: sellValue });

    const { error: updateError } = await supabase
      .from("member")
      .update({
        cash: currentCash + sellValue,
        btc: 0,
      })
      .eq("email", user.email);

    if (updateError) {
      console.error("❌ 자산 업데이트 실패:", updateError.message);
      alert("자산 업데이트에 실패했습니다.");
      return;
    }

    await fetchUserAssets();
  };

  const totalAssets = wallet + bitcoinAmount * bitcoinPrice;
  const profitLoss = totalAssets - initialCash;
  let profitRateDisplay = "0%";

  if (initialCash > 0) {
    const rate = ((profitLoss / initialCash) * 100).toFixed(2);
    profitRateDisplay = `${rate > 0 ? "+" : ""}${rate}%`;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-2xl">
        ... (중략: 나머지 UI 부분은 동일하게 유지됨) ...
      </div>
    </div>
  );
}

export default BitcoinSimulator;
