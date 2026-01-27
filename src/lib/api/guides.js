import { supabase } from '../supabase';

export const fetchGuides = async () => {
  const { data, error } = await supabase
    .from('guides')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
};

const fetchGuideWithSections = async (filter) => {
  const { data: guide, error: guideError } = await supabase
    .from('guides')
    .select('*')
    .match(filter)
    .single();

  if (guideError) throw guideError;
  if (!guide) return null;

  const { data: sections, error: sectionsError } = await supabase
    .from('guide_sections')
    .select('*')
    .eq('guide_id', guide.id)
    .order('order_index', { ascending: true });

  if (sectionsError) throw sectionsError;

  return {
    ...guide,
    sections: sections.map((section) => ({
      heading: section.heading ?? '',
      content: section.content ?? '',
      bullets: Array.isArray(section.bullets) ? section.bullets : [],
      content2: section.content2 ?? '',
    })),
  };
};

export const fetchGuideBySlug = async (slug) => fetchGuideWithSections({ slug });

export const fetchGuideById = async (id) => fetchGuideWithSections({ id });

const normalizeBullets = (bullets) => {
  if (Array.isArray(bullets)) {
    return bullets.map((item) => `${item}`.trim()).filter(Boolean);
  }

  if (typeof bullets === 'string') {
    return bullets
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

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

  if (sections && sections.length > 0) {
    const sectionsToInsert = sections.map((section, index) => ({
      guide_id: guide.id,
      heading: section.heading,
      content: section.content,
      bullets: normalizeBullets(section.bullets),
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

export const updateGuide = async (guideId, guideData, sections) => {
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

  const { error: deleteError } = await supabase
    .from('guide_sections')
    .delete()
    .eq('guide_id', guideId);

  if (deleteError) throw deleteError;

  if (sections && sections.length > 0) {
    const sectionsToInsert = sections.map((section, index) => ({
      guide_id: guideId,
      heading: section.heading,
      content: section.content,
      bullets: normalizeBullets(section.bullets),
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

export const deleteGuide = async (guideId) => {
  const { error } = await supabase
    .from('guides')
    .delete()
    .eq('id', guideId);

  if (error) throw error;
  return true;
};

