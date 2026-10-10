import fs from 'node:fs'
import path from 'node:path'

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const file = path.join(dir, name)
    if (fs.statSync(file).isDirectory()) {
      walk(file)
      continue
    }
    if (!/\.(js|jsx)$/.test(name)) continue
    const current = fs.readFileSync(file, 'utf8')
    const next = current
      .replaceAll("from 'react-router-dom'", "from '@/lib/router'")
      .replace('baseURL: import.meta.env.VITE_API_URL', 'baseURL: process.env.NEXT_PUBLIC_API_URL || "/api"')
    if (next !== current) fs.writeFileSync(file, next)
  }
}

walk(path.resolve('src'))
