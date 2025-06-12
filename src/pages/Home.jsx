import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>계산기 홈</h1>
      <p>사용할 계산기를 선택하세요:</p>
      <ul style={{ listStyle: "none", fontSize: 20, paddingTop: 20 }}>
        <li><Link to="/annual-leave">✅ 연차 계산기</Link></li>
        <li><Link to="/retirement">💰 퇴직금 계산기</Link></li>
      </ul>
    </div>
  );
}