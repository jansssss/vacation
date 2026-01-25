import React from "react";
import { Link, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import { getBoardPostBySlug } from "../content/boardPosts";

const BoardDetail = () => {
  const { slug } = useParams();
  const post = getBoardPostBySlug(slug);

  const breadcrumbs = [
    { label: "??, path: "/" },
    { label: "寃뚯떆??, path: "/board" },
    { label: post?.title || "?곸꽭", path: `/board/${slug}` },
  ];

  if (!post) {
    return (
      <div className="space-y-6">
        <Seo title="寃뚯떆湲??李얠쓣 ???놁뒿?덈떎" description="寃뚯떆湲??議댁옱?섏? ?딆뒿?덈떎." path={`/board/${slug}`} />
        <Breadcrumbs items={breadcrumbs} />
        <section className="rounded-2xl border border-slate-100 bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">寃뚯떆湲??李얠쓣 ???놁뒿?덈떎.</h1>
          <p className="mt-2 text-slate-600">?붿껌??寃뚯떆湲???녾굅???대룞?섏뿀?듬땲??</p>
          <Link to="/board" className="mt-4 inline-block text-emerald-700">
            寃뚯떆??紐⑸줉?쇰줈
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
          <span>?묒꽦??{post.author || "?듬챸"}</span>
          <span>{post.createdAt}</span>
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">{post.title}</h1>
        <div className="whitespace-pre-line text-slate-700 leading-relaxed">
          {post.content}
        </div>
      </section>

      <div>
        <Link to="/board" className="text-sm text-emerald-700 hover:text-emerald-900">
          ??寃뚯떆??紐⑸줉?쇰줈
        </Link>
      </div>
    </div>
  );
};

export default BoardDetail;
