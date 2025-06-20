import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function ChargeAdmin() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("charge_requests")
      .select("no, member_email, amount, status")
      .eq("status", "pending")
      .order("requested_at", { ascending: true });

    if (error) {
      console.error("충전 요청 조회 실패:", error.message);
    } else {
      setRequests(data);
    }
    setLoading(false);
  };

  const approveRequest = async (no, email, amount) => {
    const { data: member, error: memberError } = await supabase
      .from("member")
      .select("cash")
      .eq("email", email)
      .single();

    if (memberError) {
      alert("회원 정보 조회 실패");
      return;
    }

    const newCash = (member.cash || 0) + amount;

    const { error: updateError } = await supabase
      .from("member")
      .update({ cash: newCash })
      .eq("email", email);

    if (updateError) {
      alert("현금 업데이트 실패");
      return;
    }

    const { error: statusError } = await supabase
      .from("charge_requests")
      .update({ status: "approved" })
      .eq("no", no);

    if (statusError) {
      alert("요청 상태 변경 실패");
      return;
    }

    const sessionRes = await supabase.auth.getSession();
    const adminEmail = sessionRes.data.session?.user?.email || "unknown";

    const { error: logError } = await supabase.from("charge_logs").insert({
      email,
      amount,
      approved_by: adminEmail,
    });

    if (logError) {
      console.error("충전 로그 기록 실패:", logError.message);
    }

    alert("승인 완료");
    fetchRequests();
  };

  const rejectRequest = async (no) => {
    const { error } = await supabase
      .from("charge_requests")
      .update({ status: "rejected" })
      .eq("no", no);

    if (error) {
      alert("요청 거절 실패");
    } else {
      alert("요청이 거절되었습니다.");
      fetchRequests();
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">💼 충전 요청 승인</h1>
      {loading ? (
        <p>로딩 중...</p>
      ) : requests.length === 0 ? (
        <p>대기 중인 요청이 없습니다.</p>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">이메일</th>
                <th className="p-2">요청 금액</th>
                <th className="p-2">조치</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.no} className="border-t">
                  <td className="p-2">{req.member_email}</td>
                  <td className="p-2">₩{req.amount.toLocaleString()}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => approveRequest(req.no, req.member_email, req.amount)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      승인
                    </button>
                    <button
                      onClick={() => rejectRequest(req.no)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      거절
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ChargeAdmin;
