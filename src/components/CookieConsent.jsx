import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CONSENT_KEY = "ework-consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const handleConsent = (value) => {
    localStorage.setItem(CONSENT_KEY, value ? "granted" : "denied");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-4 shadow-lg md:flex md:items-center md:justify-between md:gap-4">
      <div className="text-sm text-slate-600">
        蹂??ъ씠?몃뒗 ?쒕퉬???덉쭏 媛쒖꽑 諛?愿묎퀬 ?댁쁺???꾪빐 荑좏궎/?앸퀎?먮? ?ъ슜?????덉뒿?덈떎.
        ?먯꽭???댁슜?{" "}
        <Link to="/privacy" className="font-medium text-emerald-700 hover:text-emerald-900">
          媛쒖씤?뺣낫泥섎━諛⑹묠
        </Link>
        ?먯꽌 ?뺤씤?섏꽭??
      </div>
      <div className="mt-3 flex gap-2 md:mt-0">
        <button
          type="button"
          onClick={() => handleConsent(false)}
          className="rounded-full border border-slate-200 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50"
        >
          嫄곕?
        </button>
        <button
          type="button"
          onClick={() => handleConsent(true)}
          className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
        >
          ?숈쓽
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
