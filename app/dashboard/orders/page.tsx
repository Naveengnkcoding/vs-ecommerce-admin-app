'use client'

import { useState, useEffect } from 'react'
import { useOrders } from '@/hooks/useOrders'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Trash2, Plus, Download, X, Check } from 'lucide-react'
import { downloadBillPDF, printBillPDF, BillData } from '@/lib/pdfGenerator'

export default function OrdersPage() {
  const { orders, loading, error, addOrder, deleteOrder, getTotalSoldPrice, fetchOrders } = useOrders()
  const [isAddingOrder, setIsAddingOrder] = useState(false)
  const [showBillModal, setShowBillModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [billContent, setBillContent] = useState('')

  const [formData, setFormData] = useState({
    order_no: '',
    order_value: '',
    price: '',
  })

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleAddOrder = async () => {
    if (!formData.order_no || !formData.order_value || !formData.price) {
      alert('Please fill all fields')
      return
    }
    try {
      await addOrder({
        order_no: formData.order_no,
        order_value: parseFloat(formData.order_value),
        price: parseFloat(formData.price),
      })
      setFormData({ order_no: '', order_value: '', price: '' })
      setIsAddingOrder(false)
    } catch (err) {
      alert('Failed to add order')
    }
  }

  const handleDeleteOrder = async (id: string) => {
    if (confirm('Delete this order?')) {
      try {
        await deleteOrder(id)
      } catch (err) {
        alert('Failed to delete order')
      }
    }
  }

  const handleGenerateBill = (order: any) => {
    setSelectedOrder(order)
    setShowBillModal(true)
  }

  const handleDownloadBill = () => {
    const billData: BillData = {
      orderNo: selectedOrder.order_no,
      orderDate: new Date().toLocaleDateString(),
      items: [
        {
          name: `Order #${selectedOrder.order_no}`,
          quantity: selectedOrder.order_value,
          price: selectedOrder.price,
        },
      ],
      notes: billContent || 'Thank you for your business!',
    }
    downloadBillPDF(billData)
  }

  const handlePrintBill = () => {
    const billData: BillData = {
      orderNo: selectedOrder.order_no,
      orderDate: new Date().toLocaleDateString(),
      items: [
        {
          name: `Order #${selectedOrder.order_no}`,
          quantity: selectedOrder.order_value,
          price: selectedOrder.price,
        },
      ],
      notes: billContent || 'Thank you for your business!',
    }
    printBillPDF(billData)
  }

  const totalSoldPrice = getTotalSoldPrice()

  if (loading) {
    return (
      <div className="p-4 sm:p-8 flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">Orders Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Create orders, track sales, and generate invoices</p>
        </div>
        <Button
          onClick={() => setIsAddingOrder(true)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-10 sm:h-11 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Order
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4 sm:mb-6 border-0 shadow-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Add Order Form */}
      {isAddingOrder && (
        <Card className="border-0 shadow-lg mb-6 sm:mb-8 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg px-4 sm:px-6 py-4">
            <CardTitle>Create New Order</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Order Number</label>
                <Input
                  type="text"
                  placeholder="ORD-001"
                  value={formData.order_no}
                  onChange={(e) => setFormData({ ...formData, order_no: e.target.value })}
                  className="h-10"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity/Value</label>
                <Input
                  type="number"
                  placeholder="5"
                  value={formData.order_value}
                  onChange={(e) => setFormData({ ...formData, order_value: e.target.value })}
                  className="h-10"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Unit Price (₹)</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="100"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="h-10"
                />
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 sm:justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingOrder(false)
                  setFormData({ order_no: '', order_value: '', price: '' })
                }}
                className="h-10 w-full sm:w-auto"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleAddOrder} className="bg-green-600 hover:bg-green-700 h-10 w-full sm:w-auto">
                <Check className="h-4 w-4 mr-2" />
                Create Order
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-2 sm:pb-3 border-b border-gray-100 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-semibold text-gray-600">Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="pt-3 sm:pt-6 px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="text-2xl sm:text-4xl font-bold text-orange-600">{orders.length}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-2 sm:pb-3 border-b border-gray-100 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-semibold text-gray-600">Total Quantity</CardTitle>
          </CardHeader>
          <CardContent className="pt-3 sm:pt-6 px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="text-2xl sm:text-4xl font-bold text-blue-600">
              {orders.reduce((sum, o) => sum + o.order_value, 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50 col-span-2 sm:col-span-1">
          <CardHeader className="pb-2 sm:pb-3 border-b border-green-200 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-semibold text-gray-600">Total Sold Price</CardTitle>
          </CardHeader>
          <CardContent className="pt-3 sm:pt-6 px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="text-2xl sm:text-4xl font-bold text-green-600">₹{totalSoldPrice.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="pt-8 pb-8 text-center px-4">
            <p className="text-gray-500 text-lg mb-4">No orders yet</p>
            <Button onClick={() => setIsAddingOrder(true)} className="bg-green-600 hover:bg-green-700">
              Create First Order
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table (hidden on mobile) */}
          <Card className="border-0 shadow-lg bg-white overflow-hidden hidden sm:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Order No</th>
                    <th className="px-6 py-4 text-center font-semibold">Quantity</th>
                    <th className="px-6 py-4 text-right font-semibold">Unit Price</th>
                    <th className="px-6 py-4 text-right font-semibold">Total (₹)</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={order.id}
                      className={`border-b transition-colors ${
                        index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900">{order.order_no}</td>
                      <td className="px-6 py-4 text-center text-gray-700">{order.order_value}</td>
                      <td className="px-6 py-4 text-right text-gray-700">₹{order.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-semibold text-green-600">
                        ₹{order.calculated_value?.toFixed(2) || (order.order_value * order.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <Button size="sm" onClick={() => handleGenerateBill(order)} className="bg-blue-600 hover:bg-blue-700 h-8">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteOrder(order.id!)} className="h-8">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile Cards (visible on mobile only) */}
          <div className="sm:hidden space-y-3">
            {orders.map((order, index) => (
              <Card key={order.id} className="border-0 shadow-md bg-white overflow-hidden">
                <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-4 py-2">
                  <span className="text-white font-semibold text-sm">{order.order_no}</span>
                </div>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Quantity</p>
                      <p className="font-semibold text-gray-800">{order.order_value}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Unit Price</p>
                      <p className="font-semibold text-gray-800">₹{order.price.toFixed(2)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500 mb-0.5">Total Amount</p>
                      <p className="text-xl font-bold text-green-600">
                        ₹{order.calculated_value?.toFixed(2) || (order.order_value * order.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleGenerateBill(order)}
                      className="bg-blue-600 hover:bg-blue-700 h-9 flex-1 text-xs"
                    >
                      <Download className="h-4 w-4 mr-1.5" />
                      Invoice
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteOrder(order.id!)}
                      className="h-9 px-4"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Bill Modal */}
      {showBillModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <Card className="border-0 shadow-2xl bg-white w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-auto rounded-t-2xl sm:rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-2xl sm:rounded-t-lg sticky top-0 px-4 sm:px-6 py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg">Invoice — {selectedOrder.order_no}</CardTitle>
                <button
                  onClick={() => setShowBillModal(false)}
                  className="text-white hover:bg-white/20 p-1 rounded"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6 pb-6">
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Order Summary / Notes (Optional)
                </label>
                <textarea
                  value={billContent}
                  onChange={(e) => setBillContent(e.target.value)}
                  placeholder="Add order details, items, or customer notes..."
                  className="w-full h-32 sm:h-40 p-3 sm:p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Order No:</strong> {selectedOrder.order_no}</p>
                  <p><strong>Quantity:</strong> {selectedOrder.order_value}</p>
                  <p><strong>Unit Price:</strong> ₹{selectedOrder.price.toFixed(2)}</p>
                  <p className="text-base sm:text-lg font-bold text-green-600 mt-2">
                    Total: ₹{selectedOrder.calculated_value?.toFixed(2) || (selectedOrder.order_value * selectedOrder.price).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-4 sm:justify-end">
                <Button variant="outline" onClick={() => setShowBillModal(false)} className="h-10 w-full sm:w-auto">
                  Cancel
                </Button>
                <Button onClick={handlePrintBill} className="bg-purple-600 hover:bg-purple-700 h-10 w-full sm:w-auto">
                  Print
                </Button>
                <Button onClick={handleDownloadBill} className="bg-blue-600 hover:bg-blue-700 h-10 w-full sm:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}