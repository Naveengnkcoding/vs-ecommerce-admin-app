'use client'

import { useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Trash2, Check, X, Edit2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const CATEGORIES = [
  { value: 'veg-fruits', label: 'Vegetables & Fruits' },
  { value: 'greens', label: 'Greens' },
  { value: 'milk-dairy', label: 'Milk & Dairy' },
  { value: 'meat', label: 'Meat' },
]

export default function ProductsPage() {
  const { products, loading, error, updateProduct, deleteProduct } = useProducts()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Record<string, any>>({})
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const filteredProducts = filterCategory === 'all'
    ? products
    : products.filter(p => p.category === filterCategory)

  const handleEdit = (productId: string, product: any) => {
    setEditingId(productId)
    setEditValues({
      [productId]: {
        ...product,
      },
    })
  }

  const handleSave = async (productId: string) => {
    const updates = editValues[productId]
    const success = await updateProduct(productId, {
      ...updates,
      price: parseFloat(updates.price) || 0,
      sort_order: parseInt(updates.sort_order) || 0,
    })
    if (success) {
      setEditingId(null)
      setEditValues({})
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValues({})
  }

  const handleDelete = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(productId)
    }
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Products Management</h1>
          <p className="text-gray-600">Edit all product details including names, prices, and index</p>
        </div>
        <div className="w-48">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="bg-white border-gray-200">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 border-0 shadow-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {filteredProducts.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="pt-8 pb-8 text-center">
              <p className="text-gray-500 text-lg">No products found in this category</p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                  <th className="px-6 py-4 text-left font-semibold text-sm">#</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">English Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">Tamil Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">Price (₹)</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">Weight</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">Category</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">Image URL</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">Stock</th>
                  <th className="px-6 py-4 text-center font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr 
                    key={product.id}
                    className={`border-b transition-colors ${
                      editingId === product.id 
                        ? 'bg-blue-50' 
                        : index % 2 === 0 
                        ? 'bg-white hover:bg-gray-50' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                      {editingId === product.id ? (
                        <Input
                          type="number"
                          value={editValues[product.id]?.sort_order || 0}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              [product.id]: {
                                ...editValues[product.id],
                                sort_order: e.target.value,
                              },
                            })
                          }
                          className="w-16 h-9"
                        />
                      ) : (
                        product.sort_order
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {editingId === product.id ? (
                        <Input
                          value={editValues[product.id]?.name_en || ''}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              [product.id]: {
                                ...editValues[product.id],
                                name_en: e.target.value,
                              },
                            })
                          }
                          className="h-9"
                        />
                      ) : (
                        <span className="font-medium text-gray-900">{product.name_en}</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {editingId === product.id ? (
                        <Input
                          value={editValues[product.id]?.name_ta || ''}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              [product.id]: {
                                ...editValues[product.id],
                                name_ta: e.target.value,
                              },
                            })
                          }
                          className="h-9"
                        />
                      ) : (
                        <span className="text-gray-700">{product.name_ta}</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {editingId === product.id ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={editValues[product.id]?.price || 0}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              [product.id]: {
                                ...editValues[product.id],
                                price: e.target.value,
                              },
                            })
                          }
                          className="h-9"
                        />
                      ) : (
                        <span className="font-semibold text-green-600">₹{product.price}</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {editingId === product.id ? (
                        <Input
                          value={editValues[product.id]?.weight || ''}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              [product.id]: {
                                ...editValues[product.id],
                                weight: e.target.value,
                              },
                            })
                          }
                          className="h-9"
                        />
                      ) : (
                        <span className="text-gray-700">{product.weight}</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                        {CATEGORIES.find(c => c.value === product.category)?.label || product.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {editingId === product.id ? (
                        <Input
                          value={editValues[product.id]?.image_url || ''}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              [product.id]: {
                                ...editValues[product.id],
                                image_url: e.target.value,
                              },
                            })
                          }
                          className="h-9 text-xs"
                          placeholder="https://..."
                        />
                      ) : (
                        <a
                          href={product.image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline text-xs truncate max-w-xs block"
                        >
                          {product.image_url ? 'View' : 'No image'}
                        </a>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-center">
                      {editingId === product.id ? (
                        <select
                          value={editValues[product.id]?.in_stock ? 'true' : 'false'}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              [product.id]: {
                                ...editValues[product.id],
                                in_stock: e.target.value === 'true',
                              },
                            })
                          }
                          className="h-9 px-2 border border-gray-300 rounded"
                        >
                          <option value="true">In Stock</option>
                          <option value="false">Out of Stock</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            product.in_stock
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.in_stock ? 'In Stock' : 'Out'}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-center">
                      <div className="flex gap-2 justify-center">
                        {editingId === product.id ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleSave(product.id)}
                              className="bg-green-600 hover:bg-green-700 h-8"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancel}
                              className="h-8"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(product.id, product)}
                              className="h-8 border-blue-300 text-blue-600 hover:bg-blue-50"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(product.id)}
                              className="h-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="text-sm font-semibold text-gray-600">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-gray-900">{products.length}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="text-sm font-semibold text-gray-600">
              In Stock
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-600">
              {products.filter(p => p.in_stock).length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="text-sm font-semibold text-gray-600">
              Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-red-600">
              {products.filter(p => !p.in_stock).length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
