'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function ContentGenerator() {
  const router = useRouter()
  const [draft, setDraft] = useState('')

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container max-w-3xl py-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Content generator
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Draft snippets or outlines. Replace this workflow with your Lovable
              generator when you merge it.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin">Admin</Link>
            </Button>
            <Button variant="ghost" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>
        </div>
        <Textarea
          className="min-h-[240px] font-mono text-sm"
          placeholder="Write draft content here…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
      </main>
    </div>
  )
}
