import React from "react";
import { Link, NavLink } from "react-router-dom";

const navItems = [
  { name: "怨꾩궛湲?, path: "/calculators" },
  { name: "媛?대뱶", path: "/guides" },
  { name: "寃뚯떆??, path: "/board" },
];

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur border-b border-slate-100">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white text-sm">
            eW
          </span>
          e-work.kr
        </Link>
        <nav className="flex items-center gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-3 py-1.5 text-sm font-medium rounded-full transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
