import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Seo from '../../components/Seo';
import { useAuth } from '../../contexts/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signIn, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // 이미 로그인된 경우 관리자 페이지로 리다이렉트
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/admin/guides', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/admin/guides');
    } catch (signInError) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요.');
      console.error(signInError);
    } finally {
      setLoading(false);
    }
  };

  // 인증 상태 로딩 중
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Seo
        title="관리자 로그인"
        description="e-work.kr 관리자 로그인"
        path="/admin"
        robots="noindex,nofollow"
      />

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white text-sm">
              eW
            </span>
            <h1 className="text-2xl font-semibold text-slate-900">관리자 로그인</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                이메일
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="비밀번호 입력"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-2 px-4 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <p className="mt-6 text-xs text-center text-slate-400">
            관리자 계정만 접근 가능합니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

