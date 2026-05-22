'use client'

import { useState } from 'react'
import { useBlog } from '@/hooks/useBlog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Trash2, X, Plus, Edit2, CheckCircle, Clock } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const CATEGORIES = [
  { value: 'agri-news', label: 'Agriculture News' },
  { value: 'ecommerce-news', label: 'E-commerce News' },
]

export default function BlogPage() {
  const { posts, loading, error, createPost, updatePost, deletePost } = useBlog()
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'agri-news' as 'agri-news' | 'ecommerce-news',
    image_url: '',
    published: true,
  })

  const handleCreatePost = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in title and content')
      return
    }

    const success = await createPost({
      title: formData.title,
      content: formData.content,
      category: formData.category,
      image_url: formData.image_url,
      published: formData.published,
    })

    if (success) {
      setFormData({
        title: '',
        content: '',
        category: 'agri-news',
        image_url: '',
        published: true,
      })
      setIsCreating(false)
    }
  }

  const handleUpdatePost = async (postId: string) => {
    const post = posts.find(p => p.id === postId)
    if (!post) return

    const success = await updatePost(postId, {
      title: formData.title || post.title,
      content: formData.content || post.content,
      category: formData.category || post.category,
      image_url: formData.image_url || post.image_url,
      published: formData.published !== undefined ? formData.published : post.published,
    })

    if (success) {
      setEditingId(null)
      setFormData({
        title: '',
        content: '',
        category: 'agri-news',
        image_url: '',
        published: true,
      })
    }
  }

  const startEdit = (post: any) => {
    setEditingId(post.id)
    setFormData({
      title: post.title,
      content: post.content,
      category: post.category,
      image_url: post.image_url,
      published: post.published,
    })
  }

  const handleDeletePost = async (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await deletePost(postId)
    }
  }

  const resetForm = () => {
    setIsCreating(false)
    setEditingId(null)
    setFormData({
      title: '',
      content: '',
      category: 'agri-news',
      image_url: '',
      published: true,
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Blog & News Management</h1>
          <p className="text-gray-600">Create and publish agriculture and e-commerce news articles</p>
        </div>
        {!isCreating && !editingId && (
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-11"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Post
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 border-0 shadow-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <Card className="mb-8 border-0 shadow-lg bg-white">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">
                {editingId ? 'Edit Post' : 'Create New Post'}
              </CardTitle>
              <button
                onClick={resetForm}
                className="text-white hover:bg-white/20 p-1 rounded transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
              <Input
                placeholder="Enter post title..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="h-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Publish Status
                </label>
                <Select
                  value={formData.published ? 'published' : 'draft'}
                  onValueChange={(value) =>
                    setFormData({ ...formData, published: value === 'published' })
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Image URL (Optional)
              </label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                className="h-10"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Content
              </label>
              <textarea
                placeholder="Write your article content here..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.content.length} characters
              </p>
            </div>

            <div className="flex gap-4 justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={resetForm}
                className="h-10"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={() =>
                  editingId ? handleUpdatePost(editingId) : handleCreatePost()
                }
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-10"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {editingId ? 'Update Post' : 'Create Post'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="pt-12 pb-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">No blog posts created yet</p>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {posts.map(post => (
            <Card
              key={post.id}
              className="border-0 shadow-lg hover:shadow-xl transition-all bg-white overflow-hidden flex flex-col"
            >
              {post.image_url && (
                <div className="w-full h-48 bg-gradient-to-br from-purple-200 to-blue-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          CATEGORIES.find(c => c.value === post.category)?.value ===
                          'agri-news'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {CATEGORIES.find(c => c.value === post.category)?.label}
                      </span>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                          post.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {post.published ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Published
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3" />
                            Draft
                          </>
                        )}
                      </span>
                    </div>
                    <CardTitle className="text-lg text-gray-900">
                      {post.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 pb-4">
                <p className="text-gray-700 line-clamp-3 text-sm leading-relaxed">
                  {post.content}
                </p>
                {post.created_at && (
                  <p className="text-xs text-gray-500 mt-4">
                    Created on {new Date(post.created_at).toLocaleDateString()}
                  </p>
                )}
              </CardContent>

              <div className="border-t border-gray-100 p-4 flex gap-2 justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startEdit(post)}
                  className="h-9 border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeletePost(post.id)}
                  className="h-9"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {posts.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-sm font-semibold text-gray-600">
                Total Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600">{posts.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-sm font-semibold text-gray-600">
                Published
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">
                {posts.filter(p => p.published).length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-sm font-semibold text-gray-600">
                Drafts
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-gray-600">
                {posts.filter(p => !p.published).length}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// Add missing import
import { FileText } from 'lucide-react'
