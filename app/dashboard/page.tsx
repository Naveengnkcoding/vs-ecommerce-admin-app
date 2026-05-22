'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useOrders } from '@/hooks/useOrders'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Users, Package, FileText, ShoppingCart, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    totalPosts: 0,
  })
  const [loading, setLoading] = useState(true)
  const { orders, getTotalSoldPrice, fetchOrders } = useOrders()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [customersRes, productsRes, postsRes] = await Promise.all([
          supabase.from('customers').select('id', { count: 'exact', head: true }),
          supabase.from('products').select('id', { count: 'exact', head: true }),
          supabase.from('blog_news').select('id', { count: 'exact', head: true }),
        ])

        setStats({
          totalCustomers: customersRes.count || 0,
          totalProducts: productsRes.count || 0,
          totalPosts: postsRes.count || 0,
        })

        await fetchOrders()
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [fetchOrders])

  const totalSoldPrice = getTotalSoldPrice()

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your business overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Customers Card */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-gray-600">
                Total Customers
              </CardTitle>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-4xl font-bold text-gray-900">{stats.totalCustomers}</div>
            <p className="text-sm text-gray-500 mt-2">Active customers in the system</p>
          </CardContent>
        </Card>

        {/* Products Card */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-gray-600">
                Total Products
              </CardTitle>
              <div className="bg-green-100 p-3 rounded-lg">
                <Package className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-4xl font-bold text-gray-900">{stats.totalProducts}</div>
            <p className="text-sm text-gray-500 mt-2">Available products in catalog</p>
          </CardContent>
        </Card>

        {/* Blog Posts Card */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-gray-600">
                Blog Posts
              </CardTitle>
              <div className="bg-purple-100 p-3 rounded-lg">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-4xl font-bold text-gray-900">{stats.totalPosts}</div>
            <p className="text-sm text-gray-500 mt-2">Published articles</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Card */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Orders This Month
              </CardTitle>
              <div className="bg-orange-100 p-3 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-4xl font-bold text-gray-900">{orders.length}</div>
            <p className="text-sm text-gray-500 mt-2">Total orders created</p>
          </CardContent>
        </Card>

        {/* Total Sold Price Card */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-emerald-50 to-green-50">
          <CardHeader className="pb-3 border-b border-green-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Total Sold Price
              </CardTitle>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-4xl font-bold text-green-600">₹{totalSoldPrice.toFixed(2)}</div>
            <p className="text-sm text-gray-600 mt-2">Total value from orders</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg mt-8 bg-white">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-lg font-semibold text-gray-900">Quick Navigation</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="font-semibold text-blue-900 mb-1">Products</h3>
              <p className="text-sm text-blue-700">Manage and update product prices, images, and stock</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200 hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="font-semibold text-green-900 mb-1">Customers</h3>
              <p className="text-sm text-green-700">View and edit customer information and contact details</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="font-semibold text-purple-900 mb-1">Blog & News</h3>
              <p className="text-sm text-purple-700">Create and publish agriculture and ecommerce news</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="font-semibold text-orange-900 mb-1">Orders & Billing</h3>
              <p className="text-sm text-orange-700">Manage orders and generate PDF bills</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
