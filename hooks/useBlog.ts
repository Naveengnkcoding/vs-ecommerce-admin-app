import { useState, useEffect } from 'react'
import { supabase, type BlogNews } from '@/lib/supabase'

export const useBlog = () => {
  const [posts, setPosts] = useState<BlogNews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('blog_news')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setPosts(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blog posts')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const createPost = async (post: Omit<BlogNews, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: createError } = await supabase
        .from('blog_news')
        .insert([
          {
            ...post,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()

      if (createError) throw createError
      
      if (data) {
        setPosts([data[0], ...posts])
        return true
      }
      return false
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post')
      return false
    }
  }

  const updatePost = async (id: string, updates: Partial<BlogNews>) => {
    try {
      const { error: updateError } = await supabase
        .from('blog_news')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (updateError) throw updateError
      
      setPosts(posts.map(p => p.id === id ? { ...p, ...updates } : p))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post')
      return false
    }
  }

  const deletePost = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('blog_news')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
      
      setPosts(posts.filter(p => p.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post')
      return false
    }
  }

  return {
    posts,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
    refetch: fetchPosts,
  }
}
