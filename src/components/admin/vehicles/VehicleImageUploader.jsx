import { useState } from 'react'
import { X } from 'lucide-react'
import { Field } from '@/components/ui/Field'

const accepted = ['image/jpeg', 'image/png', 'image/webp']
const maxBytes = 2 * 1024 * 1024

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Could not read that image.'))
    reader.readAsDataURL(file)
  })
}

export function VehicleImageUploader({ images, onChange, error }) {
  const [message, setMessage] = useState('')

  async function onSelect(event) {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    const next = [...images]
    const problems = []
    for (const file of files) {
      if (!accepted.includes(file.type)) {
        problems.push(`${file.name} must be a JPG, PNG, or WebP image.`)
        continue
      }
      if (file.size > maxBytes) {
        problems.push(`${file.name} is larger than 2 MB.`)
        continue
      }
      if (next.length >= 6) {
        problems.push('You can add up to 6 images.')
        break
      }
      next.push(await readFile(file))
    }
    setMessage(problems.join(' '))
    onChange(next)
  }

  return (
    <Field id="vehicle-images" label="Images" error={error} hint="JPG, PNG, or WebP. Up to 6 images, 2 MB each. Photos stay in this browser.">
      {(describedBy) => (
        <div>
          <input
            id="vehicle-images"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            aria-describedby={describedBy}
            className="block w-full text-small text-muted file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-small file:font-semibold file:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            onChange={onSelect}
          />
          {message ? (
            <p className="mt-2 text-caption text-danger" role="alert">
              {message}
            </p>
          ) : null}
          {images.length ? (
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {images.map((image, index) => (
                <li key={`${index}-${image.slice(0, 24)}`} className="relative overflow-hidden rounded-md border border-border">
                  <img src={image} alt="" className="h-28 w-full object-cover" />
                  <button
                    type="button"
                    className="absolute top-2 right-2 grid size-8 place-items-center rounded-md bg-surface text-foreground shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    aria-label={`Remove image ${index + 1}`}
                    onClick={() => onChange(images.filter((_, imageIndex) => imageIndex !== index))}
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
    </Field>
  )
}
