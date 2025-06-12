import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div style={{ background: "#f3f3f3", padding: "16px", textAlign: "center" }}>
      <Link to="/annual-leave" style={{ margin: "0 20px" }}>✅ 연차 계산기</Link>
      <Link to="/retirement" style={{ margin: "0 20px" }}>💰 퇴직금 계산기</Link>
    </div>
  );
}
