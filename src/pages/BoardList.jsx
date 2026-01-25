import React from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import { boardPosts } from "../content/boardPosts";

const BoardList = () => {
  const breadcrumbs = [
    { label: "??, path: "/" },
    { label: "寃뚯떆??, path: "/board" },
  ];

  return (
    <div className="space-y-8">
      <Seo
        title="寃뚯떆??
        description="?몃Т/洹쇰줈 愿??怨듭?? 吏덈Ц???뺣━?섎뒗 寃뚯떆?먯엯?덈떎."
        path="/board"
      />
      <Breadcrumbs items={breadcrumbs} />

      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">寃뚯떆??/h1>
            <p className="mt-2 text-slate-600">
              ?뱀씤??怨듭?? ?ㅻТ 吏덈Ц??紐⑥븘?먮뒗 怨듦컙?낅땲??
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-4">
        {boardPosts.length === 0 && (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 text-sm text-slate-500">
            ?꾩쭅 寃뚯떆湲???놁뒿?덈떎.
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
              <span>?묒꽦??{post.author || "?듬챸"}</span>
              <span>{post.createdAt}</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">{post.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BoardList;
