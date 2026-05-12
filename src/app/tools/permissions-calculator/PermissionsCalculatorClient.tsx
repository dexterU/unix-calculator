'use client'

import { useCallback, useMemo, useState } from 'react'
import {
  CheckCircle,
  Copy,
  File,
  Folder,
  Shield,
  Terminal,
} from 'lucide-react'
import { Header } from '@/components/Header'
import { RelatedGuides } from '@/components/RelatedGuides'
import { AdUnit } from '@/components/AdUnit'
import { getRelatedGuides } from '@/lib/related-guides'

type PermissionBit = {
  read: boolean
  write: boolean
  execute: boolean
}

type Permissions = {
  owner: PermissionBit
  group: PermissionBit
  others: PermissionBit
  setuid: boolean
  setgid: boolean
  sticky: boolean
}

function permToOctal(p: PermissionBit): number {
  return (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0)
}

function permToSymbolic(p: PermissionBit, _isExecute?: boolean): string {
  return (
    (p.read ? 'r' : '-') + (p.write ? 'w' : '-') + (p.execute ? 'x' : '-')
  )
}

function octalToNumeric(perms: Permissions): string {
  const special =
    (perms.setuid ? 4 : 0) + (perms.setgid ? 2 : 0) + (perms.sticky ? 1 : 0)
  const owner = permToOctal(perms.owner)
  const group = permToOctal(perms.group)
  const others = permToOctal(perms.others)
  if (special > 0) {
    return `${special}${owner}${group}${others}`
  }
  return `${owner}${group}${others}`
}

function toSymbolicFull(perms: Permissions, isDir: boolean): string {
  const type = isDir ? 'd' : '-'
  const o = perms.owner
  const g = perms.group
  const ot = perms.others

  const ownerX = perms.setuid ? (o.execute ? 's' : 'S') : o.execute ? 'x' : '-'
  const groupX = perms.setgid ? (g.execute ? 's' : 'S') : g.execute ? 'x' : '-'
  const othersX = perms.sticky ? (ot.execute ? 't' : 'T') : ot.execute ? 'x' : '-'

  return (
    type +
    (o.read ? 'r' : '-') +
    (o.write ? 'w' : '-') +
    ownerX +
    (g.read ? 'r' : '-') +
    (g.write ? 'w' : '-') +
    groupX +
    (ot.read ? 'r' : '-') +
    (ot.write ? 'w' : '-') +
    othersX
  )
}

function parseNumericInput(input: string): Permissions | null {
  const clean = input.trim()
  if (!/^\d{3,4}$/.test(clean)) return null

  let special = 0
  let owner = 0
  let group = 0
  let others = 0

  if (clean.length === 4) {
    special = parseInt(clean[0], 10)
    owner = parseInt(clean[1], 10)
    group = parseInt(clean[2], 10)
    others = parseInt(clean[3], 10)
  } else {
    owner = parseInt(clean[0], 10)
    group = parseInt(clean[1], 10)
    others = parseInt(clean[2], 10)
  }

  if ([owner, group, others, special].some((n) => n > 7 || n < 0)) return null

  return {
    owner: {
      read: !!(owner & 4),
      write: !!(owner & 2),
      execute: !!(owner & 1),
    },
    group: {
      read: !!(group & 4),
      write: !!(group & 2),
      execute: !!(group & 1),
    },
    others: {
      read: !!(others & 4),
      write: !!(others & 2),
      execute: !!(others & 1),
    },
    setuid: !!(special & 4),
    setgid: !!(special & 2),
    sticky: !!(special & 1),
  }
}

/** Human chmod symbolic: u=rwx,g=rx,o=rx plus special bits */
function symbolicChmodShort(perms: Permissions): string {
  const triplet = (p: PermissionBit) =>
    (p.read ? 'r' : '') + (p.write ? 'w' : '') + (p.execute ? 'x' : '')

  let s = `u=${triplet(perms.owner)},g=${triplet(perms.group)},o=${triplet(perms.others)}`
  if (perms.setuid) s += ',u+s'
  if (perms.setgid) s += ',g+s'
  if (perms.sticky) s += ',+t'
  return s
}

