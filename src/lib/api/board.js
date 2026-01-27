import { supabase } from '../supabase';

export const fetchBoardPosts = async () => {
  const { data, error } = await supabase
    .from('board_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchBoardPostBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('board_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
};

export const fetchBoardPostById = async (id) => {
  const { data, error } = await supabase
    .from('board_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

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

export const deleteBoardPost = async (postId) => {
  const { error } = await supabase
    .from('board_posts')
    .delete()
    .eq('id', postId);

  if (error) throw error;
  return true;
};

