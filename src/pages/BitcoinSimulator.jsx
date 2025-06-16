import React, { useState, useEffect } from "react";
import axios from "axios";

function BitcoinSimulator() {
  const [bitcoinPrice, setBitcoinPrice] = useState(0);
  const [wallet, setWallet] = useState(1000000); // 초기 자금 100만원
  const [bitcoinAmount, setBitcoinAmount] = useState(0);
  const [investAmount, setInvestAmount] = useState(100000);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  // 비트코인 가격 가져오기
  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=krw'
        );
        setBitcoinPrice(response.data.bitcoin.krw);
        setLoading(false);
      } catch (error) {
        console.error('가격 조회 실패:', error);
        setBitcoinPrice(95000000); // 기본값 설정 (약 9500만원)
        setLoading(false);
      }
    };

    fetchBitcoinPrice();
    // 30초마다 가격 업데이트
    const interval = setInterval(fetchBitcoinPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  // 비트코인 매수
  const buyBitcoin = () => {
    if (investAmount <= 0 || investAmount > wallet) {
      alert("투자 금액을 올바르게 입력하세요.");
      return;
    }

    const btcAmount = investAmount / bitcoinPrice;
    setWallet(wallet - investAmount);
    setBitcoinAmount(bitcoinAmount + btcAmount);
    
    const newTrade = {
      type: 'BUY',
      amount: btcAmount,
      price: bitcoinPrice,
      cost: investAmount,
      time: new Date().toLocaleString()
    };
    setTrades([newTrade, ...trades]);
  };

  // 비트코인 매도
  const sellBitcoin = () => {
    if (bitcoinAmount <= 0) {
      alert("보유한 비트코인이 없습니다.");
      return;
    }

    const sellValue = bitcoinAmount * bitcoinPrice;
    setWallet(wallet + sellValue);
    
    const newTrade = {
      type: 'SELL',
      amount: bitcoinAmount,
      price: bitcoinPrice,
      cost: sellValue,
      time: new Date().toLocaleString()
    };
    setTrades([newTrade, ...trades]);
    setBitcoinAmount(0);
  };

  // 총 자산 계산
  const totalAssets = wallet + (bitcoinAmount * bitcoinPrice);
  const profitLoss = totalAssets - 1000000;
  const profitRate = ((profitLoss / 1000000) * 100).toFixed(2);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-3xl font-bold mb-1">비트코인 시뮬레이터</div>
          <div className="text-sm text-gray-500">가상 투자로 비트코인 거래 전략 연습하기</div>
        </div>

        {/* 현재 가격 */}
        <div className="bg-gray-50 p-4 rounded-xl mb-6">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700">현재 비트코인 가격</div>
            <div className="text-2xl font-bold text-orange-600">
              {loading ? "로딩중..." : `₩${bitcoinPrice.toLocaleString()}`}
            </div>
          </div>
        </div>

        {/* 자산 현황 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-xl text-center">
            <div className="text-sm text-gray-600">보유 현금</div>
            <div className="text-lg font-bold text-blue-600">
              ₩{wallet.toLocaleString()}
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl text-center">
            <div className="text-sm text-gray-600">보유 BTC</div>
            <div className="text-lg font-bold text-orange-600">
              {bitcoinAmount.toFixed(8)} BTC
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl text-center">
            <div className="text-sm text-gray-600">총 자산</div>
            <div className="text-lg font-bold text-green-600">
              ₩{totalAssets.toLocaleString()}
            </div>
          </div>
          <div className={`p-4 rounded-xl text-center ${profitLoss >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="text-sm text-gray-600">수익률</div>
            <div className={`text-lg font-bold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profitRate}%
            </div>
          </div>
        </div>

        {/* 거래 패널 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">투자 금액</label>
          <input
            type="number"
            value={investAmount}
            onChange={(e) => setInvestAmount(Number(e.target.value))}
            placeholder="투자할 금액"
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

        {/* 거래 내역 */}
        {trades.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="text-sm font-semibold text-gray-700 mb-3">최근 거래 내역</div>
            <div className="max-h-40 overflow-y-auto">
              {trades.slice(0, 5).map((trade, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      trade.type === 'BUY' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {trade.type}
                    </span>
                    <span className="ml-2 text-sm text-gray-600">{trade.time}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">₩{trade.cost.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{trade.amount.toFixed(8)} BTC</div>
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
