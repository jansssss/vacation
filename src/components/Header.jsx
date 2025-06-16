import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCalendarAlt, FaCoins, FaWallet, FaChartBar } from "react-icons/fa"; // ✅ 모든 아이콘 한번에 정리

const Header = () => {
  const location = useLocation();

  const navItems = [
  
  //  { name: "연차 계산기", path: "/annual-leave", icon: <FaCalendarAlt /> },
  //  { name: "퇴직금 계산기", path: "/retirement", icon: <FaCoins /> },
   // { name: "실수령액 계산기", path: "/salary", icon: <FaWallet /> },
  //  { name: "내 연봉 순위", path: "/salary-rank", icon: <FaChartBar /> } // ✅ 새 항목
  
  ];

  return (
    <div className="w-full px-6 py-3 flex items-center justify-between bg-transparent absolute top-0 left-0 z-10">
      <Link to="/" className="text-xl font-bold text-blue-600 hover:opacity-80 transition">
        e-Work
      </Link>

      <nav className="flex gap-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium transition 
              ${
                location.pathname === item.path
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Header;
