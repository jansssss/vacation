import React from "react";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav className="mb-6 text-xs text-slate-500" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={item.path} className="flex items-center gap-2">
            {index !== 0 && <span className="text-slate-300">/</span>}
            <Link to={item.path} className="hover:text-slate-700">
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
