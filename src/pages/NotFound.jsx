import React from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";

const NotFound = () => {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
      <Seo title="??륁뵠筌왖??筌≪뼚??????곷뮸??덈뼄" description="?遺욧퍕????륁뵠筌왖揶쎛 鈺곕똻???? ??녿뮸??덈뼄." path="/404" />
      <h1 className="text-3xl font-semibold text-slate-900">404</h1>
      <p className="mt-2 text-slate-600">?遺욧퍕??뤿뻿 ??륁뵠筌왖揶쎛 鈺곕똻???? ??녿뮸??덈뼄.</p>
      <Link to="/" className="mt-4 inline-block text-emerald-700">
        ??됱몵嚥????툡揶쎛疫?      </Link>
    </div>
  );
};

export default NotFound;
