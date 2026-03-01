import React from "react";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import { SITE_CONFIG } from "../config/siteConfig";

const consultationChecklist = [
  "제도 유형: 육아휴직 또는 육아기 근로시간 단축",
  "월 기준 급여 또는 통상임금",
  "사용 예정 개월 수와 시작 시점",
  "우선지원대상기업 여부",
  "복귀 후 6개월 계속고용 가능성",
  "업무분담 보상 또는 대체인력 운영 여부",
];

const faqItems = [
  {
    title: "어떤 문의가 가장 적합한가",
    body: "육아지원금 계산기 결과를 보고 우리 회사 기준으로 다시 보고 싶은 경우, 회사 순부담과 지원금 구조를 함께 점검하고 싶은 경우에 가장 적합합니다.",
  },
  {
    title: "계산기 결과를 같이 보내야 하나",
    body: "가능하면 같이 보내는 편이 좋습니다. 계산기에서 본 제도 유형, 사용 개월 수, 월 급여, 회사 부담 변화 정도를 함께 적어 주면 확인 속도가 빨라집니다.",
  },
  {
    title: "어떤 답변을 기대할 수 있나",
    body: "입력값 기준 재검토 포인트, 놓치기 쉬운 요건, 사후지급분과 즉시지급분 해석, 회사 순부담을 볼 때 주의할 점을 정리해서 안내하는 흐름이 적합합니다.",
  },
];

const Contact = () => {
  const breadcrumbs = [
    { label: "홈", path: "/" },
    { label: "문의", path: "/contact" },
  ];

  const childcareMailSubject = encodeURIComponent("[육아지원금 계산기] 맞춤 검토 문의");
  const childcareMailBody = encodeURIComponent(
    [
      "안녕하세요.",
      "",
      "육아지원금 계산기 결과를 바탕으로 맞춤 검토를 요청드립니다.",
      "",
      "1. 제도 유형:",
      "2. 월 기준 급여:",
      "3. 사용 예정 개월 수:",
      "4. 우선지원대상기업 여부:",
      "5. 복귀 후 6개월 계속고용 가능성:",
      "6. 업무분담 보상 또는 대체인력 운영 여부:",
      "7. 계산기에서 확인한 회사 월 순부담 또는 주요 메모:",
      "",
      "확인 부탁드립니다.",
    ].join("\n")
  );

  return (
    <div className="space-y-8">
      <Seo
        title="맞춤 검토 문의"
        description="육아지원금 계산기 결과를 바탕으로 회사 기준 맞춤 검토를 요청할 수 있는 문의 페이지입니다."
        path="/contact"
      />
      <Breadcrumbs items={breadcrumbs} />

      <section className="rounded-[2rem] border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-emerald-50 p-8 shadow-sm">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            맞춤 검토 문의
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            계산기 결과를 바탕으로
            <span className="block text-blue-700">우리 회사 조건을 다시 점검할 수 있습니다.</span>
          </h1>
          <p className="max-w-3xl leading-relaxed text-slate-600">
            이번 특집의 핵심은 육아휴직·육아기 근로시간 단축 지원금입니다. 계산기 결과는 예상치이므로,
            실제 운영에서는 회사 규모, 계속고용 가능성, 업무분담 보상 방식에 따라 해석이 달라질 수 있습니다.
            이 페이지는 계산기 다음 단계의 전환을 위해 구성했습니다.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${SITE_CONFIG.contactEmail}?subject=${childcareMailSubject}&body=${childcareMailBody}`}
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              육아지원금 문의 메일 보내기
            </a>
            <a
              href={`mailto:${SITE_CONFIG.contactEmail}`}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              일반 문의 메일 열기
            </a>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr),minmax(0,0.8fr)]">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">문의 전에 같이 보내면 좋은 정보</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            아래 항목을 함께 보내면 계산기 결과를 기준으로 다시 보는 데 필요한 맥락이 빨라집니다.
          </p>
          <div className="mt-6 space-y-3">
            {consultationChecklist.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-blue-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              연락처
            </p>
            <p className="mt-3 text-lg font-semibold text-slate-900">{SITE_CONFIG.contactEmail}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              메일 제목에 `육아지원금 계산기 맞춤 검토`라고 적어 주면 분류가 더 쉬워집니다.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">이런 문의에 적합합니다</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>계산기 결과의 사업주 지원금이 왜 이렇게 나왔는지 다시 보고 싶은 경우</li>
              <li>회사의 실제 월 순부담을 더 보수적으로 보고 싶은 경우</li>
              <li>업무분담 지원금과 계속고용 요건을 함께 해석해야 하는 경우</li>
            </ul>
          </section>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">자주 묻는 질문</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {faqItems.map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-blue-100 bg-blue-50 p-6 text-sm text-slate-700 shadow-sm">
        <p className="font-semibold text-slate-900">안내</p>
        <p className="mt-2 leading-relaxed">
          개인정보나 민감한 인사자료 원본은 메일에 바로 첨부하지 말고, 필요한 항목만 요약해서 보내는 편이 안전합니다.
          계산기 결과 캡처와 핵심 조건만 보내도 초기 검토에는 충분합니다.
        </p>
      </section>
    </div>
  );
};

export default Contact;
