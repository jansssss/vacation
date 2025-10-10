import React, { useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

function BitcoinSimulator({ user }) {
  const [bitcoinPrice, setBitcoinPrice] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [bitcoinAmount, setBitcoinAmount] = useState(0);
  const [investAmount, setInvestAmount] = useState(100000);
  const [sellAmount, setSellAmount] = useState(0);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chargeAmount, setChargeAmount] = useState(0);
  const [showChargePopup, setShowChargePopup] = useState(false);
  const [userLevel, setUserLevel] = useState(1);
  const navigate = useNavigate();

  // 새로운 기능 상태
  const [activeTab, setActiveTab] = useState('trading'); // 'trading', 'timemachine', 'emotions', 'social'
  const [showEmotionModal, setShowEmotionModal] = useState(false);
  const [pendingTrade, setPendingTrade] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [emotionIntensity, setEmotionIntensity] = useState(3);
  const [emotionNote, setEmotionNote] = useState('');
  const [emotionStats, setEmotionStats] = useState([]);
  const [socialFeed, setSocialFeed] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeMachineMode, setTimeMachineMode] = useState(false);
  const [timeMachineDate, setTimeMachineDate] = useState(null);
  const [historicalPrices, setHistoricalPrices] = useState([]);
  const [timeMachineInvestAmount, setTimeMachineInvestAmount] = useState(1000000);
  const [timeMachineStartPrice, setTimeMachineStartPrice] = useState(0);
  const [timeMachineStartDate, setTimeMachineStartDate] = useState(null);

  useEffect(() => {
    // 타임머신 모드일 때는 실시간 가격 업데이트 중지
    if (timeMachineMode) return;

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
  }, [timeMachineMode]);

  useEffect(() => {
    if (user) {
      initializeUserAssets().then(() => {
        fetchUserAssets();
        fetchTrades();
        fetchEmotionStats();
        fetchSocialFeed();
        fetchLeaderboard();
      });
    }
  }, [user]);

  // 소셜 피드와 리더보드 주기적 업데이트
  useEffect(() => {
    if (user && activeTab === 'social') {
      const interval = setInterval(() => {
        fetchSocialFeed();
        fetchLeaderboard();
      }, 10000); // 10초마다 업데이트
      return () => clearInterval(interval);
    }
  }, [user, activeTab]);

  // 보유 BTC가 변경될 때마다 매도 수량 초기화
  useEffect(() => {
    setSellAmount(0);
  }, [bitcoinAmount]);

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

    // 감정 모달 표시
    setPendingTrade({
      type: 'BUY',
      amount: btcAmount,
      price: bitcoinPrice,
      cost: investAmount
    });
    setShowEmotionModal(true);
  };

  const executeBuyWithEmotion = async () => {
    if (!selectedEmotion) {
      alert("거래 시 감정 상태를 선택해주세요!");
      return;
    }

    const { data: tradeData, error: insertError } = await supabase.from("trades").insert({
      user_id: user.id,
      type: "BUY",
      amount: pendingTrade.amount,
      price: pendingTrade.price,
      cost: pendingTrade.cost,
    }).select();

    if (insertError) {
      alert("거래 실패: " + insertError.message);
      return;
    }

    // 감정 기록 저장
    await supabase.from("trade_emotions").insert({
      trade_id: tradeData[0].id,
      user_id: user.id,
      emotion: selectedEmotion,
      emotion_intensity: emotionIntensity,
      note: emotionNote,
    });

    const { error: updateError } = await supabase
      .from("member")
      .update({
        cash: wallet - pendingTrade.cost,
        btc: bitcoinAmount + pendingTrade.amount,
      })
      .eq("email", user.email);

    if (!updateError) {
      fetchUserAssets();
      fetchTrades();
      fetchEmotionStats();
      closeEmotionModal();
    }
  };

  // 부분 매도 함수
  const sellBitcoin = async () => {
    console.log("부분 매도 시작:", { sellAmount, bitcoinAmount, bitcoinPrice });

    if (bitcoinAmount <= 0) {
      alert("보유한 비트코인이 없습니다.");
      return;
    }

    if (sellAmount <= 0 || sellAmount > bitcoinAmount) {
      alert("매도 수량이 올바르지 않거나 보유 수량을 초과했습니다.");
      return;
    }

    const sellValue = Math.round(sellAmount * bitcoinPrice);

    // 감정 모달 표시
    setPendingTrade({
      type: 'SELL',
      amount: sellAmount,
      price: bitcoinPrice,
      cost: sellValue
    });
    setShowEmotionModal(true);
  };

  const executeSellWithEmotion = async () => {
    if (!selectedEmotion) {
      alert("거래 시 감정 상태를 선택해주세요!");
      return;
    }

    try {
      const sellValue = Math.round(pendingTrade.amount * pendingTrade.price);
      const newCash = Math.round(wallet + sellValue);
      const newBtc = bitcoinAmount - pendingTrade.amount;

      const { data: tradeData, error: insertError } = await supabase.from("trades").insert({
        user_id: user.id,
        type: "SELL",
        amount: parseFloat(pendingTrade.amount.toFixed(8)),
        price: Math.round(pendingTrade.price),
        cost: sellValue,
      }).select();

      if (insertError) {
        alert("거래 실패: " + insertError.message);
        return;
      }

      // 감정 기록 저장
      await supabase.from("trade_emotions").insert({
        trade_id: tradeData[0].id,
        user_id: user.id,
        emotion: selectedEmotion,
        emotion_intensity: emotionIntensity,
        note: emotionNote,
      });

      const { error: updateError } = await supabase
        .from("member")
        .update({
          cash: newCash,
          btc: parseFloat(newBtc.toFixed(8)),
        })
        .eq("email", user.email);

      if (!updateError) {
        fetchUserAssets();
        fetchTrades();
        fetchEmotionStats();
        setSellAmount(0);
        closeEmotionModal();
      }
    } catch (error) {
      console.error("매도 중 오류:", error);
      alert("매도 중 오류가 발생했습니다.");
    }
  };

  // 전량 매도 함수
  const sellAllBitcoin = async () => {
    console.log("전량 매도 시작:", { bitcoinAmount, bitcoinPrice });

    if (bitcoinAmount <= 0) {
      alert("보유한 비트코인이 없습니다.");
      return;
    }

    const sellValue = Math.round(bitcoinAmount * bitcoinPrice);

    // 감정 모달 표시
    setPendingTrade({
      type: 'SELL_ALL',
      amount: bitcoinAmount,
      price: bitcoinPrice,
      cost: sellValue
    });
    setShowEmotionModal(true);
  };

  const executeSellAllWithEmotion = async () => {
    if (!selectedEmotion) {
      alert("거래 시 감정 상태를 선택해주세요!");
      return;
    }

    try {
      const sellValue = Math.round(pendingTrade.amount * pendingTrade.price);
      const newCash = Math.round(wallet + sellValue);

      const { data: tradeData, error: insertError } = await supabase.from("trades").insert({
        user_id: user.id,
        type: "SELL",
        amount: parseFloat(pendingTrade.amount.toFixed(8)),
        price: Math.round(pendingTrade.price),
        cost: sellValue,
      }).select();

      if (insertError) {
        alert("거래 실패: " + insertError.message);
        return;
      }

      // 감정 기록 저장
      await supabase.from("trade_emotions").insert({
        trade_id: tradeData[0].id,
        user_id: user.id,
        emotion: selectedEmotion,
        emotion_intensity: emotionIntensity,
        note: emotionNote,
      });

      const { error: updateError } = await supabase
        .from("member")
        .update({
          cash: newCash,
          btc: 0,
        })
        .eq("email", user.email);

      if (!updateError) {
        fetchUserAssets();
        fetchTrades();
        fetchEmotionStats();
        setSellAmount(0);
        closeEmotionModal();
      }
    } catch (error) {
      console.error("전량 매도 중 오류:", error);
      alert("전량 매도 중 오류가 발생했습니다.");
    }
  };

  // 감정 모달 관련 함수
  const closeEmotionModal = () => {
    setShowEmotionModal(false);
    setPendingTrade(null);
    setSelectedEmotion('');
    setEmotionIntensity(3);
    setEmotionNote('');
  };

  const executeTradeWithEmotion = () => {
    if (pendingTrade.type === 'BUY') {
      executeBuyWithEmotion();
    } else if (pendingTrade.type === 'SELL') {
      executeSellWithEmotion();
    } else if (pendingTrade.type === 'SELL_ALL') {
      executeSellAllWithEmotion();
    }
  };

  // 감정 통계 가져오기
  const fetchEmotionStats = async () => {
    const { data, error } = await supabase
      .from('trade_emotions')
      .select(`
        *,
        trades (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setEmotionStats(data);
    }
  };

  // 소셜 피드 가져오기
  const fetchSocialFeed = async () => {
    const { data, error } = await supabase
      .from('social_feed')
      .select(`
        *,
        trades (*),
        member:user_id (email)
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setSocialFeed(data);
    }
  };

  // 리더보드 가져오기
  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from('member')
      .select('email, cash, btc, initial_cash, level')
      .order('cash', { ascending: false })
      .limit(100);

    if (!error && data) {
      const enrichedData = data.map(member => {
        const totalAssets = member.cash + member.btc * bitcoinPrice;
        const profitRate = member.initial_cash > 0
          ? ((totalAssets - member.initial_cash) / member.initial_cash * 100).toFixed(2)
          : 0;
        return {
          ...member,
          totalAssets,
          profitRate
        };
      });
      enrichedData.sort((a, b) => b.totalAssets - a.totalAssets);
      setLeaderboard(enrichedData);
    }
  };

  // 타임머신 관련 함수
  const fetchHistoricalPrice = async (date) => {
    try {
      const timestamp = Math.floor(new Date(date).getTime() / 1000);
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=krw&from=${timestamp}&to=${timestamp + 86400}`
      );
      if (response.data.prices && response.data.prices.length > 0) {
        return response.data.prices[0][1];
      }
      return null;
    } catch (error) {
      console.error('과거 가격 조회 실패:', error);
      return null;
    }
  };

  const startTimeMachine = async (startDate, investAmount) => {
    setTimeMachineMode(true);
    const startDateObj = new Date(startDate);
    setTimeMachineDate(startDateObj);
    setTimeMachineStartDate(startDateObj);

    const price = await fetchHistoricalPrice(startDate);
    if (price) {
      setBitcoinPrice(price);
      setTimeMachineStartPrice(price);
      setTimeMachineInvestAmount(investAmount);
    }
  };

  const advanceTimeMachine = async (days) => {
    if (!timeMachineDate) return;
    const newDate = new Date(timeMachineDate);
    newDate.setDate(newDate.getDate() + days);

    // 오늘 날짜를 넘어가지 않도록 제한
    const today = new Date();
    if (newDate > today) {
      alert('오늘 이후의 날짜로는 이동할 수 없습니다.');
      return;
    }

    setTimeMachineDate(newDate);
    const price = await fetchHistoricalPrice(newDate);
    if (price) {
      setBitcoinPrice(price);
    }
  };

  const exitTimeMachine = () => {
    setTimeMachineMode(false);
    setTimeMachineDate(null);
    setTimeMachineStartDate(null);
    setTimeMachineStartPrice(0);
    setTimeMachineInvestAmount(1000000);
    // 실시간 가격으로 복귀
    window.location.reload();
  };

  const emotions = [
    { name: 'fear', emoji: '😨', label: '공포' },
    { name: 'greed', emoji: '🤑', label: '탐욕' },
    { name: 'confidence', emoji: '😎', label: '자신감' },
    { name: 'anxiety', emoji: '😰', label: '불안' },
    { name: 'neutral', emoji: '😐', label: '중립' },
    { name: 'fomo', emoji: '😱', label: 'FOMO' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-4xl">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6 text-sm text-gray-700">
          <div>👤 {user?.email}</div>
          <div className="flex gap-2">
            {timeMachineMode && (
              <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded font-semibold">
                ⏰ {timeMachineDate?.toLocaleDateString('ko-KR')}
              </div>
            )}
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

        {/* 탭 네비게이션 */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('trading')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'trading'
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            💰 거래
          </button>
          <button
            onClick={() => setActiveTab('timemachine')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'timemachine'
                ? 'border-b-2 border-purple-500 text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ⏰ 타임머신
          </button>
          <button
            onClick={() => setActiveTab('emotions')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'emotions'
                ? 'border-b-2 border-pink-500 text-pink-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📔 감정 일기
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'social'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            👥 소셜
          </button>
        </div>

        {/* 충전 팝업 */}
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

        {/* 감정 선택 모달 */}
        {showEmotionModal && pendingTrade && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-96 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4 text-center">
                {pendingTrade.type === 'BUY' ? '🟢 매수' : '🔴 매도'} 시 감정 상태
              </h2>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">거래 정보</div>
                <div className="font-semibold">
                  {pendingTrade.amount.toFixed(8)} BTC
                </div>
                <div className="text-sm text-gray-600">
                  ₩{pendingTrade.cost.toLocaleString()}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">감정을 선택하세요</label>
                <div className="grid grid-cols-2 gap-2">
                  {emotions.map((emotion) => (
                    <button
                      key={emotion.name}
                      onClick={() => setSelectedEmotion(emotion.name)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedEmotion === emotion.name
                          ? 'border-orange-500 bg-orange-50 scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{emotion.emoji}</div>
                      <div className="text-sm font-medium">{emotion.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  강도: {emotionIntensity}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={emotionIntensity}
                  onChange={(e) => setEmotionIntensity(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>약함</span>
                  <span>강함</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">메모 (선택)</label>
                <textarea
                  value={emotionNote}
                  onChange={(e) => setEmotionNote(e.target.value)}
                  placeholder="왜 이 거래를 하시나요?"
                  className="w-full px-3 py-2 border rounded-lg resize-none"
                  rows="3"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={closeEmotionModal}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  취소
                </button>
                <button
                  onClick={executeTradeWithEmotion}
                  disabled={!selectedEmotion}
                  className={`px-4 py-2 rounded-lg text-white font-semibold ${
                    selectedEmotion
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  거래 실행
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 자산 정보 카드 */}
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

        {/* 거래 탭 */}
        {activeTab === 'trading' && (
        <>
        {/* 매수 섹션 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">매수 금액</label>
          <input
            type="number"
            value={investAmount}
            onChange={(e) => setInvestAmount(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4"
            placeholder="매수할 금액 (원)"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              console.log("매수 버튼 클릭됨");
              buyBitcoin();
            }}
            disabled={loading || wallet < investAmount}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl shadow transition-colors"
          >
            매수
          </button>
        </div>

        {/* 매도 섹션 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">매도 수량</label>
          <input
            type="number"
            value={sellAmount}
            onChange={(e) => setSellAmount(Number(e.target.value))}
            max={bitcoinAmount}
            step="0.00000001"
            className="w-full px-4 py-2 border rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-red-400 mb-2"
            placeholder="매도할 BTC 수량"
          />
          <div className="text-sm text-gray-500 mb-4">
            보유량: {bitcoinAmount.toFixed(8)} BTC | 예상 수익: ₩{(sellAmount * bitcoinPrice).toLocaleString()}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                console.log("부분 매도 버튼 클릭됨");
                sellBitcoin();
              }}
              disabled={loading || bitcoinAmount <= 0 || sellAmount <= 0}
              className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl shadow transition-colors"
            >
              부분 매도
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                console.log("전량 매도 버튼 클릭됨");
                sellAllBitcoin();
              }}
              disabled={loading || bitcoinAmount <= 0}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl shadow transition-colors"
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
        </>
        )}

        {/* 타임머신 탭 */}
        {activeTab === 'timemachine' && (
          <div className="space-y-6">
            <div className="bg-purple-50 p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-4 text-purple-800">⏰ 타임머신 모드</h3>
              <p className="text-sm text-gray-600 mb-4">
                과거로 돌아가서 "그때 샀더라면?" 시뮬레이션을 해보세요!
              </p>

              {!timeMachineMode ? (
                <div>
                  <label className="block text-sm font-medium mb-2">투자 금액 입력</label>
                  <input
                    type="number"
                    value={timeMachineInvestAmount}
                    onChange={(e) => setTimeMachineInvestAmount(Number(e.target.value))}
                    className="w-full px-4 py-2 border rounded-lg mb-4"
                    placeholder="투자할 금액 (원)"
                    min="10000"
                    step="10000"
                  />

                  <label className="block text-sm font-medium mb-2">시작 날짜 선택</label>
                  <input
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    min="2020-01-01"
                    onChange={(e) => {
                      if (e.target.value) {
                        if (timeMachineInvestAmount < 10000) {
                          alert('투자 금액은 최소 10,000원 이상이어야 합니다.');
                          return;
                        }
                        startTimeMachine(e.target.value, timeMachineInvestAmount);
                      }
                    }}
                    className="w-full px-4 py-2 border rounded-lg mb-4"
                  />
                  <div className="text-xs text-gray-500">
                    💡 2020년 1월 1일부터 오늘까지 선택 가능합니다
                  </div>
                </div>
              ) : (
                <div>
                  {/* 투자 시뮬레이션 결과 */}
                  <div className="mb-4 p-5 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl border-2 border-purple-300">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <div className="text-xs text-gray-600">시작일</div>
                        <div className="font-bold text-purple-700">
                          {timeMachineStartDate?.toLocaleDateString('ko-KR')}
                        </div>
                      </div>
                      <div className="text-2xl">→</div>
                      <div>
                        <div className="text-xs text-gray-600">현재</div>
                        <div className="font-bold text-purple-700">
                          {timeMachineDate?.toLocaleDateString('ko-KR')}
                        </div>
                      </div>
                    </div>

                    <div className="border-t-2 border-purple-200 pt-3 mb-3">
                      <div className="text-sm text-gray-600 mb-1">💰 투자 금액</div>
                      <div className="text-xl font-bold text-gray-800">
                        ₩{timeMachineInvestAmount.toLocaleString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-white bg-opacity-60 p-3 rounded-lg">
                        <div className="text-xs text-gray-600">시작 가격</div>
                        <div className="font-semibold text-gray-700">
                          ₩{timeMachineStartPrice.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-white bg-opacity-60 p-3 rounded-lg">
                        <div className="text-xs text-gray-600">현재 가격</div>
                        <div className="font-semibold text-gray-700">
                          ₩{bitcoinPrice.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {(() => {
                      const btcAmount = timeMachineInvestAmount / timeMachineStartPrice;
                      const currentValue = btcAmount * bitcoinPrice;
                      const profit = currentValue - timeMachineInvestAmount;
                      const profitRate = ((profit / timeMachineInvestAmount) * 100).toFixed(2);
                      const isProfit = profit >= 0;

                      return (
                        <>
                          <div className="border-t-2 border-purple-200 pt-3">
                            <div className="text-sm text-gray-600 mb-1">🎯 현재 가치</div>
                            <div className="text-2xl font-bold text-purple-600">
                              ₩{Math.round(currentValue).toLocaleString()}
                            </div>
                          </div>

                          <div className={`mt-3 p-3 rounded-lg ${isProfit ? 'bg-green-100' : 'bg-red-100'}`}>
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="text-xs text-gray-600">수익금</div>
                                <div className={`text-lg font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                                  {isProfit ? '+' : ''}₩{Math.round(profit).toLocaleString()}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-gray-600">수익률</div>
                                <div className={`text-lg font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                                  {isProfit ? '+' : ''}{profitRate}%
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-2 text-xs text-gray-500 bg-white bg-opacity-50 p-2 rounded">
                            📊 보유 BTC: {btcAmount.toFixed(8)} BTC
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <button
                      onClick={() => advanceTimeMachine(1)}
                      className="bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg text-sm"
                    >
                      +1일
                    </button>
                    <button
                      onClick={() => advanceTimeMachine(7)}
                      className="bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg text-sm"
                    >
                      +1주
                    </button>
                    <button
                      onClick={() => advanceTimeMachine(30)}
                      className="bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg text-sm"
                    >
                      +1개월
                    </button>
                    <button
                      onClick={() => advanceTimeMachine(365)}
                      className="bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg text-sm"
                    >
                      +1년
                    </button>
                  </div>

                  <button
                    onClick={exitTimeMachine}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold"
                  >
                    타임머신 종료
                  </button>

                  <div className="mt-4 text-xs text-blue-600 bg-blue-50 p-3 rounded-lg">
                    💡 시간 이동 버튼을 눌러 과거 투자의 가치 변화를 확인해보세요!
                  </div>
                  <div className="mt-2 text-xs text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                    ⚠️ 이것은 시뮬레이션입니다. 실제 자산에 영향을 주지 않습니다.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 감정 일기 탭 */}
        {activeTab === 'emotions' && (
          <div className="space-y-6">
            <div className="bg-pink-50 p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-4 text-pink-800">📔 감정 패턴 분석</h3>

              {emotionStats.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-3">📊</div>
                  <div>거래를 시작하면 감정 패턴을 분석해드립니다</div>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">감정별 거래 분포</h4>
                    <div className="space-y-2">
                      {emotions.map((emotion) => {
                        const count = emotionStats.filter(e => e.emotion === emotion.name).length;
                        const percentage = emotionStats.length > 0
                          ? ((count / emotionStats.length) * 100).toFixed(1)
                          : 0;
                        return (
                          <div key={emotion.name} className="flex items-center gap-3">
                            <span className="text-2xl">{emotion.emoji}</span>
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span>{emotion.label}</span>
                                <span className="font-semibold">{count}회 ({percentage}%)</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-pink-500 h-2 rounded-full transition-all"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">최근 감정 기록</h4>
                    <div className="max-h-60 overflow-y-auto space-y-3">
                      {emotionStats.slice(0, 10).map((stat, idx) => {
                        const emotion = emotions.find(e => e.name === stat.emotion);
                        return (
                          <div key={idx} className="border-b pb-2 last:border-b-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{emotion?.emoji}</span>
                                <span className="font-medium">{emotion?.label}</span>
                                <span className="text-xs text-gray-500">
                                  강도 {stat.emotion_intensity}/5
                                </span>
                              </div>
                              <span className="text-xs text-gray-400">
                                {new Date(stat.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            {stat.note && (
                              <div className="text-sm text-gray-600 ml-7 italic">
                                "{stat.note}"
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
                    <div className="font-semibold mb-2">💡 AI 인사이트</div>
                    <div className="text-sm text-gray-700">
                      {(() => {
                        const fearCount = emotionStats.filter(e => e.emotion === 'fear').length;
                        const greedCount = emotionStats.filter(e => e.emotion === 'greed').length;
                        if (fearCount > greedCount) {
                          return "공포 상태에서 거래하는 경향이 있습니다. 시장이 하락할 때 더 냉정한 판단이 필요합니다.";
                        } else if (greedCount > fearCount) {
                          return "탐욕 상태에서 거래하는 경향이 있습니다. 시장이 상승할 때 과도한 투자를 조심하세요.";
                        } else {
                          return "균형잡힌 감정으로 거래하고 있습니다. 계속 유지하세요!";
                        }
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 소셜 탭 */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            {/* 리더보드 */}
            <div className="bg-yellow-50 p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-4 text-yellow-800">🏆 리더보드</h3>
              <div className="space-y-2">
                {leaderboard.slice(0, 10).map((member, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      member.email === user?.email
                        ? 'bg-blue-100 border-2 border-blue-300'
                        : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`text-2xl ${
                        idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`
                      }`}>
                        {idx < 3 ? (idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉') : `#${idx + 1}`}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">
                          {member.email === user?.email ? '나' : member.email.split('@')[0]}
                        </div>
                        <div className="text-xs text-gray-500">
                          Lv.{member.level}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        ₩{member.totalAssets.toLocaleString()}
                      </div>
                      <div className={`text-xs font-semibold ${
                        member.profitRate >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {member.profitRate >= 0 ? '+' : ''}{member.profitRate}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 실시간 피드 */}
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-4 text-blue-800">👥 실시간 거래 피드</h3>
              <div className="text-sm text-gray-600 mb-4">
                다른 트레이더들의 실시간 거래를 확인하세요
              </div>

              {socialFeed.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-3">📡</div>
                  <div>아직 공개된 거래가 없습니다</div>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {socialFeed.map((feed, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {feed.member?.email?.split('@')[0] || '익명'}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            feed.trades?.type === "BUY"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}>
                            {feed.trades?.type}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(feed.created_at).toLocaleTimeString('ko-KR')}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold">
                          ₩{Number(feed.trades?.cost || 0).toLocaleString()}
                        </span>
                        <span className="text-gray-500 ml-2">
                          ({Number(feed.trades?.amount || 0).toFixed(8)} BTC)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default BitcoinSimulator;
