import { LoaderCircle } from 'lucide-react'

const sizes = { sm: 16, md: 20, lg: 28 }

export function Spinner({ size = 'md', label = 'Loading' }) {
  return <LoaderCircle className="animate-spin text-primary" size={sizes[size] || size} aria-label={label} />
}
