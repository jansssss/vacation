import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Seo from '../../components/Seo';
import { useAuth } from '../../contexts/AuthContext';
import { deleteBoardPost, fetchBoardPosts } from '../../lib/api/board';

const AdminBoard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const data = await fetchBoardPosts();
        setPosts(data);
      } catch (loadError) {
        setError('게시글 목록을 불러오는 중 오류가 발생했습니다.');
        console.error(loadError);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`"${title}" 게시글을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteBoardPost(id);
      setPosts((prev) => prev.filter((post) => post.id !== id));
      window.alert('게시글을 삭제했습니다.');
    } catch (deleteError) {
      window.alert('삭제 중 오류가 발생했습니다.');
      console.error(deleteError);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/admin');
    } catch (logoutError) {
      console.error(logoutError);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-600">불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Seo title="게시판 관리" description="관리자 - 게시판 관리" path="/admin/board" robots="noindex,nofollow" />

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
              <Link to="/admin/board" className="text-sm font-medium text-blue-700">
                게시판
              </Link>
            </nav>
          </div>
          <button onClick={handleLogout} className="text-sm text-slate-600 hover:text-slate-900">
            로그아웃
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">게시판 관리</h1>
          <Link
            to="/admin/board/new"
            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800"
          >
            새 게시글 추가
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
                  작성자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  작성일
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">{post.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{post.summary}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{post.author}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(post.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <Link
                      to={`/board/${post.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-700 hover:text-blue-900 mr-4"
                    >
                      보기
                    </Link>
                    <Link
                      to={`/admin/board/edit/${post.id}`}
                      className="text-blue-700 hover:text-blue-900 mr-4"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      className="text-red-700 hover:text-red-900"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {posts.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              게시글이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBoard;

