import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCalendarAlt, FaCoins } from "react-icons/fa";

const Header = () => {
  const location = useLocation();

  const navItems = [
    { name: "연차 계산기", path: "/annual-leave", icon: <FaCalendarAlt /> },
    { name: "퇴직금 계산기", path: "/retirement", icon: <FaCoins /> },
  ];

  return (
    <div className="w-full px-6 py-3 flex items-center justify-between bg-transparent absolute top-0 left-0 z-10">
      {/* 로고 */}
      <Link to="/" className="text-xl font-bold text-blue-600 hover:opacity-80 transition">
        e-Work
      </Link>

      {/* 네비게이션 */}
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
