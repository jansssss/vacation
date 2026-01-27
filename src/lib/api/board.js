import { supabase } from '../supabase';

/**
 * 모든 게시글 목록 조회
 */
export const fetchBoardPosts = async () => {
  const { data, error } = await supabase
    .from('board_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * slug로 게시글 조회
 */
export const fetchBoardPostBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('board_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
};

/**
 * 게시글 생성 (관리자 전용)
 */
export const createBoardPost = async (postData) => {
  const { data, error } = await supabase
    .from('board_posts')
    .insert({
      slug: postData.slug,
      title: postData.title,
      author: postData.author,
      summary: postData.summary,
      content: postData.content,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * 게시글 수정 (관리자 전용)
 */
export const updateBoardPost = async (postId, postData) => {
  const { error } = await supabase
    .from('board_posts')
    .update({
      slug: postData.slug,
      title: postData.title,
      author: postData.author,
      summary: postData.summary,
      content: postData.content,
    })
    .eq('id', postId);

  if (error) throw error;
  return true;
};

/**
 * 게시글 삭제 (관리자 전용)
 */
export const deleteBoardPost = async (postId) => {
  const { error } = await supabase
    .from('board_posts')
    .delete()
    .eq('id', postId);

  if (error) throw error;
  return true;
};
