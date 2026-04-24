'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

export default function UserProfile() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))
  }, [])

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container max-w-lg py-10 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Signed-in user details from Supabase.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Email
              </p>
              <p className="text-gray-900 font-mono text-sm mt-1">
                {user?.email ?? '…'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                User id
              </p>
              <p className="text-gray-700 font-mono text-xs break-all mt-1">
                {user?.id ?? '—'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button variant="outline" onClick={() => signOut()}>
                Sign out
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/admin">Admin</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/">Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
