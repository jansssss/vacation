import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import { fetchBoardPosts } from "../lib/api/board";

const BoardList = () => {
  const [boardPosts, setBoardPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const breadcrumbs = [
    { label: "홈", path: "/" },
    { label: "게시판", path: "/board" },
  ];

  useEffect(() => {
    const loadBoardPosts = async () => {
      try {
        setLoading(true);
        const data = await fetchBoardPosts();
        setBoardPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBoardPosts();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center">
        <div className="text-slate-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Seo
        title="게시판"
        description="노무/근로 관련 공지와 질문을 정리하는 게시판입니다."
        path="/board"
      />
      <Breadcrumbs items={breadcrumbs} />

      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">게시판</h1>
            <p className="mt-2 text-slate-600">
              승인된 공지와 실무 질문을 모아두는 공간입니다.
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-4">
        {boardPosts.length === 0 && (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 text-sm text-slate-500">
            아직 게시글이 없습니다.
          </div>
        )}

        {boardPosts.map((post) => (
          <Link
            key={post.slug}
            to={`/board/${post.slug}`}
            className="block rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-slate-900">{post.title}</h2>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
              <span>작성자 {post.author || "익명"}</span>
              <span>{new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">{post.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BoardList;
