import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import CookieConsent from "./CookieConsent";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-slate-900">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">{children}</main>
      <CookieConsent />
      <Footer />
    </div>
  );
};

export default Layout;
