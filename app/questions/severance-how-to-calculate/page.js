import QuestionLayout from '../../../components/questions/QuestionLayout'
import { H2, H3, P, Callout, Formula, MythList } from '../../../components/questions/prose'

const description =
  '퇴직금은 1일 평균임금 × 30일 × (재직일수 ÷ 365)로 계산합니다. 평균임금이 통상임금보다 낮으면 통상임금으로 올려 계산하는 하한 규정까지 사례로 정리했습니다.'

export const metadata = {
  title: '퇴직금 계산법 — 평균임금 × 30일 × 재직일수÷365',
  description,
  alternates: { canonical: 'https://e-work.kr/questions/severance-how-to-calculate' },
  openGraph: {
    title: '내 퇴직금은 어떻게 계산하나요?',
    description: '평균임금 산정부터 최종 금액까지 한 단계씩 따라가며 계산합니다.',
    type: 'article',
  },
}

const tocItems = [
  { id: 'answer', label: '공식은 하나, 변수는 평균임금과 재직일수' },
  { id: 'case', label: '3년 4개월 근무자의 퇴직금 계산' },
  { id: 'criteria', label: '평균임금이 낮게 나오면 통상임금으로 올린다' },
  { id: 'exception', label: '평균임금 계산에서 빼야 하는 기간' },
  { id: 'myth', label: '자주 오해하는 부분' },
]

const faqs = [
  {
    question: '퇴직금 계산식은 무엇인가요?',
    answer:
      '1일 평균임금 × 30일 × (총 재직일수 ÷ 365)입니다. 1일 평균임금은 퇴직일 이전 3개월간 지급된 임금 총액을 그 기간의 총 일수로 나눠 구합니다. 근속 1년마다 약 한 달치 임금이 쌓이는 구조입니다.',
  },
  {
    question: '평균임금이 통상임금보다 적게 나오면 어떻게 하나요?',
    answer:
      '통상임금을 평균임금으로 봅니다. 근로기준법 제2조 제2항이 정한 하한 규정으로, 퇴직 직전 3개월에 무급휴직이나 결근이 많아 평균임금이 낮아진 경우 근로자가 불리해지지 않도록 하는 장치입니다.',
  },
  {
    question: '재직일수는 근무한 날만 세나요?',
    answer:
      '아닙니다. 입사일부터 퇴직일까지의 달력상 일수를 모두 셉니다. 주말과 공휴일, 휴직 기간도 포함됩니다. 근무일수만 계산하면 퇴직금이 크게 과소 산정됩니다.',
  },
  {
    question: 'DC형 퇴직연금에 가입되어 있으면 계산이 다른가요?',
    answer:
      '다릅니다. 확정기여형(DC)은 회사가 매년 연간 임금총액의 12분의 1 이상을 근로자 계정에 납입하고, 그 적립금을 운용한 결과가 최종 수령액이 됩니다. 퇴직 시점의 평균임금으로 소급 계산하지 않습니다.',
  },
]

