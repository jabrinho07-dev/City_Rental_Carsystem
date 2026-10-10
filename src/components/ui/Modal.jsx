import { X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'

export function Modal({ open, title, children, onClose }) {
  const titleId = useId()
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    function onKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    dialogRef.current?.focus()

    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button type="button" className="absolute inset-0 bg-primary/50" aria-label="Close dialog" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="fade-up relative z-10 w-full max-w-lg rounded-xl bg-surface p-6 shadow-modal outline-none"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-h3 text-foreground">
            {title}
          </h2>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-md text-muted hover:bg-canvas hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="Close"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-4 text-small text-muted">{children}</div>
      </div>
    </div>
  )
}
