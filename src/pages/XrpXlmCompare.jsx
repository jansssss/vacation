import React, { useState, useEffect } from 'react';

const XrpXlmCompare = () => {
  const [xrpData, setXrpData] = useState(null);
  const [xlmData, setXlmData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ripple,stellar&vs_currencies=usd&include_24hr_change=true&include_market_cap=true'
      );
      
      if (!response.ok) {
        throw new Error('네트워크 응답이 올바르지 않습니다');
      }
      
      const data = await response.json();
      
      setXrpData({
        price: data.ripple.usd,
        change: data.ripple.usd_24h_change,
        marketCap: data.ripple.usd_market_cap
      });
      
      setXlmData({
        price: data.stellar.usd,
        change: data.stellar.usd_24h_change,
        marketCap: data.stellar.usd_market_cap
      });
      
      setLastUpdate(new Date());
      setLoading(false);
      
    } catch (error) {
      console.error('가격 정보를 가져오는 중 오류가 발생했습니다:', error);
      setError('가격 정보를 가져올 수 없습니다. 잠시 후 다시 시도해주세요.');
      setLoading(false);
    }
  };

  const formatMarketCap = (value) => {
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(1)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`;
    } else {
      return `$${(value / 1e3).toFixed(1)}K`;
    }
  };

  useEffect(() => {
    fetchPrices();
    // 30초마다 자동 업데이트
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !xrpData && !xlmData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600 flex items-center justify-center">
        <div className="text-white text-xl">데이터를 불러오는 중...</div>
      </div>
    );
  }

  const ratio = xrpData && xlmData ? xrpData.price / xlmData.price : 0;
  const priceDiff = xrpData && xlmData ? xrpData.price - xlmData.price : 0;
  const percentageDiff = xrpData && xlmData ? ((xrpData.price - xlmData.price) / xlmData.price * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            💱 XRP-XLM 비교
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            실시간 리플과 스텔라 가격차 분석
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {/* 메인 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* XRP 카드 */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                XRP
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Ripple</h2>
                <p className="text-gray-600">XRP</p>
              </div>
            </div>
            
            <div className="text-3xl font-bold text-gray-800 mb-3">
              {xrpData ? `$${xrpData.price.toFixed(4)}` : '로딩 중...'}
            </div>
            
            {xrpData && (
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                xrpData.change >= 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {xrpData.change >= 0 ? '+' : ''}{xrpData.change.toFixed(2)}%
              </div>
            )}
          </div>

          {/* XLM 카드 */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                XLM
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Stellar</h2>
                <p className="text-gray-600">XLM</p>
              </div>
            </div>
            
            <div className="text-3xl font-bold text-gray-800 mb-3">
              {xlmData ? `$${xlmData.price.toFixed(4)}` : '로딩 중...'}
            </div>
            
            {xlmData && (
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                xlmData.change >= 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {xlmData.change >= 0 ? '+' : ''}{xlmData.change.toFixed(2)}%
              </div>
            )}
          </div>
        </div>

        {/* 비교 분석 카드 */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            📊 가격 비교 분석
          </h3>
          
          {/* 배율 표시 */}
          <div className="flex items-center justify-center mb-8">
            <span className="text-lg text-gray-600 mr-4">XRP가 XLM보다</span>
            <span className="text-4xl font-bold text-purple-600 mx-4">
              {ratio.toFixed(2)}
            </span>
            <span className="text-lg text-gray-600 ml-4">배 비쌈</span>
          </div>

          {/* 통계 그리드 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-sm text-gray-600 mb-2">가격 차이</div>
              <div className="text-xl font-bold text-gray-800">
                ${priceDiff.toFixed(4)}
              </div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-sm text-gray-600 mb-2">백분율 차이</div>
              <div className="text-xl font-bold text-gray-800">
                {percentageDiff.toFixed(1)}%
              </div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-sm text-gray-600 mb-2">XRP 시가총액</div>
              <div className="text-xl font-bold text-gray-800">
                {xrpData ? formatMarketCap(xrpData.marketCap) : '-'}
              </div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-sm text-gray-600 mb-2">XLM 시가총액</div>
              <div className="text-xl font-bold text-gray-800">
                {xlmData ? formatMarketCap(xlmData.marketCap) : '-'}
              </div>
            </div>
          </div>

          {/* 새로고침 버튼 */}
          <div className="text-center">
            <button
              onClick={fetchPrices}
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '업데이트 중...' : '🔄 새로고침'}
            </button>
            
            {lastUpdate && (
              <div className="text-sm text-gray-500 mt-3">
                마지막 업데이트: {lastUpdate.toLocaleString('ko-KR')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default XrpXlmCompare;
