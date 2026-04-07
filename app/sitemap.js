import { guidesRegistry } from '../src/config/guidesRegistry'

export default function sitemap() {
  const baseUrl = 'https://e-work.kr'

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/guides`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/calculators`, lastModified: new Date(), priority: 0.9 },
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

  const calculatorPages = [
    'childcare-support',
    'annual-leave',
    'severance-pay',
    'retirement-pension',
    'net-salary',
  ].map((slug) => ({
    url: `${baseUrl}/calculators/${slug}`,
    lastModified: new Date(),
    priority: 0.8,
  }))

  return [...staticPages, ...guidePagesEntries, ...calculatorPages]
}
