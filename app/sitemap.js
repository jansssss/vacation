import { guidesRegistry } from '../src/config/guidesRegistry'
import { questionsRegistry } from '../src/config/questionsRegistry'
import { calculatorsRegistry } from '../src/config/calculatorsRegistry'

export default function sitemap() {
  const baseUrl = 'https://e-work.kr'

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/questions`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/guides`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/calculators`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/labor-check`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), priority: 0.4 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), priority: 0.4 },
    { url: `${baseUrl}/editorial-policy`, lastModified: new Date(), priority: 0.5 },
  ]

  const guidePagesEntries = guidesRegistry.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(guide.updatedAt),
    priority: 0.8,
  }))

  // 질문형 SEO 페이지 — 검색 진입점이므로 가이드보다 우선순위를 높게 둔다
  const questionPages = questionsRegistry.map((q) => ({
    url: `${baseUrl}/questions/${q.slug}`,
    lastModified: new Date(q.updatedAt),
    priority: 0.85,
  }))

  // 계산기 목록은 레지스트리에서 가져온다 — 계산기를 추가해도 사이트맵이 따라온다
  const calculatorPages = calculatorsRegistry.map((calculator) => ({
    url: `${baseUrl}${calculator.path}`,
    lastModified: new Date(calculator.updatedAt),
    priority: 0.8,
  }))

  return [...staticPages, ...questionPages, ...guidePagesEntries, ...calculatorPages]
}
