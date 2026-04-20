import './globals.css'
import SiteShell from '../components/SiteShell'
import { getAllGuides } from '../lib/guides'

export const revalidate = 3600

export const metadata = {
  title: {
    default: 'e-work.kr | 노무/근로 계산기 허브',
    template: '%s | e-work.kr',
  },
  description: '연차, 퇴직금 등 노무/근로 계산기를 한 곳에서 확인하고, 실무 FAQ와 사례까지 함께 제공하는 e-work.kr 콘텐츠 허브입니다.',
  metadataBase: new URL('https://e-work.kr'),
}

export default async function RootLayout({ children }) {
  const guides = await getAllGuides()
  const latestDate = guides[0]?.created_at?.slice(0, 10) ?? guides[0]?.updated_at?.slice(0, 10) ?? null

  return (
    <html lang="ko">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <SiteShell latestGuideDate={latestDate}>{children}</SiteShell>
      </body>
    </html>
  )
}
