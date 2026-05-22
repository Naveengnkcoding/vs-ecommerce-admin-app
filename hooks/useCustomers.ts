import { useState, useEffect } from 'react'
import { supabase, type Customer } from '@/lib/supabase'

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setCustomers(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch customers')
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      const { error: updateError } = await supabase
        .from('customers')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (updateError) throw updateError
      
      setCustomers(customers.map(c => c.id === id ? { ...c, ...updates } : c))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update customer')
      return false
    }
  }

  const deleteCustomer = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
      
      setCustomers(customers.filter(c => c.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete customer')
      return false
    }
  }

  return {
    customers,
    loading,
    error,
    updateCustomer,
    deleteCustomer,
    refetch: fetchCustomers,
  }
}
