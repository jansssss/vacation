import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { fetchGuides, deleteGuide } from '../../lib/api/guides';
import Seo from '../../components/Seo';

const AdminGuides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { signOut } = useAuth();

  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    try {
      setLoading(true);
      const data = await fetchGuides();
      setGuides(data);
    } catch (err) {
      setError('가이드 목록을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`"${title}" 가이드를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteGuide(id);
      setGuides(guides.filter(g => g.id !== id));
      alert('가이드가 삭제되었습니다.');
    } catch (err) {
      alert('삭제에 실패했습니다.');
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Seo title="가이드 관리" description="관리자 - 가이드 관리" path="/admin/guides" />

      {/* Header */}
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
              <Link to="/admin/guides" className="text-sm font-medium text-emerald-700">
                가이드
              </Link>
              <Link to="/admin/board" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                게시판
              </Link>
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">가이드 관리</h1>
          <Link
            to="/admin/guides/new"
            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800"
          >
            새 가이드 추가
          </Link>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-600 bg-red-50 p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  제목
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  업데이트
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {guides.map((guide) => (
                <tr key={guide.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">{guide.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{guide.summary}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {guide.slug}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(guide.updated_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <Link
                      to={`/guides/${guide.slug}`}
                      target="_blank"
                      className="text-emerald-700 hover:text-emerald-900 mr-4"
                    >
                      보기
                    </Link>
                    <Link
                      to={`/admin/guides/edit/${guide.id}`}
                      className="text-blue-700 hover:text-blue-900 mr-4"
                    >
                      편집
                    </Link>
                    <button
                      onClick={() => handleDelete(guide.id, guide.title)}
                      className="text-red-700 hover:text-red-900"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {guides.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              가이드가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminGuides;
