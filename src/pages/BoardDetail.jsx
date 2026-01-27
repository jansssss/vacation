import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import { fetchBoardPostBySlug } from "../lib/api/board";

const BoardDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const data = await fetchBoardPostBySlug(slug);
        setPost(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center">
        <div className="text-slate-600">로딩 중...</div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: "홈", path: "/" },
    { label: "게시판", path: "/board" },
    { label: post?.title || "상세", path: `/board/${slug}` },
  ];

  if (error || !post) {
    return (
      <div className="space-y-6">
        <Seo title="게시글을 찾을 수 없습니다" description="게시글이 존재하지 않습니다." path={`/board/${slug}`} />
        <Breadcrumbs items={breadcrumbs} />
        <section className="rounded-2xl border border-slate-100 bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">게시글을 찾을 수 없습니다.</h1>
          <p className="mt-2 text-slate-600">요청한 게시글이 없거나 이동되었습니다.</p>
          <Link to="/board" className="mt-4 inline-block text-emerald-700">
            게시판 목록으로
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Seo title={post.title} description={post.summary} path={`/board/${post.slug}`} />
      <Breadcrumbs items={breadcrumbs} />

      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span>작성자 {post.author || "익명"}</span>
          <span>{new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">{post.title}</h1>
        <div className="whitespace-pre-line text-slate-700 leading-relaxed">
          {post.content}
        </div>
      </section>

      <div>
        <Link to="/board" className="text-sm text-emerald-700 hover:text-emerald-900">
          ← 게시판 목록으로
        </Link>
      </div>
    </div>
  );
};

export default BoardDetail;
