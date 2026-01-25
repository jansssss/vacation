import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
