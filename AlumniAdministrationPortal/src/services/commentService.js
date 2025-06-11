import { supabase } from '../supabase/client';

export const fetchComments = async (postId) => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const addComment = async (postId, content) => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert([
        { 
          post_id: postId,
          content: content,
          user_id: '43b56bdf-c785-4e19-849b-ea85b5c4848c' // Adding the specified user_id
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};