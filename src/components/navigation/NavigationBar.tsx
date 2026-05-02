'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, Terminal, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TOOLS_ROUTE_LIST } from '@/lib/toolsRouteList'
import { calculators as navCalculators } from '@/lib/navigationData'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { HeaderSection } from '@/components/navigation/types'

const LEARN_LINKS = [
  { href: '/tutorials', label: 'Tutorials' },
  { href: '/knowledge', label: 'Knowledge base' },
  { href: '/blog', label: 'Blog' },
  { href: '/reference', label: 'Reference hub' },
  { href: '/case-studies', label: 'Case studies' },
  { href: '/challenges', label: 'Challenges' },
  { href: '/function-reference', label: 'Function reference' },
] as const

const COMMUNITY_LINKS = [
  { href: '/contact', label: 'Contact' },
  { href: '/sitemap', label: 'Sitemap' },
] as const

function NavDropdownTrigger({ children }: { children: React.ReactNode }) {
  return (
    <DropdownMenuTrigger
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium',
        'text-foreground/90 hover:bg-muted/80 hover:text-foreground',
        'outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-muted/80'
      )}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-70" aria-hidden />
    </DropdownMenuTrigger>
  )
}

export function NavigationBar({
  activeSection: _activeSection = '',
  onNavigate,
  sections: _sections,
}: {
  activeSection?: string
  onNavigate: (sectionId: string) => void
  sections: HeaderSection[]
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isHome = pathname === '/'

  const toolsLinks = TOOLS_ROUTE_LIST.filter((t) => t.path !== '/tools')

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-card/90 text-card-foreground backdrop-blur-md">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold text-foreground hover:text-primary"
          >
            <Terminal className="h-6 w-6 text-primary" />
            Unix Calculator
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <DropdownMenu>
              <NavDropdownTrigger>Tools</NavDropdownTrigger>
              <DropdownMenuContent align="start" className="max-h-80 w-72 overflow-y-auto">
                <DropdownMenuLabel>Tools</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/tools">All tools</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {toolsLinks.map((t) => (
                  <DropdownMenuItem key={t.path} asChild>
                    <Link href={t.path} className="flex flex-wrap items-center gap-2">
                      <span>{t.title}</span>
                      {t.path === '/tools/timestamp-debugger' ? (
                        <span className="rounded bg-terminal-green px-1.5 py-0.5 font-mono text-xs text-terminal-bg">
                          NEW
                        </span>
                      ) : null}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <NavDropdownTrigger>Calculators</NavDropdownTrigger>
              <DropdownMenuContent
                align="start"
                className="max-h-[70vh] w-[min(90vw,28rem)] overflow-y-auto p-2"
              >
                <DropdownMenuLabel>Calculators</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/all-calculators">All calculators</Link>
                </DropdownMenuItem>
                {isHome ? (
                  <DropdownMenuItem
                    onSelect={() => {
                      onNavigate('calculators')
                      window.location.hash = 'calculators'
                    }}
                  >
                    Homepage calculator grid
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuSeparator />
                <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
                  {navCalculators.map((c) => (
                    <DropdownMenuItem key={c.id} asChild className="cursor-pointer">
                      <Link href={c.path} className="truncate">
                        {c.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <NavDropdownTrigger>Learn</NavDropdownTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {LEARN_LINKS.map((l) => (
                  <DropdownMenuItem key={l.href} asChild>
                    <Link href={l.href}>{l.label}</Link>
                  </DropdownMenuItem>
                ))}
                {isHome ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => {
                        onNavigate('tutorials')
                        window.location.hash = 'tutorials'
                      }}
                    >
                      Tutorials on this page
                    </DropdownMenuItem>
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <NavDropdownTrigger>Community</NavDropdownTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {COMMUNITY_LINKS.map((l) => (
                  <DropdownMenuItem key={l.href} asChild>
                    <Link href={l.href}>{l.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/blog"
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname.startsWith('/blog')
                  ? 'bg-muted text-foreground'
                  : 'text-foreground/90 hover:bg-muted/80'
              )}
            >
              Blog
            </Link>
            <Link
              href="/about"
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname === '/about'
                  ? 'bg-muted text-foreground'
                  : 'text-foreground/90 hover:bg-muted/80'
              )}
            >
              About
            </Link>
          </nav>

          <button
            type="button"
            className="rounded-md p-2 hover:bg-muted/80 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label="Open navigation menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>

        <div
          id="mobile-menu"
          role="navigation"
          aria-label="Mobile navigation"
          hidden={!mobileOpen}
          className="border-t border-border/60 py-4 lg:hidden"
        >
            <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto text-sm">
              <div>
                <p className="mb-2 font-semibold text-muted-foreground">Tools</p>
                <div className="flex flex-col gap-1 pl-2">
                  <Link
                    href="/tools"
                    className="py-1 text-foreground hover:text-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    All tools
                  </Link>
                  {toolsLinks.map((t) => (
                    <Link
                      key={t.path}
                      href={t.path}
                      className="flex flex-wrap items-center gap-2 py-1 text-foreground hover:text-primary"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span>{t.title}</span>
                      {t.path === '/tools/timestamp-debugger' ? (
                        <span className="rounded bg-terminal-green px-1.5 py-0.5 font-mono text-xs text-terminal-bg">
                          NEW
                        </span>
                      ) : null}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-muted-foreground">Calculators</p>
                <div className="flex flex-col gap-1 pl-2">
                  <Link
                    href="/all-calculators"
                    className="py-1 text-foreground hover:text-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    All calculators
                  </Link>
                  {isHome ? (
                    <button
                      type="button"
                      className="py-1 text-left text-foreground hover:text-primary"
                      onClick={() => {
                        onNavigate('calculators')
                        window.location.hash = 'calculators'
                        setMobileOpen(false)
                      }}
                    >
                      Homepage calculator grid
                    </button>
                  ) : null}
                  {navCalculators.slice(0, 12).map((c) => (
                    <Link
                      key={c.id}
                      href={c.path}
                      className="py-1 text-foreground hover:text-primary"
                      onClick={() => setMobileOpen(false)}
                    >
                      {c.title}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-muted-foreground">Learn</p>
                <div className="flex flex-col gap-1 pl-2">
                  {LEARN_LINKS.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="py-1 text-foreground hover:text-primary"
                      onClick={() => setMobileOpen(false)}
                    >
                      {l.label}
                    </Link>
                  ))}
                  {isHome ? (
                    <button
                      type="button"
                      className="py-1 text-left text-foreground hover:text-primary"
                      onClick={() => {
                        onNavigate('tutorials')
                        window.location.hash = 'tutorials'
                        setMobileOpen(false)
                      }}
                    >
                      Tutorials on this page
                    </button>
                  ) : null}
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-muted-foreground">Community</p>
                <div className="flex flex-col gap-1 pl-2">
                  {COMMUNITY_LINKS.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="py-1 text-foreground hover:text-primary"
                      onClick={() => setMobileOpen(false)}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 border-t border-border/60 pt-3">
                <Link
                  href="/blog"
                  className="font-medium text-foreground hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  href="/about"
                  className="font-medium text-foreground hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  About
                </Link>
              </div>
            </div>
        </div>
      </div>
    </header>
  )
}