export default function Page() {
  return (
    <QuestionLayout
      slug="severance-how-to-calculate"
      description={description}
      tocItems={tocItems}
      faqs={faqs}
      calculator={{
        path: '/calculators/severance-pay',
        label: '퇴직금 계산기',
        description: '평균임금과 근속기간을 넣으면 예상 퇴직금이 바로 나옵니다',
      }}
      relatedQuestions={['severance-bonus-included', 'severance-unpaid']}
      relatedGuides={[
        {
          slug: 'severance-pay-average-wage',
          label: '평균임금 계산 방법',
          description: '산정 기간과 제외 기간을 자세히',
        },
        {
          slug: 'severance-pay-correct-check',
          label: '퇴직금 계산서 확인법',
          description: '회사가 덜 준 금액을 찾아내는 세 가지 체크포인트',
        },
      ]}
      sources={[
        '근로자퇴직급여 보장법 제8조 제1항',
        '근로기준법 제2조 제1항 제6호(평균임금) · 제2항(통상임금 하한)',
      ]}
    >
      <H2 id="answer">공식은 하나, 변수는 평균임금과 재직일수</H2>
      <P>
        퇴직금 계산식 자체는 단순합니다. 어렵게 느껴지는 이유는 공식이 복잡해서가 아니라, 공식에
        넣을 두 숫자를 정확히 구하는 일이 까다롭기 때문입니다.
      </P>
      <Formula
        lines={['퇴직금 = 1일 평균임금 × 30일 × (총 재직일수 ÷ 365)']}
        result="근속 1년마다 약 한 달치 임금이 쌓이는 구조"
      />
      <P>
        여기서 1일 평균임금은 <strong>퇴직일 이전 3개월간 지급된 임금 총액을 그 기간의 총 일수로
        나눈 값</strong>이고, 재직일수는 입사일부터 퇴직일까지의 달력상 일수입니다. 근무일수가
        아니라 달력일수라는 점이 중요합니다.
      </P>

      <H2 id="case">3년 4개월 근무자의 퇴직금 계산</H2>
      <P>
        M씨는 1,217일을 근무하고 퇴사했습니다. 퇴직 직전 3개월(92일) 동안 받은 임금 총액은
        기본급·수당·상여금 산입분을 합해 1,050만 원입니다.
      </P>
      <Formula
        lines={[
          '1일 평균임금 = 10,500,000 ÷ 92일 = 114,130원',
          '30일분      = 114,130 × 30 = 3,423,900원',
          '근속 환산   = 1,217 ÷ 365 = 3.334년',
          '퇴직금      = 3,423,900 × 3.334',
        ]}
        result="≒ 11,415,000원"
      />
      <P>
        회사가 제시한 금액과 10% 이상 차이가 난다면 세 곳 중 하나가 다릅니다. 3개월 임금 총액에서
        빠진 항목이 있거나, 재직일수를 근무일수로 계산했거나, 평균임금 산정 기간을 잘못 잡은
        것입니다.
      </P>

      <H2 id="criteria">평균임금이 낮게 나오면 통상임금으로 올린다</H2>
      <H3>① 하한 규정이 있는 이유</H3>
      <P>
        평균임금은 실제 받은 금액을 기준으로 하므로, 퇴직 직전 3개월에 무급휴직이나 장기 결근이
        있으면 크게 떨어집니다. 그래서 근로기준법은 <strong>평균임금이 통상임금보다 적으면
        통상임금을 평균임금으로 본다</strong>는 하한을 두었습니다.
      </P>
      <H3>② 실무에서는 두 값을 모두 계산한다</H3>
      <P>
        평균임금과 통상임금을 각각 산출한 뒤 큰 쪽을 적용합니다. 회사가 평균임금만 계산해 제시했다면
        통상임금 기준으로도 검산해 볼 필요가 있습니다.
      </P>

      <H2 id="exception">평균임금 계산에서 빼야 하는 기간</H2>
      <P>
        수습기간, 사용자 귀책의 휴업기간, 출산전후휴가, 육아휴직, 업무상 재해 요양기간,
        적법한 쟁의행위 기간은 평균임금 산정 기간에서 제외합니다. 그 기간의 일수와 임금을 함께
        빼고 나머지로 계산하는 방식입니다.
      </P>
      <Callout tone="slate">
        예를 들어 퇴직 직전에 육아휴직 두 달이 있었다면, 그 두 달을 건너뛰고 그 이전의 정상 근무
        3개월로 평균임금을 구합니다. 이 처리를 빠뜨리면 퇴직금이 크게 줄어듭니다.
      </Callout>

      <H2 id="myth">자주 오해하는 부분</H2>
      <MythList
        items={[
          {
            myth: '퇴직금은 기본급을 기준으로 계산한다.',
            truth:
              '평균임금은 기본급뿐 아니라 각종 수당과 상여금 산입분을 포함한 임금 총액을 기준으로 합니다.',
          },
          {
            myth: '재직일수는 실제 출근한 날만 센다.',
            truth:
              '입사일부터 퇴직일까지의 달력일수 전체입니다. 주말·공휴일·휴직 기간도 포함됩니다.',
          },
        ]}
      />
    </QuestionLayout>
  )
}
