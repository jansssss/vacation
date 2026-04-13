import { supabase } from './supabase'
import { guidesRegistry, getGuideBySlug as getRegistryGuide } from '../src/config/guidesRegistry'

const normalizeRegistryGuide = (guide) => ({
  slug: guide.slug,
  title: guide.title,
  summary: guide.summary,
  updated_at: guide.updatedAt,
  keywords: guide.keywords ?? '',
})

// Supabase 가이드 + 레지스트리 병합 (DB 우선)
const mergeGuides = (dbGuides = []) => {
  const merged = new Map()
  dbGuides.forEach((g) => merged.set(g.slug, g))
  guidesRegistry.forEach((g) => {
    if (!merged.has(g.slug)) merged.set(g.slug, normalizeRegistryGuide(g))
  })
  return Array.from(merged.values()).sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  )
}

export async function getAllGuides() {
  if (!supabase) return guidesRegistry.map(normalizeRegistryGuide)

  try {
    const { data, error } = await supabase
      .from('guides')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return mergeGuides(data || [])
  } catch {
    return guidesRegistry.map(normalizeRegistryGuide)
  }
}

export async function getAllGuideSlugs() {
  const guides = await getAllGuides()
  return guides.map((g) => g.slug)
}

export async function getGuideBySlug(slug) {
  // 1. Supabase에서 시도
  if (supabase) {
    try {
      const { data: guide, error } = await supabase
        .from('guides')
        .select('*')
        .eq('slug', slug)
        .single()

      if (!error && guide) {
        const { data: sections } = await supabase
          .from('guide_sections')
          .select('*')
          .eq('guide_id', guide.id)
          .order('order_index', { ascending: true })

        return {
          ...guide,
          sections: (sections || []).map((s) => ({ html_content: s.html_content ?? '' })),
          source: 'supabase',
        }
      }
    } catch {
      // fallback to registry
    }
  }

  // 2. guidesRegistry fallback
  const reg = getRegistryGuide(slug)
  if (!reg) return null
  return { ...normalizeRegistryGuide(reg), sections: reg.sections, source: 'registry' }
}