const PRESETS = [
  { label: '755', desc: 'Standard file', value: '755', icon: 'file' },
  { label: '644', desc: 'Read-only file', value: '644', icon: 'file' },
  { label: '777', desc: 'Full access', value: '777', icon: 'warning' },
  { label: '700', desc: 'Private file', value: '700', icon: 'lock' },
  { label: '775', desc: 'Group writable', value: '775', icon: 'folder' },
  { label: '600', desc: 'SSH key', value: '600', icon: 'key' },
  { label: '644', desc: 'Web file', value: '644', icon: 'file' },
  { label: '1755', desc: 'Sticky + exec', value: '1755', icon: 'folder' },
] as const

const ENTITY_META = [
  { key: 'owner' as const, label: 'Owner', color: 'text-terminal-cyan' },
  { key: 'group' as const, label: 'Group', color: 'text-terminal-green' },
  { key: 'others' as const, label: 'Others', color: 'text-terminal-amber' },
]

export function PermissionsCalculatorClient() {
  const [perms, setPerms] = useState<Permissions>({
    owner: { read: true, write: true, execute: true },
    group: { read: true, write: false, execute: true },
    others: { read: true, write: false, execute: true },
    setuid: false,
    setgid: false,
    sticky: false,
  })
  const [isDir, setIsDir] = useState(false)
  const [numericInput, setNumericInput] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const numeric = useMemo(() => octalToNumeric(perms), [perms])
  const symbolic = useMemo(() => toSymbolicFull(perms, isDir), [perms, isDir])
  const symShort = useMemo(() => symbolicChmodShort(perms), [perms])

  const handleNumericInput = useCallback((val: string) => {
    setNumericInput(val)
    const parsed = parseNumericInput(val)
    if (parsed) setPerms(parsed)
  }, [])

  const handlePreset = useCallback((value: string) => {
    setNumericInput(value)
    const parsed = parseNumericInput(value)
    if (parsed) setPerms(parsed)
  }, [])

  const toggleBit = useCallback(
    (entity: 'owner' | 'group' | 'others', bit: 'read' | 'write' | 'execute') => {
      setPerms((prev) => ({
        ...prev,
        [entity]: {
          ...prev[entity],
          [bit]: !prev[entity][bit],
        },
      }))
      setNumericInput('')
    },
    [],
  )

  const copy = useCallback((text: string, key: string) => {
    void navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }, [])

  const chmodNumeric = `chmod ${numeric} filename`
  const chmodSymbolic = `chmod ${symShort} filename`
  const chmodRecursive = `chmod -R ${numeric} directory/`
  const chmodFind = `find . -type f -exec chmod ${numeric} {} \\;`

  return (
    <div className="min-h-screen bg-gradient-terminal text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-terminal-border bg-terminal-surface px-3 py-1 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            <Shield className="h-3 w-3 text-terminal-green" aria-hidden="true" />
            Visual · instant · no server round-trip
          </div>
          <h1 className="mb-3 font-mono text-3xl font-bold text-foreground">
            Unix Permissions Calculator
          </h1>
          <p className="mx-auto max-w-xl text-sm text-muted-foreground">
            Build chmod permissions visually. Click to toggle bits, type a numeric value, or pick a
            common preset.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <label htmlFor="chmod-numeric" className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
              chmod value
            </label>
            <input
              id="chmod-numeric"
              value={numericInput || numeric}
              onChange={(e) => handleNumericInput(e.target.value)}
              placeholder="755"
              className="w-40 rounded-xl border-2 border-terminal-border bg-terminal-surface py-3 text-center font-mono text-3xl text-terminal-green transition-colors focus:border-terminal-green focus:outline-none"
              inputMode="numeric"
              autoComplete="off"
              aria-label="chmod numeric value (e.g. 755)"
            />
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-terminal-border bg-terminal-surface px-4 py-3">
            <button
              type="button"
              onClick={() => setIsDir(false)}
              className={
                !isDir
                  ? 'flex items-center gap-2 font-mono text-sm text-terminal-green'
                  : 'flex items-center gap-2 font-mono text-sm text-muted-foreground'
              }
            >
              <File className="h-4 w-4" aria-hidden="true" />
              File
            </button>
            <div className="h-6 w-px bg-terminal-border" />
            <button
              type="button"
              onClick={() => setIsDir(true)}
              className={
                isDir
                  ? 'flex items-center gap-2 font-mono text-sm text-terminal-green'
                  : 'flex items-center gap-2 font-mono text-sm text-muted-foreground'
              }
            >
              <Folder className="h-4 w-4" aria-hidden="true" />
              Directory
            </button>
          </div>
        </div>

        <div className="my-6 rounded-xl border border-terminal-border bg-terminal-surface p-6 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Symbolic notation
          </p>
          <div className="mb-2 flex flex-wrap items-center justify-center gap-1 font-mono text-3xl">
            <span className="text-muted-foreground">{isDir ? 'd' : '-'}</span>
            <span className="text-terminal-cyan">{symbolic.slice(1, 4)}</span>
            <span className="text-terminal-green">{symbolic.slice(4, 7)}</span>
            <span className="text-terminal-amber">{symbolic.slice(7, 10)}</span>
          </div>
          <div className="flex justify-center gap-8 font-mono text-xs text-muted-foreground">
            <span className="text-terminal-cyan">owner</span>
            <span className="text-terminal-green">group</span>
            <span className="text-terminal-amber">others</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {ENTITY_META.map(({ key, label, color }) => (
            <div key={key} className="rounded-xl border border-terminal-border bg-terminal-surface p-5">
              <div className="mb-4 flex items-center justify-between gap-2">
                <span className={`font-mono text-sm font-bold ${color}`}>{label}</span>
                <div className="text-right">
                  <span className="block font-mono text-2xl text-foreground">
                    {permToOctal(perms[key])}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {permToSymbolic(perms[key])}
                  </span>
                </div>
              </div>
              {(['read', 'write', 'execute'] as const).map((bit) => (
                <button
                  key={bit}
                  type="button"
                  onClick={() => toggleBit(key, bit)}
                  className={
                    perms[key][bit]
                      ? 'mb-2 flex w-full items-center justify-between rounded-lg border border-terminal-green/40 bg-terminal-green/10 p-3 transition-all'
                      : 'mb-2 flex w-full items-center justify-between rounded-lg border border-terminal-border bg-background p-3 transition-all hover:border-muted-foreground'
                  }
                >
                  <span
                    className={`font-mono text-lg font-bold ${
                      perms[key][bit] ? 'text-terminal-green' : 'text-muted-foreground'
                    }`}
                  >
                    {bit[0]}
                  </span>
                  <span className="font-mono text-xs capitalize text-muted-foreground">{bit}</span>
                  <span
                    className={`font-mono text-sm ${
                      perms[key][bit] ? 'text-terminal-green' : 'text-muted-foreground'
                    }`}
                  >
                    {bit === 'read' ? '4' : bit === 'write' ? '2' : '1'}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setNumericInput('')
              setPerms((p) => ({ ...p, setuid: !p.setuid }))
            }}
            className={
              perms.setuid
                ? 'flex-1 rounded-lg border border-terminal-purple/40 bg-terminal-purple/10 p-3 text-center'
                : 'flex-1 rounded-lg border border-terminal-border p-3 text-center hover:border-muted-foreground'
            }
          >
            <p
              className={`font-mono text-sm font-bold ${
                perms.setuid ? 'text-terminal-purple' : 'text-muted-foreground'
              }`}
            >
              SetUID
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">Run as owner</p>
          </button>
          <button
            type="button"
            onClick={() => {
              setNumericInput('')
              setPerms((p) => ({ ...p, setgid: !p.setgid }))
            }}
            className={
              perms.setgid
                ? 'flex-1 rounded-lg border border-terminal-purple/40 bg-terminal-purple/10 p-3 text-center'
                : 'flex-1 rounded-lg border border-terminal-border p-3 text-center hover:border-muted-foreground'
            }
          >
            <p
              className={`font-mono text-sm font-bold ${
                perms.setgid ? 'text-terminal-purple' : 'text-muted-foreground'
              }`}
            >
              SetGID
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">Group identity</p>
          </button>
          <button
            type="button"
            onClick={() => {
              setNumericInput('')
              setPerms((p) => ({ ...p, sticky: !p.sticky }))
            }}
            className={
              perms.sticky
                ? 'flex-1 rounded-lg border border-terminal-purple/40 bg-terminal-purple/10 p-3 text-center'
                : 'flex-1 rounded-lg border border-terminal-border p-3 text-center hover:border-muted-foreground'
            }
          >
            <p
              className={`font-mono text-sm font-bold ${
                perms.sticky ? 'text-terminal-purple' : 'text-muted-foreground'
              }`}
            >
              Sticky
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">Restricted delete (dirs)</p>
          </button>
        </div>

        <div className="mt-6 rounded-xl border border-terminal-border bg-terminal-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <Terminal className="h-4 w-4 text-terminal-green" aria-hidden="true" />
            <span className="font-mono text-sm font-bold text-foreground">Terminal Commands</span>
          </div>

          <div className="flex items-center justify-between border-b border-terminal-border py-3 last:border-0">
            <code className="font-mono text-sm text-terminal-green break-all">{chmodNumeric}</code>
            <button
              type="button"
              onClick={() => copy(chmodNumeric, 'numeric')}
              className="ml-2 shrink-0"
              aria-label="Copy command"
            >
              {copied === 'numeric' ? (
                <CheckCircle className="h-4 w-4 text-terminal-green" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground transition-colors hover:text-terminal-green" aria-hidden="true" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between border-b border-terminal-border py-3 last:border-0">
            <code className="font-mono text-sm text-terminal-green break-all">{chmodSymbolic}</code>
            <button
              type="button"
              onClick={() => copy(chmodSymbolic, 'symbolic')}
              className="ml-2 shrink-0"
              aria-label="Copy symbolic chmod"
            >
              {copied === 'symbolic' ? (
                <CheckCircle className="h-4 w-4 text-terminal-green" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground transition-colors hover:text-terminal-green" aria-hidden="true" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between border-b border-terminal-border py-3 last:border-0">
            <code className="font-mono text-sm text-terminal-green break-all">{chmodRecursive}</code>
            <button
              type="button"
              onClick={() => copy(chmodRecursive, 'recursive')}
              className="ml-2 shrink-0"
              aria-label="Copy recursive chmod"
            >
              {copied === 'recursive' ? (
                <CheckCircle className="h-4 w-4 text-terminal-green" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground transition-colors hover:text-terminal-green" aria-hidden="true" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <code className="font-mono text-sm text-terminal-green break-all">{chmodFind}</code>
            <button
              type="button"
              onClick={() => copy(chmodFind, 'find')}
              className="ml-2 shrink-0"
              aria-label="Copy find chmod"
            >
              {copied === 'find' ? (
                <CheckCircle className="h-4 w-4 text-terminal-green" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground transition-colors hover:text-terminal-green" aria-hidden="true" />
              )}
            </button>
          </div>

          {numeric === '777' ? (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-950/30 p-4">
              <p className="font-mono text-xs text-red-400">
                ⚠️ chmod 777 grants full access to ALL users. Never use on production servers — it is a
                critical security vulnerability.
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-6">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Common Presets
          </p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {PRESETS.map((preset) => (
              <button
                key={preset.label + preset.desc}
                type="button"
                onClick={() => handlePreset(preset.value)}
                className="group rounded-lg border border-terminal-border bg-terminal-surface p-3 text-left transition-colors hover:border-terminal-green"
              >
                <p className="font-mono text-lg font-bold text-terminal-green group-hover:text-terminal-green">
                  {preset.label}
                </p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{preset.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <section className="mt-16 border-t border-terminal-border pt-12">
          <div className="mb-8 rounded-r-xl border-l-4 border-terminal-green bg-terminal-surface p-5">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-terminal-green">
              Quick answer
            </p>
            <p className="text-sm leading-relaxed text-foreground">
              Unix permissions use a 3-digit octal number where each digit represents owner, group, and
              others. Each digit is the sum of: read (4) + write (2) + execute (1). So 755 = owner:rwx
              (7), group:r-x (5), others:r-x (5).
            </p>
          </div>

          <h2 className="mb-4 font-mono text-xl font-bold text-foreground">
            Unix permission bits explained
          </h2>
          <div className="mb-8 overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="border-b border-terminal-border">
                  <th className="py-2 text-left text-muted-foreground">Value</th>
                  <th className="py-2 text-left text-muted-foreground">Binary</th>
                  <th className="py-2 text-left text-muted-foreground">Permission</th>
                  <th className="py-2 text-left text-muted-foreground">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['0', '000', '---', 'No permissions'],
                  ['1', '001', '--x', 'Execute only'],
                  ['2', '010', '-w-', 'Write only'],
                  ['3', '011', '-wx', 'Write + execute'],
                  ['4', '100', 'r--', 'Read only'],
                  ['5', '101', 'r-x', 'Read + execute'],
                  ['6', '110', 'rw-', 'Read + write'],
                  ['7', '111', 'rwx', 'Full permissions'],
                ].map(([v, bin, sym, mean]) => (
                  <tr key={v} className="border-b border-terminal-border/50">
                    <td className="py-2 text-terminal-amber">{v}</td>
                    <td className="py-2 text-muted-foreground">{bin}</td>
                    <td className="py-2 text-terminal-cyan">{sym}</td>
                    <td className="py-2 text-muted-foreground">{mean}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mb-4 font-mono text-xl font-bold text-foreground">Common chmod values</h2>
          <div className="mb-8 overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="border-b border-terminal-border">
                  <th className="py-2 text-left text-muted-foreground">chmod</th>
                  <th className="py-2 text-left text-muted-foreground">Symbolic</th>
                  <th className="py-2 text-left text-muted-foreground">Use case</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['755', 'rwxr-xr-x', 'Directories, executables'],
                  ['644', 'rw-r--r--', 'Regular files, web files'],
                  ['600', 'rw-------', 'SSH private keys'],
                  ['700', 'rwx------', 'Private directories'],
                  ['777', 'rwxrwxrwx', '⚠️ Avoid — full access'],
                  ['400', 'r--------', 'Read-only, backups'],
                  ['775', 'rwxrwxr-x', 'Group collaboration'],
                  ['440', 'r--r-----', 'Shared read-only files'],
                ].map(([c, s, u]) => (
                  <tr key={c} className="border-b border-terminal-border/50">
                    <td className="py-2 text-terminal-green">{c}</td>
                    <td className="py-2 text-terminal-cyan">{s}</td>
                    <td className="py-2 text-muted-foreground">{u}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mb-4 font-mono text-xl font-bold text-foreground">chmod command examples</h2>
          <div className="mb-8 rounded-lg border border-terminal-border bg-background p-4">
            <pre className="overflow-x-auto font-mono text-xs text-cyan-400 whitespace-pre">{`chmod 755 script.sh      # make executable
chmod 600 ~/.ssh/id_rsa  # secure SSH key
chmod -R 755 /var/www/   # recursive on directory
chmod +x script.sh       # add execute for all
chmod u+w,g-w file.txt   # symbolic modification
chmod =644 file.txt      # set exact permissions`}</pre>
          </div>

          <h2 className="mb-4 font-mono text-xl font-bold text-foreground">How to check file permissions</h2>
          <div className="mb-8 rounded-lg border border-terminal-border bg-background p-4">
            <pre className="overflow-x-auto font-mono text-xs text-cyan-400 whitespace-pre">{`ls -la filename          # show permissions
stat filename            # detailed file info
find . -perm 777         # find files with specific perms
find . -perm /111        # find executable files`}</pre>
          </div>

          <h2 className="mb-4 font-mono text-xl font-bold text-foreground">Special permission bits</h2>
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              <span className="font-mono text-terminal-purple">SetUID</span> (4000): When set on an
              executable, the process runs with the <strong className="text-foreground">owner</strong>{' '}
              user&apos;s effective UID — classic example: <code className="text-terminal-green">passwd</code>{' '}
              must write shadow files owned by root while invoked by normal users.
            </p>
            <p>
              <span className="font-mono text-terminal-purple">SetGID</span> (2000): For executables,
              runs with the group&apos;s GID; for directories, new files inherit the directory&apos;s
              group (useful for team-shared folders).
            </p>
            <p>
              <span className="font-mono text-terminal-purple">Sticky bit</span> (1000): On directories
              (e.g. <code className="text-terminal-green">/tmp</code>), only the file owner, directory
              owner, or root may remove or rename files — not everyone with write access.
            </p>
          </div>
        </section>

        <AdUnit slot="3915656904" format="horizontal" className="my-8" />

        <RelatedGuides guides={getRelatedGuides('permissions-calculator')} />
      </main>
    </div>
  )
}
