import { useState, useEffect } from 'react'
import { supabase, type Product } from '@/lib/supabase'

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true })

      if (fetchError) throw fetchError
      setProducts(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { error: updateError } = await supabase
        .from('products')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (updateError) throw updateError
      
      setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product')
      return false
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
      
      setProducts(products.filter(p => p.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product')
      return false
    }
  }

  return {
    products,
    loading,
    error,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  }
}
