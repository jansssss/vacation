import { supabase } from '../supabase';

/**
 * 모든 가이드 목록 조회
 */
export const fetchGuides = async () => {
  const { data, error } = await supabase
    .from('guides')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * slug로 가이드 조회 (섹션 포함)
 */
export const fetchGuideBySlug = async (slug) => {
  // 가이드 기본 정보 조회
  const { data: guide, error: guideError } = await supabase
    .from('guides')
    .select('*')
    .eq('slug', slug)
    .single();

  if (guideError) throw guideError;
  if (!guide) return null;

  // 가이드 섹션 조회
  const { data: sections, error: sectionsError } = await supabase
    .from('guide_sections')
    .select('*')
    .eq('guide_id', guide.id)
    .order('order_index', { ascending: true });

  if (sectionsError) throw sectionsError;

  return {
    ...guide,
    sections: sections.map(section => ({
      heading: section.heading,
      content: section.content,
      bullets: section.bullets, // Already JSONB array
      content2: section.content2,
    })),
  };
};

/**
 * 가이드 생성 (관리자 전용)
 */
export const createGuide = async (guideData, sections) => {
  const { data: guide, error: guideError } = await supabase
    .from('guides')
    .insert({
      slug: guideData.slug,
      title: guideData.title,
      summary: guideData.summary,
      keywords: guideData.keywords,
    })
    .select()
    .single();

  if (guideError) throw guideError;

  // 섹션 추가
  if (sections && sections.length > 0) {
    const sectionsToInsert = sections.map((section, index) => ({
      guide_id: guide.id,
      heading: section.heading,
      content: section.content,
      bullets: section.bullets,
      content2: section.content2,
      order_index: index + 1,
    }));

    const { error: sectionsError } = await supabase
      .from('guide_sections')
      .insert(sectionsToInsert);

    if (sectionsError) throw sectionsError;
  }

  return guide;
};

/**
 * 가이드 수정 (관리자 전용)
 */
export const updateGuide = async (guideId, guideData, sections) => {
  // 가이드 기본 정보 수정
  const { error: guideError } = await supabase
    .from('guides')
    .update({
      slug: guideData.slug,
      title: guideData.title,
      summary: guideData.summary,
      keywords: guideData.keywords,
    })
    .eq('id', guideId);

  if (guideError) throw guideError;

  // 기존 섹션 삭제
  const { error: deleteError } = await supabase
    .from('guide_sections')
    .delete()
    .eq('guide_id', guideId);

  if (deleteError) throw deleteError;

  // 새 섹션 추가
  if (sections && sections.length > 0) {
    const sectionsToInsert = sections.map((section, index) => ({
      guide_id: guideId,
      heading: section.heading,
      content: section.content,
      bullets: section.bullets,
      content2: section.content2,
      order_index: index + 1,
    }));

    const { error: sectionsError } = await supabase
      .from('guide_sections')
      .insert(sectionsToInsert);

    if (sectionsError) throw sectionsError;
  }

  return true;
};

/**
 * 가이드 삭제 (관리자 전용)
 */
export const deleteGuide = async (guideId) => {
  const { error } = await supabase
    .from('guides')
    .delete()
    .eq('id', guideId);

  if (error) throw error;
  return true;
};
