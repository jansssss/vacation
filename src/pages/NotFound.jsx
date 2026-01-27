import React from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";

const NotFound = () => {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
      <Seo
        title="페이지를 찾을 수 없습니다"
        description="요청하신 페이지가 없거나 이동되었을 수 있습니다."
        path="/404"
      />
      <h1 className="text-3xl font-semibold text-slate-900">404</h1>
      <p className="mt-2 text-slate-600">
        요청하신 페이지를 찾을 수 없습니다. 주소를 다시 확인해 주세요.
      </p>
      <Link to="/" className="mt-4 inline-block text-emerald-700">
        홈으로 돌아가기
      </Link>
    </div>
  );
};

export default NotFound;

