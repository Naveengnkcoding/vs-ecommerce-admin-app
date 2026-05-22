'use client'

import { useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Trash2, Check, X, Edit2, Plus, PackagePlus } from 'lucide-react'
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

const EMPTY_FORM = {
  name_en: '',
  name_ta: '',
  price: '',
  weight: '',
  category: '',
  image_url: '',
  in_stock: true,
  sort_order: '',
}

// ─── Add Product Modal ────────────────────────────────────────────────────────
function AddProductModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean
  onClose: () => void
  onAdd: (data: typeof EMPTY_FORM) => Promise<void>
}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const set = (field: string, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async () => {
    if (!form.name_en.trim()) return setFormError('English name is required.')
    if (!form.category) return setFormError('Please select a category.')
    if (!form.price || isNaN(parseFloat(form.price))) return setFormError('Enter a valid price.')
    setFormError(null)
    setSubmitting(true)
    await onAdd(form)
    setSubmitting(false)
    setForm(EMPTY_FORM)
    onClose()
  }

  const handleClose = () => {
    setForm(EMPTY_FORM)
    setFormError(null)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-lg p-2">
              <PackagePlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Add New Product</h2>
              <p className="text-green-100 text-xs">Fill in the product details below</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {formError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg">
              <X className="h-4 w-4 flex-shrink-0" />
              {formError}
            </div>
          )}

          {/* Row 1 — Names */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                English Name <span className="text-red-400">*</span>
              </label>
              <Input
                placeholder="e.g. Tomato"
                value={form.name_en}
                onChange={e => set('name_en', e.target.value)}
                className="h-10 border-gray-200 focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Tamil Name
              </label>
              <Input
                placeholder="e.g. தக்காளி"
                value={form.name_ta}
                onChange={e => set('name_ta', e.target.value)}
                className="h-10 border-gray-200 focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 2 — Price & Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Price (₹) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">₹</span>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={form.price}
                  onChange={e => set('price', e.target.value)}
                  className="h-10 pl-7 border-gray-200 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Weight / Unit
              </label>
              <Input
                placeholder="e.g. 500g, 1kg"
                value={form.weight}
                onChange={e => set('weight', e.target.value)}
                className="h-10 border-gray-200 focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 3 — Category & Sort Order */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Category <span className="text-red-400">*</span>
              </label>
              <Select value={form.category} onValueChange={v => set('category', v)}>
                <SelectTrigger className="h-10 border-gray-200 focus:ring-2 focus:ring-green-400">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Sort Order
              </label>
              <Input
                type="number"
                placeholder="e.g. 10"
                value={form.sort_order}
                onChange={e => set('sort_order', e.target.value)}
                className="h-10 border-gray-200 focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 4 — Image URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Image URL
            </label>
            <Input
              placeholder="https://example.com/image.jpg"
              value={form.image_url}
              onChange={e => set('image_url', e.target.value)}
              className="h-10 border-gray-200 focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>

          {/* Row 5 — Stock Toggle */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Stock Status
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => set('in_stock', true)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                  form.in_stock
                    ? 'bg-green-500 text-white border-green-500 shadow-sm'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-green-300'
                }`}
              >
                ✓ In Stock
              </button>
              <button
                type="button"
                onClick={() => set('in_stock', false)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                  !form.in_stock
                    ? 'bg-red-500 text-white border-red-500 shadow-sm'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-red-300'
                }`}
              >
                ✗ Out of Stock
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={submitting}
            className="border-gray-200 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white gap-2 px-6 shadow-md"
          >
            {submitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Adding…</>
            ) : (
              <><Plus className="h-4 w-4" /> Add Product</>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const { products, loading, error, updateProduct, deleteProduct, addProduct } = useProducts()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Record<string, any>>({})
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)

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

  const handleAddProduct = async (form: typeof EMPTY_FORM) => {
    await addProduct({
      name_en: form.name_en,
      name_ta: form.name_ta,
      price: parseFloat(form.price) || 0,
      weight: form.weight,
      category: form.category,
      image_url: form.image_url,
      in_stock: form.in_stock,
      sort_order: parseInt(form.sort_order) || 0,
    })
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
      <AddProductModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddProduct}
      />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Products Management</h1>
          <p className="text-gray-600">Edit all product details including names, prices, and index</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white gap-2 shadow-md h-10 px-4"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
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