import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Seo from '../../components/Seo';
import { useAuth } from '../../contexts/AuthContext';
import {
  createBoardPost,
  fetchBoardPostById,
  updateBoardPost,
} from '../../lib/api/board';

const AdminBoardEditor = () => {
  const { id } = useParams();
  const isEdit = useMemo(() => Boolean(id), [id]);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    author: '',
    summary: '',
    content: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPost = async () => {
      if (!isEdit) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const post = await fetchBoardPostById(id);
        if (!post) {
          setError('게시글을 찾을 수 없습니다.');
          return;
        }

        setFormData({
          slug: post.slug ?? '',
          title: post.title ?? '',
          author: post.author ?? '',
          summary: post.summary ?? '',
          content: post.content ?? '',
        });
      } catch (loadError) {
        setError('게시글 정보를 불러오는 중 오류가 발생했습니다.');
        console.error(loadError);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, isEdit]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/admin');
    } catch (logoutError) {
      console.error(logoutError);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (isEdit) {
        await updateBoardPost(id, formData);
      } else {
        await createBoardPost(formData);
      }
      navigate('/admin/board');
    } catch (saveError) {
      setError('저장 중 오류가 발생했습니다. 슬러그 중복 여부를 확인해 주세요.');
      console.error(saveError);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-600">불러오는 중...</div>
      </div>
    );
  }

  const titleText = isEdit ? '게시글 수정' : '새 게시글 추가';
  const seoTitle = isEdit ? '게시글 수정' : '게시글 작성';

  return (
    <div className="min-h-screen bg-slate-50">
      <Seo title={seoTitle} description={`관리자 - ${titleText}`} path={isEdit ? `/admin/board/edit/${id}` : '/admin/board/new'} />

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
              <Link to="/admin/board" className="text-sm font-medium text-emerald-700">
                게시판
              </Link>
            </nav>
          </div>
          <button onClick={handleLogout} className="text-sm text-slate-600 hover:text-slate-900">
            로그아웃
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">{titleText}</h1>
          <Link to="/admin/board" className="text-sm text-slate-600 hover:text-slate-900">
            목록으로
          </Link>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-600 bg-red-50 p-4 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="post-slug" className="block text-sm font-medium text-slate-700 mb-2">
                  슬러그
                </label>
                <input
                  id="post-slug"
                  value={formData.slug}
                  onChange={(event) => handleChange('slug', event.target.value)}
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="labor-law-update-2026"
                />
              </div>
              <div>
                <label htmlFor="post-author" className="block text-sm font-medium text-slate-700 mb-2">
                  작성자
                </label>
                <input
                  id="post-author"
                  value={formData.author}
                  onChange={(event) => handleChange('author', event.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="관리자"
                />
              </div>
            </div>

            <div>
              <label htmlFor="post-title" className="block text-sm font-medium text-slate-700 mb-2">
                제목
              </label>
              <input
                id="post-title"
                value={formData.title}
                onChange={(event) => handleChange('title', event.target.value)}
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="2026년 근로기준법 주요 변경사항"
              />
            </div>

            <div>
              <label htmlFor="post-summary" className="block text-sm font-medium text-slate-700 mb-2">
                요약
              </label>
              <textarea
                id="post-summary"
                value={formData.summary}
                onChange={(event) => handleChange('summary', event.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="게시글의 핵심 내용을 간단히 정리하세요."
              />
            </div>

            <div>
              <label htmlFor="post-content" className="block text-sm font-medium text-slate-700 mb-2">
                본문
              </label>
              <textarea
                id="post-content"
                value={formData.content}
                onChange={(event) => handleChange('content', event.target.value)}
                rows={12}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 whitespace-pre-line"
                placeholder="본문 내용을 입력하세요."
              />
            </div>
          </section>

          <div className="flex items-center justify-end gap-3">
            <Link to="/admin/board" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900">
              취소
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminBoardEditor;

