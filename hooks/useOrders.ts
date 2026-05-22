'use client'

import { useCallback, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Order {
  id?: string
  order_no: string
  order_value: number
  price: number
  calculated_value?: number
  created_at?: string
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.log('[v0] Orders table not created yet - this is expected')
        setOrders([])
      } else {
        setOrders(data || [])
      }
    } catch (err) {
      console.log('[v0] Orders not available yet')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  const addOrder = useCallback(
    async (orderData: Order) => {
      setLoading(true)
      setError(null)
      try {
        const calculated = orderData.order_value * orderData.price

        const { data, error: insertError } = await supabase
          .from('orders')
          .insert([
            {
              order_no: orderData.order_no,
              order_value: orderData.order_value,
              price: orderData.price,
              calculated_value: calculated,
            },
          ])
          .select()

        if (insertError) throw insertError

        if (data) {
          setOrders((prev) => [data[0], ...prev])
        }

        return data?.[0]
      } catch (err: any) {
        setError(err.message || 'Failed to add order')
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const deleteOrder = useCallback(
    async (id: string) => {
      setLoading(true)
      setError(null)
      try {
        const { error: deleteError } = await supabase
          .from('orders')
          .delete()
          .eq('id', id)

        if (deleteError) throw deleteError

        setOrders((prev) => prev.filter((o) => o.id !== id))
      } catch (err: any) {
        setError(err.message || 'Failed to delete order')
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const getTotalSoldPrice = useCallback(() => {
    return orders.reduce((sum, order) => sum + (order.calculated_value || 0), 0)
  }, [orders])

  return {
    orders,
    loading,
    error,
    fetchOrders,
    addOrder,
    deleteOrder,
    getTotalSoldPrice,
  }
}
