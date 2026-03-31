import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Seo from '../../components/Seo';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const STATUS_LABEL = {
  new: { label: '미확인', className: 'bg-amber-50 text-amber-700 border border-amber-200' },
  checked: { label: '확인 완료', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
};

const AdminConsultations = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'new' | 'checked'
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('consultation_requests')
          .select('*')
          .order('created_at', { ascending: false });
        if (fetchError) throw fetchError;
        setRows(data || []);
      } catch (err) {
        setError('상담 내역을 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleStatusToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'new' ? 'checked' : 'new';
    try {
      const { error: updateError } = await supabase
        .from('consultation_requests')
        .update({ status: nextStatus })
        .eq('id', id);
      if (updateError) throw updateError;
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
      );
    } catch (err) {
      alert('상태 변경 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/admin');
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = filter === 'all' ? rows : rows.filter((r) => r.status === filter);
  const newCount = rows.filter((r) => r.status === 'new').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-600">불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Seo title="상담 내역" description="관리자 - 상담 내역" path="/admin/consultations" robots="noindex,nofollow" />

      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white text-sm">
                eW
              </span>
              관리자
            </Link>
            <nav className="flex gap-4">
              <Link to="/admin/guides" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                가이드
              </Link>
              <Link to="/admin/board" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                게시판
              </Link>
              <Link to="/admin/consultations" className="text-sm font-medium text-blue-700 flex items-center gap-1.5">
                상담내역
                {newCount > 0 && (
                  <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {newCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>
          <button onClick={handleLogout} className="text-sm text-slate-600 hover:text-slate-900">
            로그아웃
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* 헤더 영역 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">상담 내역</h1>
            <p className="text-sm text-slate-500 mt-1">
              총 {rows.length}건 · 미확인 {newCount}건
            </p>
          </div>
          {/* 필터 탭 */}
          <div className="flex gap-1 rounded-xl bg-white border border-slate-200 p-1 self-start">
            {[
              { key: 'all', label: '전체' },
              { key: 'new', label: '미확인' },
              { key: 'checked', label: '확인 완료' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                  filter === key
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        {/* 테이블 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-sm">
              {filter === 'all' ? '아직 접수된 상담이 없습니다.' : '해당 상태의 상담이 없습니다.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['접수일', '이름', '연락처', '문의 유형', '문의 내용', '출처 가이드', '상태'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((row) => {
                    const statusInfo = STATUS_LABEL[row.status] || STATUS_LABEL.new;
                    return (
                      <tr key={row.id} className="hover:bg-slate-50 transition">
                        <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">
                          {new Date(row.created_at).toLocaleDateString('ko-KR', {
                            year: '2-digit', month: '2-digit', day: '2-digit',
                          })}
                          <span className="block text-xs text-slate-400">
                            {new Date(row.created_at).toLocaleTimeString('ko-KR', {
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm font-medium text-slate-900 whitespace-nowrap">
                          {row.name}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-700 whitespace-nowrap">
                          {row.contact}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
                          {row.inquiry_type || <span className="text-slate-300">—</span>}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600 max-w-xs">
                          {row.content ? (
                            <p className="line-clamp-2 leading-relaxed">{row.content}</p>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                          {row.source_slug ? (
                            <Link
                              to={`/guides/${row.source_slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {row.source_slug}
                            </Link>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleStatusToggle(row.id, row.status)}
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition hover:opacity-70 ${statusInfo.className}`}
                          >
                            {statusInfo.label}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminConsultations;
