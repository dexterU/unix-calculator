import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export interface BlogPost {
  id: string
  slug: string
  title: string
  category: string
  excerpt: string | null
  content: string
  keywords: string[] | null
  author: string
  read_time_minutes: number
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

let _client: SupabaseClient | null | undefined

function getBlogSupabase(): SupabaseClient | null {
  if (_client !== undefined) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    _client = null
    return null
  }
  _client = createClient(url, key)
  return _client
}

function mapRow(row: Record<string, unknown>): BlogPost {
  let keywords: string[] | null = null
  const rawKw = row.keywords
  if (Array.isArray(rawKw)) {
    keywords = rawKw.filter((k): k is string => typeof k === 'string')
  }

  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    category: String(row.category),
    excerpt: row.excerpt == null ? null : String(row.excerpt),
    content: String(row.content ?? ''),
    keywords,
    author: String(row.author ?? ''),
    read_time_minutes: Number(row.read_time_minutes ?? 0),
    status: row.status as BlogPost['status'],
    featured: Boolean(row.featured),
    published_at: row.published_at == null ? null : String(row.published_at),
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
  }
}

export async function getAllPublishedPosts(): Promise<BlogPost[]> {
  const supabase = getBlogSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
  if (!data?.length) return []
  return data.map((row) => mapRow(row as Record<string, unknown>))
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = getBlogSupabase()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
  if (!data) return null
  return mapRow(data as Record<string, unknown>)
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const supabase = getBlogSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(3)

  if (error) {
    console.error('Error fetching featured posts:', error)
    return []
  }
  if (!data?.length) return []
  return data.map((row) => mapRow(row as Record<string, unknown>))
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const supabase = getBlogSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .eq('category', category)
    .order('published_at', { ascending: false })

  if (error) return []
  if (!data?.length) return []
  return data.map((row) => mapRow(row as Record<string, unknown>))
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  const supabase = getBlogSupabase()
  if (!supabase) return []

  const { data, error } = await supabase.from('blog_posts').select('slug').eq('status', 'published')

  if (error) return []
  return data?.map((p) => p.slug as string).filter(Boolean) ?? []
}
