import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function ChargeAdmin() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("charge_requests")
      .select("*")
      .eq("status", "pending")
      .order("requested_at", { ascending: false });

    if (!error) {
      setRequests(data);
      setLoading(false);
    } else {
      alert("요청 목록을 불러오는 데 실패했습니다.");
    }
  };

  const handleApprove = async (req) => {
    const { data: member, error: memberError } = await supabase
      .from("member")
      .select("cash")
      .eq("email", req.member_email)
      .single();

    if (memberError || !member) {
      alert("회원 정보 조회 실패");
      return;
    }

    const newCash = member.cash + req.amount;

    const { error: updateCashError } = await supabase
      .from("member")
      .update({ cash: newCash })
      .eq("email", req.member_email);

    if (updateCashError) {
      alert("현금 업데이트 실패");
      return;
    }

    const { error: updateStatusError } = await supabase
      .from("charge_requests")
      .update({ status: "approved" })
      .eq("id", req.id);

    if (updateStatusError) {
      alert("상태 변경 실패");
      return;
    }

    alert("충전 승인 완료");
    fetchRequests();
  };

  const handleReject = async (req) => {
    const { error } = await supabase
      .from("charge_requests")
      .update({ status: "rejected" })
      .eq("id", req.id);

    if (error) {
      alert("거절 실패");
    } else {
      alert("거절 처리 완료");
      fetchRequests();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-3xl shadow-xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">💼 충전 요청 관리</h1>

        {loading ? (
          <p className="text-gray-500">불러오는 중...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500">대기 중인 요청이 없습니다.</p>
        ) : (
          <ul className="space-y-4">
            {requests.map((req) => (
              <li key={req.id} className="bg-gray-50 p-4 rounded-xl shadow border">
                <div className="text-sm text-gray-600">👤 {req.member_email}</div>
                <div className="text-lg font-bold text-blue-600">
                  ₩{req.amount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400 mb-2">
                  요청일시: {new Date(req.requested_at).toLocaleString()}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(req)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                  >
                    승인
                  </button>
                  <button
                    onClick={() => handleReject(req)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                  >
                    거절
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ChargeAdmin;
