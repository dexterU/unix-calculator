// Inlines transformed _lovable_pages source into src/app Client.tsx files
import fs from 'fs'
import path from 'path'

const root = path.resolve(process.cwd())

function walkClientFiles(dir, acc = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name)
    if (name.isDirectory()) walkClientFiles(p, acc)
    else if (name.name.endsWith('Client.tsx')) acc.push(p)
  }
  return acc
}
const appDir = path.join(root, 'src', 'app')
const lovableDir = path.join(root, 'src', '_lovable_pages')

function resolveReExport(text, fromFile) {
  const trimmed = text.trim()
  const m = trimmed.match(
    /^export\s+\{\s*default\s*\}\s+from\s+['"](\.\/[^'"]+)['"]\s*;?\s*$/m
  )
  if (!m) return { text, file: fromFile }
  const next = path.normalize(path.join(path.dirname(fromFile), m[1]))
  if (!next.endsWith('.tsx') && !next.endsWith('.ts')) {
    const tryTsx = next + '.tsx'
    if (fs.existsSync(tryTsx)) {
      return resolveReExport(fs.readFileSync(tryTsx, 'utf8'), tryTsx)
    }
  }
  if (fs.existsSync(next)) {
    return resolveReExport(fs.readFileSync(next, 'utf8'), next)
  }
  const tryTsx = next + '.tsx'
  if (fs.existsSync(tryTsx)) {
    return resolveReExport(fs.readFileSync(tryTsx, 'utf8'), tryTsx)
  }
  return { text, file: fromFile }
}

function rewriteRelativeImports(content, lovableFilePath) {
  const dir = path.dirname(lovableFilePath)
  return content.replace(
    /from\s+['"](\.\.?\/[^'"]+)['"]/g,
    (full, rel) => {
      const resolved = path.normalize(path.join(dir, rel))
      const withTsx =
        resolved.endsWith('.tsx') || resolved.endsWith('.ts')
          ? resolved
          : resolved + '.tsx'
      const finalPath = fs.existsSync(resolved)
        ? resolved
        : fs.existsSync(withTsx)
          ? withTsx
          : resolved
      if (!finalPath.startsWith(lovableDir)) return full
      const relLov = path.relative(lovableDir, finalPath).split(path.sep).join('/')
      return `from '@/_lovable_pages/${relLov.replace(/\.tsx?$/, '')}'`
    }
  )
}

function applyTransforms(content) {
  let out = content

  out = out.replace(
    /import\s+[^;]*\buseCanonical\b[^;]*from\s+['"][^'"]+['"]\s*;?\s*\n?/g,
    ''
  )
  out = out.replace(/\buseCanonical\s*\([^)]*\)\s*;?\s*\n?/g, '')

  out = out.replace(/^\s*document\.title\s*=[^\n]+\n?/gm, '')
  out = out.replace(/^\s*document\.querySelector\s*\(\s*['"]meta[^)]+\)[^\n]*\n?/gm, '')

  out = out.replace(
    /import\s*\{\s*Link\s*\}\s*from\s+['"]react-router-dom['"]/g,
    "import Link from 'next/link'"
  )
  out = out.replace(/<Link\s+to=/g, '<Link href=')

  if (/useNavigate/.test(out)) {
    out = out.replace(
      /import\s*\{([^}]+)\}\s*from\s+['"]react-router-dom['"]\s*;?\s*\n?/g,
      (full, inner) => {
        const parts = inner
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s && !/\buseNavigate\b/.test(s))
        const line =
          parts.length > 0
            ? `import { ${parts.join(', ')} } from 'react-router-dom'\n`
            : ''
        return `${line}import { useRouter } from 'next/navigation'\n`
      }
    )
    out = out.replace(/\bconst\s+navigate\s*=\s*useNavigate\s*\(\s*\)\s*;?\s*\n?/g, '')
    out = out.replace(/\bnavigate\s*\(/g, 'router.push(')
  }

  out = out.replace(
    /import\s+(\w+)\s+from\s+['"]@monaco-editor\/react['"]\s*;?\s*\n?/g,
    (_, name) =>
      `import dynamic from 'next/dynamic'\nconst ${name} = dynamic(() => import('@monaco-editor/react'), { ssr: false })\n`
  )

  if (out.includes('router.push(') && !/useRouter\s*\(/.test(out)) {
    if (!out.includes("from 'next/navigation'")) {
      out = out.replace(
        /^(import .+from\s+['"]react['"]\s*;?\s*\n)/m,
        "$1import { useRouter } from 'next/navigation'\n"
      )
    }
    out = out.replace(
      /(export default function \w+(?:<[^>]+>)?\([^)]*\)\s*\{)/,
      '$1\n  const router = useRouter()'
    )
  }

  return out
}

function stripTsNocheck(content) {
  return content.replace(/^\/\/\s*@ts-nocheck\s*\n?/m, '')
}

function normalizeUseClient(content) {
  let c = content.replace(/^'use client'\s*;?\s*\n?/m, '')
  c = c.trimStart()
  return `'use client'\n\n${c}`
}

function renameExport(content, exportName) {
  if (/export default function/.test(content)) {
    return content.replace(
      /export default function\s+(\w+)/,
      `export default function ${exportName}`
    )
  }
  if (/export function UnixTimestampConverterPage/.test(content)) {
    return content
      .replace(
        /export function UnixTimestampConverterPage/,
        `export default function ${exportName}`
      )
  }
  const named = content.match(/export function\s+(\w+)\s*\(/)
  if (named) {
    return content.replace(
      new RegExp(`export function\\s+${named[1]}\\s*\\(`),
      `export default function ${exportName}(`
    )
  }
  return content
}

function getLovablePathForClient(clientPath, importMatch) {
  const rel = importMatch[1]
  if (rel.endsWith('/Index') || rel === 'Index') {
    return path.join(lovableDir, 'HomePage.tsx')
  }
  let p = path.join(lovableDir, rel + '.tsx')
  if (!fs.existsSync(p)) {
    p = path.join(lovableDir, rel + '.ts')
  }
  return p
}

function main() {
  const all = walkClientFiles(appDir)
  const clients = all.filter(
    (p) => !p.endsWith(`${path.sep}login${path.sep}LoginClient.tsx`)
  )

  for (const clientFull of clients) {
    const rel = path.relative(appDir, clientFull).split(path.sep).join('/')
    const baseName = path.basename(rel, '.tsx')
    const clientSrc = fs.readFileSync(clientFull, 'utf8')
    const importMatch = clientSrc.match(
      /from\s+['"]@\/_lovable_pages\/([^'"]+)['"]/
    )
    if (!importMatch) {
      console.warn('Skip (no @/_lovable_pages import):', rel)
      continue
    }

    let lovablePath = getLovablePathForClient(clientFull, importMatch)
    if (rel.includes('timestamp-converter/TimestampConverterPageClient')) {
      lovablePath = path.join(
        lovableDir,
        'tools',
        'UnixTimestampConverterPage.tsx'
      )
    }

    if (!fs.existsSync(lovablePath)) {
      console.error('Missing lovable file:', lovablePath, 'for', rel)
      process.exitCode = 1
      continue
    }

    let { text, file } = resolveReExport(
      fs.readFileSync(lovablePath, 'utf8'),
      lovablePath
    )

    text = stripTsNocheck(text)
    text = rewriteRelativeImports(text, file)
    text = applyTransforms(text)
    text = normalizeUseClient(text)
    text = renameExport(text, baseName)

    fs.writeFileSync(clientFull, text, 'utf8')
    console.log('OK', rel)
  }
}

main()
