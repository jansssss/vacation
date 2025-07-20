import React, { useState, useEffect } from 'react';
import { FaBell, FaBellSlash, FaCog, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const XrpXlmCompare = () => {
  const [xrpData, setXrpData] = useState(null);
  const [xlmData, setXlmData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  // 알림 관련 상태
  const [alertSettings, setAlertSettings] = useState({
    enabled: false,
    minRatio: 2.0,
    maxRatio: 5.0,
    notificationPermission: 'default'
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [alertHistory, setAlertHistory] = useState([]);

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
      
      const newXrpData = {
        price: data.ripple.usd,
        change: data.ripple.usd_24h_change,
        marketCap: data.ripple.usd_market_cap
      };
      
      const newXlmData = {
        price: data.stellar.usd,
        change: data.stellar.usd_24h_change,
        marketCap: data.stellar.usd_market_cap
      };
      
      setXrpData(newXrpData);
      setXlmData(newXlmData);
      
      // 알림 체크
      if (newXrpData && newXlmData) {
        checkAndTriggerAlert(newXrpData.price / newXlmData.price);
      }
      
      setLastUpdate(new Date());
      setLoading(false);
      
    } catch (error) {
      console.error('가격 정보를 가져오는 중 오류가 발생했습니다:', error);
      setError('가격 정보를 가져올 수 없습니다. 잠시 후 다시 시도해주세요.');
      setLoading(false);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setAlertSettings(prev => ({
        ...prev,
        notificationPermission: permission
      }));
      return permission;
    }
    return 'denied';
  };

  const checkAndTriggerAlert = (currentRatio) => {
    if (!alertSettings.enabled || alertSettings.notificationPermission !== 'granted') {
      return;
    }

    const shouldAlert = currentRatio <= alertSettings.minRatio || currentRatio >= alertSettings.maxRatio;
    
    if (shouldAlert) {
      // 중복 알림 방지 (마지막 알림에서 5분 이상 경과했을 때만)
      const now = new Date();
      const lastAlert = alertHistory[alertHistory.length - 1];
      
      if (!lastAlert || (now - new Date(lastAlert.time)) > 5 * 60 * 1000) {
        const alertType = currentRatio <= alertSettings.minRatio ? 'LOW' : 'HIGH';
        const message = alertType === 'LOW' 
          ? `XRP/XLM 배율이 ${currentRatio.toFixed(2)}배로 낮아졌습니다!`
          : `XRP/XLM 배율이 ${currentRatio.toFixed(2)}배로 높아졌습니다!`;

        // 브라우저 알림
        new Notification('XRP-XLM 가격 알림', {
          body: message,
          icon: '💱',
          tag: 'xrp-xlm-alert'
        });

        // 알림 히스토리 추가
        const newAlert = {
          id: Date.now(),
          type: alertType,
          ratio: currentRatio,
          message,
          time: now.toISOString()
        };
        
        setAlertHistory(prev => [...prev.slice(-9), newAlert]); // 최근 10개만 유지
      }
    }
  };

  const toggleAlert = async () => {
    if (!alertSettings.enabled) {
      const permission = await requestNotificationPermission();
      if (permission === 'granted') {
        setAlertSettings(prev => ({ ...prev, enabled: true }));
      } else {
        alert('알림 기능을 사용하려면 브라우저에서 알림 권한을 허용해주세요.');
      }
    } else {
      setAlertSettings(prev => ({ ...prev, enabled: false }));
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

  // 브라우저 알림 권한 확인
  useEffect(() => {
    if ('Notification' in window) {
      setAlertSettings(prev => ({
        ...prev,
        notificationPermission: Notification.permission
      }));
    }
  }, []);

  if (loading && !xrpData && !xlmData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600 flex items-center justify-center px-4">
        <div className="text-white text-lg text-center">데이터를 불러오는 중...</div>
      </div>
    );
  }

  const ratio = xrpData && xlmData ? xrpData.price / xlmData.price : 0;
  const priceDiff = xrpData && xlmData ? xrpData.price - xlmData.price : 0;
  const percentageDiff = xrpData && xlmData ? ((xrpData.price - xlmData.price) / xlmData.price * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600 py-4 px-3 sm:py-8 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 - 모바일 최적화 */}
        <div className="text-center text-white mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 drop-shadow-lg leading-tight">
            💱 XRP-XLM 비교
          </h1>
          <p className="text-sm sm:text-lg md:text-xl opacity-90 px-2">
            실시간 리플과 스텔라 가격차 분석
          </p>
        </div>

        {/* 알림 설정 바 - 모바일 최적화 */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 shadow-xl">
          {/* 상단 버튼들 */}
          <div className="flex items-center justify-between mb-3 sm:mb-0">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={toggleAlert}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all text-xs sm:text-sm ${
                  alertSettings.enabled
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {alertSettings.enabled ? <FaBell className="text-xs sm:text-sm" /> : <FaBellSlash className="text-xs sm:text-sm" />}
                <span className="hidden xs:inline">{alertSettings.enabled ? '알림 ON' : '알림 OFF'}</span>
                <span className="xs:hidden">{alertSettings.enabled ? 'ON' : 'OFF'}</span>
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 font-semibold transition-all text-xs sm:text-sm"
              >
                <FaCog className="text-xs sm:text-sm" />
                <span className="hidden xs:inline">설정</span>
                {showSettings ? <FaChevronUp className="xs:hidden text-xs" /> : <FaChevronDown className="xs:hidden text-xs" />}
              </button>
            </div>

            {alertHistory.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-xs sm:text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                알림 {alertHistory.length}건 {showHistory ? '▲' : '▼'}
              </button>
            )}
          </div>

          {/* 알림 범위 표시 - 모바일에서는 작게 */}
          {alertSettings.enabled && !showSettings && (
            <div className="text-xs sm:text-sm text-gray-600 text-center py-2 border-t border-gray-200">
              알림: {alertSettings.minRatio}배 이하 또는 {alertSettings.maxRatio}배 이상
            </div>
          )}

          {/* 알림 설정 패널 */}
          {showSettings && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg border-t border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">알림 설정</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    최소 배율 (이하일 때 알림)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={alertSettings.minRatio}
                    onChange={(e) => setAlertSettings(prev => ({
                      ...prev,
                      minRatio: parseFloat(e.target.value) || 0
                    }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    최대 배율 (이상일 때 알림)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={alertSettings.maxRatio}
                    onChange={(e) => setAlertSettings(prev => ({
                      ...prev,
                      maxRatio: parseFloat(e.target.value) || 0
                    }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {alertSettings.notificationPermission !== 'granted' && (
                <div className="mt-3 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-xs sm:text-sm">
                  💡 브라우저 알림을 받으려면 알림 권한을 허용해주세요.
                </div>
              )}
            </div>
          )}

          {/* 알림 히스토리 - 모바일 최적화 */}
          {showHistory && alertHistory.length > 0 && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg border-t border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">최근 알림</h4>
              <div className="space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
                {alertHistory.slice().reverse().map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between text-xs sm:text-sm bg-white p-2 rounded">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      alert.type === 'LOW' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {alert.type === 'LOW' ? '낮음' : '높음'}
                    </span>
                    <span className="text-gray-700 font-medium">{alert.ratio.toFixed(2)}배</span>
                    <span className="text-gray-500 text-xs">
                      {new Date(alert.time).toLocaleTimeString('ko-KR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 sm:mb-6 text-center text-sm">
            {error}
          </div>
        )}

        {/* 메인 그리드 - 모바일에서는 세로 배열 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* XRP 카드 */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg mr-3 sm:mr-4">
                XRP
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Ripple</h2>
                <p className="text-sm sm:text-base text-gray-600">XRP</p>
              </div>
            </div>
            
            <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
              {xrpData ? `$${xrpData.price.toFixed(4)}` : '로딩 중...'}
            </div>
            
            {xrpData && (
              <div className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                xrpData.change >= 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {xrpData.change >= 0 ? '+' : ''}{xrpData.change.toFixed(2)}%
              </div>
            )}
          </div>

          {/* XLM 카드 */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg mr-3 sm:mr-4">
                XLM
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Stellar</h2>
                <p className="text-sm sm:text-base text-gray-600">XLM</p>
              </div>
            </div>
            
            <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
              {xlmData ? `$${xlmData.price.toFixed(4)}` : '로딩 중...'}
            </div>
            
            {xlmData && (
              <div className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                xlmData.change >= 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {xlmData.change >= 0 ? '+' : ''}{xlmData.change.toFixed(2)}%
              </div>
            )}
          </div>
        </div>

        {/* 비교 분석 카드 - 모바일 최적화 */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-xl">
          <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
            📊 가격 비교 분석
          </h3>
          
          {/* 배율 표시 - 모바일에서 작게 */}
          <div className="flex items-center justify-center mb-6 sm:mb-8 flex-wrap">
            <span className="text-sm sm:text-lg text-gray-600 mr-2 sm:mr-4">XRP가 XLM보다</span>
            <span className={`text-2xl sm:text-4xl font-bold mx-2 sm:mx-4 ${
              alertSettings.enabled && (ratio <= alertSettings.minRatio || ratio >= alertSettings.maxRatio)
                ? 'text-red-600 animate-pulse'
                : 'text-purple-600'
            }`}>
              {ratio.toFixed(2)}
            </span>
            <span className="text-sm sm:text-lg text-gray-600 ml-2 sm:ml-4">배 비쌈</span>
          </div>

          {/* 통계 그리드 - 모바일에서는 2x2 배열 */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 mb-4 sm:mb-6">
            <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg sm:rounded-xl">
              <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">가격 차이</div>
              <div className="text-sm sm:text-xl font-bold text-gray-800">
                ${priceDiff.toFixed(4)}
              </div>
            </div>
            
            <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg sm:rounded-xl">
              <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">백분율 차이</div>
              <div className="text-sm sm:text-xl font-bold text-gray-800">
                {percentageDiff.toFixed(1)}%
              </div>
            </div>
            
            <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg sm:rounded-xl">
              <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">XRP 시총</div>
              <div className="text-sm sm:text-xl font-bold text-gray-800">
                {xrpData ? formatMarketCap(xrpData.marketCap) : '-'}
              </div>
            </div>
            
            <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg sm:rounded-xl">
              <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">XLM 시총</div>
              <div className="text-sm sm:text-xl font-bold text-gray-800">
                {xlmData ? formatMarketCap(xlmData.marketCap) : '-'}
              </div>
            </div>
          </div>

          {/* 새로고침 버튼 - 모바일에서 더 큰 터치 영역 */}
          <div className="text-center">
            <button
              onClick={fetchPrices}
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[48px] min-w-[120px]"
            >
              {loading ? '업데이트 중...' : '🔄 새로고침'}
            </button>
            
            {lastUpdate && (
              <div className="text-xs sm:text-sm text-gray-500 mt-3">
                마지막 업데이트: {lastUpdate.toLocaleString('ko-KR', {
                  month: 'short',
                  day: 'numeric', 
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default XrpXlmCompare;
