import React, { useState } from "react";

// 연차법 완전 반영 (1년 미만: 입사년 12월까지, 2년차: 익년 1월~만1년월+15, 이후 3년차~)
function calculateAnnualLeaveByYears(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (endDate < startDate) {
    return {
      years: [],
      detail: [],
      total: 0,
      msg: "종료일이 입사일보다 빠릅니다"
    };
  }

  let years = [];
  let detail = [];
  let total = 0;

  // 1년 미만: 입사월+1달 만근부터 12월까지 월 1개씩
  let pointer = new Date(startDate);
  let firstYear = startDate.getFullYear();
  let firstYearEnd = new Date(firstYear, 11, 31); // 그해 12월 31일까지
  let first = 0;
  pointer.setMonth(pointer.getMonth() + 1);
  while (pointer <= firstYearEnd && pointer <= endDate) {
    first++;
    pointer.setMonth(pointer.getMonth() + 1);
  }
  if (first > 0) {
    years.push("1년차");
    detail.push(first);
    total += first;
  }

  // 2년차: 익년 1월~만 1년되는 달까지 월 1개씩, 만 1년 되는 달에 15개 더함
  let anniv = new Date(startDate);
  anniv.setFullYear(anniv.getFullYear() + 1);
  let secondYearStart = new Date(firstYear + 1, 0, 1); // 익년 1월 1일
  let second = 0;
  let y = secondYearStart.getFullYear();
  if (endDate >= secondYearStart) {
    let pointer2 = new Date(secondYearStart);
    while (
      (pointer2.getFullYear() < anniv.getFullYear() ||
        (pointer2.getFullYear() === anniv.getFullYear() &&
          pointer2.getMonth() < anniv.getMonth())) &&
      pointer2 <= endDate
    ) {
      second++;
      pointer2.setMonth(pointer2.getMonth() + 1);
    }
    // 만 1년 도달 달에 15개 추가(도달했다면)
    if (endDate >= anniv) {
      second += 15;
    }
    years.push("2년차");
    detail.push(second);
    total += second;
  }

  // 3년차~: 3년차 16개, 이후 2년에 1개씩 증가, 연도별 부여
  let currAnniv = new Date(anniv);
  currAnniv.setFullYear(currAnniv.getFullYear() + 1);
  let careerYear = 3;
  while (currAnniv <= endDate) {
    let count = 15 + Math.floor((careerYear - 2) / 2);
    if (careerYear === 3) count = 16; // 3년차만 16개
    // 퇴사일이 근속연차 도달 전이면 0으로
    if (
      currAnniv.getFullYear() > endDate.getFullYear() ||
      (currAnniv.getFullYear() === endDate.getFullYear() &&
        currAnniv.getMonth() > endDate.getMonth())
    ) {
      years.push(`${careerYear}년차`);
      detail.push(0);
    } else {
      years.push(`${careerYear}년차`);
      detail.push(count);
      total += count;
    }
    currAnniv.setFullYear(currAnniv.getFullYear() + 1);
    careerYear++;
  }

  return {
    years,
    detail,
    total,
    msg: null
  };
}

