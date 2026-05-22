'use client'

import { useState } from 'react'
import { useCustomers } from '@/hooks/useCustomers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Trash2, Check, X, Edit2, ChevronDown, ChevronUp } from 'lucide-react'

export default function CustomersPage() {
  const { customers, loading, error, updateCustomer, deleteCustomer } = useCustomers()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Record<string, any>>({})

  const handleEdit = (customerId: string, customer: any) => {
    setEditingId(customerId)
    setEditValues({
      [customerId]: {
        ...customer,
      },
    })
  }

  const handleSave = async (customerId: string) => {
    const updates = editValues[customerId]
    const success = await updateCustomer(customerId, updates)
    if (success) {
      setEditingId(null)
      setEditValues({})
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValues({})
  }

  const handleDelete = async (customerId: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      await deleteCustomer(customerId)
    }
  }

  const toggleExpand = (customerId: string) => {
    setExpandedId(expandedId === customerId ? null : customerId)
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Customers Management</h1>
        <p className="text-red-600">#DO NOT EDIT UNLESS REQUEST. This is public user data</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 border-0 shadow-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {customers.length === 0 ? (
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-gray-500 text-lg">No customers found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {customers.map((customer) => (
            <Card
              key={customer.id}
              className={`border-0 shadow-lg transition-all hover:shadow-xl ${
                editingId === customer.id ? 'ring-2 ring-blue-500' : ''
              } bg-white`}
            >
              <CardHeader
                className="pb-4 cursor-pointer hover:bg-gray-50 rounded-t-lg"
                onClick={() => toggleExpand(customer.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                      {customer.name?.charAt(0)?.toUpperCase() || 'C'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {customer.name}
                      </h3>
                      <div className="flex gap-6 mt-2 text-sm text-gray-600 flex-wrap">
                        <span className="flex items-center gap-1">
                          📱 {customer.phone}
                        </span>
                        {customer.alternate_phone && (
                          <span className="flex items-center gap-1">
                            📞 {customer.alternate_phone}
                          </span>
                        )}
                        {customer.email && (
                          <span className="flex items-center gap-1 truncate">
                            ✉️ {customer.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {editingId === customer.id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSave(customer.id)
                          }}
                          className="bg-green-600 hover:bg-green-700 h-9"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCancel()
                          }}
                          className="h-9"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(customer.id, customer)
                          }}
                          className="h-9 border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(customer.id)
                          }}
                          className="h-9"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {expandedId === customer.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {expandedId === customer.id && (
                <CardContent
                  className="pt-6 border-t border-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Name
                      </label>
                      {editingId === customer.id ? (
                        <Input
                          value={editValues[customer.id]?.name || ''}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              [customer.id]: {
                                ...editValues[customer.id],
                                name: e.target.value,
                              },
                            })
                          }
                          className="h-10"
                        />
                      ) : (
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{customer.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      {editingId === customer.id ? (
                        <Input
                          type="email"
                          value={editValues[customer.id]?.email || ''}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              [customer.id]: {
                                ...editValues[customer.id],
                                email: e.target.value,
                              },
                            })
                          }
                          className="h-10"
                          placeholder="customer@example.com"
                        />
                      ) : (
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {customer.email || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Primary Mobile
                      </label>
                      {editingId === customer.id ? (
                        <Input
                          type="tel"
                          value={editValues[customer.id]?.mobile || ''}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              [customer.id]: {
                                ...editValues[customer.id],
                                mobile: e.target.value,
                              },
                            })
                          }
                          className="h-10"
                          placeholder="9876543210"
                        />
                      ) : (
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{customer.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Alternative Mobile
                      </label>
                      {editingId === customer.id ? (
                        <Input
                          type="tel"
                          value={editValues[customer.id]?.alt_mobile || ''}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              [customer.id]: {
                                ...editValues[customer.id],
                                alt_mobile: e.target.value,
                              },
                            })
                          }
                          className="h-10"
                          placeholder="9876543211"
                        />
                      ) : (
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {customer.alternate_phone || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address
                      </label>
                      {editingId === customer.id ? (
                        <textarea
                          value={editValues[customer.id]?.address || ''}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              [customer.id]: {
                                ...editValues[customer.id],
                                address: e.target.value,
                              },
                            })
                          }
                          className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none"
                          placeholder="Customer's address"
                        />
                      ) : (
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                          {customer.address || 'Not provided'}
                        </p>
                      )}
                    </div>

                    {customer.created_at && (
                      <div className="text-sm text-gray-500 md:col-span-2">
                        Member since {new Date(customer.created_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div className="text-sm font-semibold text-gray-600">Total Customers</div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-600">{customers.length}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div className="text-sm font-semibold text-gray-600">With Email</div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-600">
              {customers.filter(c => c.email).length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div className="text-sm font-semibold text-gray-600">With Alt. Mobile</div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-600">
              {customers.filter(c => c.alt_mobile).length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
