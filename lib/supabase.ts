import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Product = {
  id: string
  name_en: string
  name_ta: string
  price: number
  weight: string
  category: 'veg-fruits' | 'greens' | 'milk-dairy' | 'meat'
  image_url: string
  in_stock: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type Customer = {
  id: string
  name: string
  mobile: string
  address: string
  created_at: string
  updated_at: string
}

export type BlogNews = {
  id: string
  title: string
  content: string
  category: 'agri-news' | 'ecommerce-news'
  image_url: string
  published: boolean
  created_at: string
  updated_at: string
}
