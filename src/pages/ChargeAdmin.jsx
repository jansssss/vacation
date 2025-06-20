import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function ChargeAdmin() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("charge_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (error) console.error("요청 불러오기 실패:", error.message);
    else setRequests(data);
  };

  const approveRequest = async (request) => {
    // 1. 사용자 자산 조회
    const { data: userData, error: userError } = await supabase
      .from("member")
      .select("cash")
      .eq("email", request.email)
      .single();

    if (userError) {
      alert("회원 정보 조회 실패");
      return;
    }

    // 2. 자산 업데이트
    const newCash = userData.cash + request.amount;

    const { error: updateError } = await supabase
      .from("member")
      .update({ cash: newCash })
      .eq("email", request.email);

    if (updateError) {
      alert("자산 반영 실패");
      return;
    }

    // 3. 충전 상태 'approved' 처리
    await supabase
      .from("charge_requests")
      .update({ status: "approved" })
      .eq("id", request.id);

    alert("충전 승인 완료");
    fetchRequests();
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">💼 충전 요청 승인 (관리자)</h1>
      {requests.length === 0 ? (
        <p className="text-gray-500">대기 중인 요청이 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {requests.map((req) => (
            <li key={req.id} className="p-4 bg-gray-100 rounded flex justify-between items-center">
              <div>
                <div className="text-sm font-semibold">{req.email}</div>
                <div className="text-sm">요청 금액: ₩{req.amount.toLocaleString()}</div>
                <div className="text-xs text-gray-500">{new Date(req.created_at).toLocaleString()}</div>
              </div>
              <button
                onClick={() => approveRequest(req)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
              >
                승인
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ChargeAdmin;
