import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Seo from '../../components/Seo';
import RichTextEditor from '../../components/RichTextEditor';
import { useAuth } from '../../contexts/AuthContext';
import { createGuide, fetchGuideById, updateGuide } from '../../lib/api/guides';

const createEmptySection = () => ({
  html_content: '',
});

const slugify = (value) =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const hasHtml = (value) => /<\/?[a-z][\s\S]*>/i.test(value ?? '');

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const textToHtml = (value) => {
  if (!value) return '';
  if (hasHtml(value)) return value;

  const paragraphs = value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br />')}</p>`);

  return paragraphs.join('');
};

const ensureHtml = (value) => textToHtml(value ?? '');

const AdminGuideEditor = () => {
  const { id } = useParams();
  const isEdit = useMemo(() => Boolean(id), [id]);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const [guideData, setGuideData] = useState({
    slug: '',
    title: '',
    summary: '',
    keywords: '',
  });
  const [slugTouched, setSlugTouched] = useState(false);
  const [sections, setSections] = useState([createEmptySection()]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadGuide = async () => {
      if (!isEdit) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const guide = await fetchGuideById(id);
        if (!guide) {
          setError('가이드를 찾을 수 없습니다.');
          return;
        }

        setGuideData({
          slug: guide.slug ?? '',
          title: guide.title ?? '',
          summary: guide.summary ?? '',
          keywords: guide.keywords ?? '',
        });
        setSlugTouched(true);

        if (guide.sections && guide.sections.length > 0) {
          setSections(
            guide.sections.map((section) => ({
              html_content: ensureHtml(section.html_content),
            })),
          );
        } else {
          setSections([createEmptySection()]);
        }
      } catch (loadError) {
        setError('가이드 정보를 불러오는 중 오류가 발생했습니다.');
        console.error(loadError);
      } finally {
        setLoading(false);
      }
    };

    loadGuide();
  }, [id, isEdit]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/admin');
    } catch (logoutError) {
      console.error(logoutError);
    }
  };

  const handleTitleChange = (value) => {
    setGuideData((prev) => {
      const next = { ...prev, title: value };
      if (!slugTouched) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const handleSlugChange = (value) => {
    setSlugTouched(true);
    setGuideData((prev) => ({
      ...prev,
      slug: value,
    }));
  };

  const handleGuideChange = (field, value) => {
    setGuideData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSectionChange = (index, field, value) => {
    setSections((prev) =>
      prev.map((section, sectionIndex) =>
        sectionIndex === index
          ? {
              ...section,
              [field]: value,
            }
          : section,
      ),
    );
  };

  const handleAddSection = () => {
    setSections((prev) => [...prev, createEmptySection()]);
  };

  const handleRemoveSection = (index) => {
    setSections((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, sectionIndex) => sectionIndex !== index);
    });
  };

  const handleMoveSection = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= sections.length) return;

    setSections((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[nextIndex];
      copy[nextIndex] = temp;
      return copy;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    const sectionsPayload = sections
      .map((section) => ({
        html_content: section.html_content?.trim() ?? '',
      }))
      .filter((section) => section.html_content);

    try {
      if (isEdit) {
        await updateGuide(id, guideData, sectionsPayload);
      } else {
        await createGuide(guideData, sectionsPayload);
      }
      navigate('/admin/guides');
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

  const titleText = isEdit ? '가이드 수정' : '새 가이드 추가';
  const seoTitle = isEdit ? '가이드 수정' : '가이드 작성';

  return (
    <div className="min-h-screen bg-slate-50">
      <Seo
        title={seoTitle}
        description={`관리자 - ${titleText}`}
        path={isEdit ? `/admin/guides/edit/${id}` : '/admin/guides/new'}
        robots="noindex,nofollow"
      />

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
              <Link to="/admin/guides" className="text-sm font-medium text-blue-700">
                가이드
              </Link>
              <Link to="/admin/board" className="text-sm font-medium text-slate-600 hover:text-slate-900">
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
          <h1 className="text-2xl font-semibold text-slate-900">{titleText}</h1>
          <Link to="/admin/guides" className="text-sm text-slate-600 hover:text-slate-900">
            목록으로
          </Link>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-600 bg-red-50 p-4 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="guide-title" className="block text-sm font-medium text-slate-700 mb-2">
                  제목
                </label>
                <input
                  id="guide-title"
                  value={guideData.title}
                  onChange={(event) => handleTitleChange(event.target.value)}
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="연차 기본 규칙 한 장 요약"
                />
              </div>
              <div>
                <label htmlFor="guide-slug" className="block text-sm font-medium text-slate-700 mb-2">
                  슬러그
                </label>
                <input
                  id="guide-slug"
                  value={guideData.slug}
                  onChange={(event) => handleSlugChange(event.target.value)}
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="annual-leave-basics"
                />
                {!slugTouched && (
                  <p className="mt-1 text-xs text-slate-400">
                    제목을 입력하면 슬러그가 자동으로 채워집니다.
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="guide-summary" className="block text-sm font-medium text-slate-700 mb-2">
                요약
              </label>
              <textarea
                id="guide-summary"
                value={guideData.summary}
                onChange={(event) => handleGuideChange('summary', event.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="가이드의 핵심 내용을 1~2문장으로 정리하세요."
              />
            </div>

            <div>
              <label htmlFor="guide-keywords" className="block text-sm font-medium text-slate-700 mb-2">
                키워드
              </label>
              <input
                id="guide-keywords"
                value={guideData.keywords}
                onChange={(event) => handleGuideChange('keywords', event.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="연차, 휴가, 근로기준법"
              />
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">섹션</h2>
              <button
                type="button"
                onClick={handleAddSection}
                className="text-sm font-medium text-blue-700 hover:text-blue-900"
              >
                섹션 추가
              </button>
            </div>

            {sections.map((section, index) => (
              <div key={`section-${index}`} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700">섹션 {index + 1}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleMoveSection(index, -1)}
                      className="text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40"
                      disabled={index === 0}
                    >
                      위로
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveSection(index, 1)}
                      className="text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40"
                      disabled={index === sections.length - 1}
                    >
                      아래로
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(index)}
                      className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-40"
                      disabled={sections.length === 1}
                    >
                      삭제
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    섹션 내용
                  </label>
                  <RichTextEditor
                    value={section.html_content}
                    onChange={(nextValue) => handleSectionChange(index, 'html_content', nextValue)}
                    placeholder="제목, 본문, 리스트 등을 자유롭게 작성하세요."
                  />
                </div>
              </div>
            ))}
          </section>

          <div className="flex items-center justify-end gap-3">
            <Link to="/admin/guides" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900">
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

export default AdminGuideEditor;