function AnnualLeaveCalculator() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = () => {
    if (!startDate || !endDate) {
      alert("입사일과 퇴직일을 모두 입력하세요.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setResult(calculateAnnualLeaveByYears(startDate, endDate));
      setLoading(false);
    }, 1400);
  };

  // 초기화
  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setResult(null);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f6fa", paddingTop: 32 }}>
      <div
        style={{
          margin: "auto",
          maxWidth: 820,
          background: "#fff",
          borderRadius: 28,
          boxShadow: "0 8px 24px #0002",
          padding: 36,
        }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 26 }}>
          연차휴가 계산기
        </h1>
        <table style={{ width: "100%", marginBottom: 16, background: "#f8fafb", borderRadius: 10 }}>
          <thead>
            <tr>
              <th style={{ width: "30%", padding: 10, fontWeight: 600, background: "#f5f7fa" }}>입사일</th>
              <th style={{ width: "30%", padding: 10, fontWeight: 600, background: "#f5f7fa" }}>퇴직일</th>
              <th style={{ padding: 10, fontWeight: 600, background: "#f5f7fa" }}>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ textAlign: "center" }}>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #ccd",
                    width: "80%",
                    fontSize: 16,
                    textAlign: "center",
                  }}
                />
              </td>
              <td style={{ textAlign: "center" }}>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #ccd",
                    width: "80%",
                    fontSize: 16,
                    textAlign: "center",
                  }}
                />
              </td>
              <td style={{ fontSize: 14, color: "#334", background: "#f8fafc" }}>
                - 입사일과 퇴직일 입력 후 계산을 누르면 근속연차별 연차 개수를 확인할 수 있습니다.<br />
                - 퇴직일은 마지막 근무일 <b>다음날</b>을 입력하세요.
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ textAlign: "center", margin: "16px 0", display: "flex", justifyContent: "center", gap: 10 }}>
          <button
            onClick={handleReset}
            style={{
              padding: "12px 36px",
              borderRadius: 12,
              background: "#e5e7eb",
              color: "#222",
              fontWeight: 600,
              fontSize: 18,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 1px 3px #0001",
              marginRight: 8
            }}
          >
            초기화
          </button>
          <button
            onClick={handleCalculate}
            style={{
              padding: "12px 44px",
              borderRadius: 12,
              background: "#6366f1",
              color: "#fff",
              fontWeight: 700,
              fontSize: 19,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 1px 3px #0002",
            }}
          >
            계산
          </button>
        </div>
        {loading && (
          <div style={{ textAlign: "center", margin: "34px 0 24px", height: 150 }}>
            <div style={{
              position: "relative",
              width: 260,
              height: 110,
              margin: "0 auto"
            }}>
              {/* 구름 */}
              <div style={{
                position: "absolute", left: 32, top: 54, width: 38, height: 22,
                background: "#e0e7ff", borderRadius: 20, opacity: 0.7, filter: "blur(1px)"
              }} />
              <div style={{
                position: "absolute", left: 110, top: 68, width: 46, height: 25,
                background: "#e0e7ff", borderRadius: 30, opacity: 0.5, filter: "blur(2px)"
              }} />
              {/* 비행기+사람 */}
              <div style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 60,
                height: 60,
                animation: "plane-move 1.6s linear infinite"
              }}>
                {/* 비행기(간단 도형) */}
                <svg width="60" height="60" style={{ display: "block" }}>
                  <rect x="14" y="28" width="28" height="10" rx="5" fill="#3b82f6" />
                  <rect x="10" y="32" width="8" height="4" rx="2" fill="#6366f1" />
                  <rect x="20" y="25" width="18" height="4" rx="2" fill="#60a5fa" />
                  <circle cx="37" cy="33" r="2.5" fill="#fff" />
                  <circle cx="43" cy="33" r="2.5" fill="#fff" />
                </svg>
                {/* 사람(원형 얼굴, 선글라스, 모자) */}
                <div style={{
                  position: "absolute", left: 38, top: 20, width: 17, height: 17
                }}>
                  <div style={{
                    width: 15, height: 15, borderRadius: "50%",
                    background: "#fee2a9", border: "2px solid #fff",
                    position: "absolute", top: 2, left: 0
                  }} />
                  <div style={{
                    position: "absolute", top: 8, left: 2, width: 10, height: 4,
                    background: "#1e293b", borderRadius: 5
                  }} />
                  {/* 모자 */}
                  <div style={{
                    position: "absolute", top: -2, left: 2, width: 11, height: 7,
                    background: "#34d399", borderRadius: "8px 8px 8px 8px"
                  }} />
                </div>
              </div>
              <style>{`
                @keyframes plane-move {
                  0% { left: 0; top: 0; }
                  60% { left: 170px; top: 22px; }
                  100% { left: 0; top: 0; }
                }
              `}</style>
            </div>
            <div style={{ marginTop: 18, color: "#6366f1", fontWeight: 600, fontSize: 18 }}>
              여행 준비 중...
            </div>
          </div>
        )}
        {result && !loading && (
          <div style={{ marginTop: 28 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10, background: "#f6faff" }}>
              <thead>
                <tr>
                  <th style={{ padding: 14, background: "#e8ebff", fontWeight: 600, fontSize: 18, borderRadius: 10 }}>연차 총합</th>
                  {result.years.map((y, i) => (
                    <th key={i} style={{ padding: 14, background: "#e8ebff", fontWeight: 600, fontSize: 18, borderRadius: 10 }}>
                      {y}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{
                    background: "#fff",
                    color: "#3b82f6",
                    fontWeight: 700,
                    fontSize: 22,
                    textAlign: "center"
                  }}>{result.total}</td>
                  {result.detail.map((c, i) => (
                    <td key={i}
                      style={{
                        background: "#fff",
                        color: "#6366f1",
                        fontWeight: 700,
                        fontSize: 20,
                        textAlign: "center"
                      }}>{c}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {result && !loading && result.msg && (
          <div style={{ color: "#e11d48", marginTop: 10, fontWeight: 600 }}>{result.msg}</div>
        )}
      </div>
    </div>
  );
}

export default AnnualLeaveCalculator;