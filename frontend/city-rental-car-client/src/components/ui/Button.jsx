import { LoaderCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

const variants = {
  primary: 'bg-primary text-white hover:bg-secondary',
  secondary: 'bg-secondary text-white hover:bg-primary',
  outline: 'border border-border bg-surface text-foreground hover:bg-canvas',
  ghost: 'text-foreground hover:bg-canvas',
  danger: 'bg-danger text-white hover:bg-danger/90',
  success: 'bg-success text-white hover:bg-success/90',
  brass: 'bg-accent text-primary hover:bg-accent/90',
  light: 'bg-surface text-foreground hover:bg-canvas',
}

const sizes = {
  sm: 'h-9 px-3 text-small',
  md: 'h-11 px-4 text-small',
  lg: 'h-12 px-5 text-body',
}

export function Button({
  variant = 'primary',
  size = 'md',
  to,
  type = 'button',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className,
  children,
  ...props
}) {
  const isDisabled = disabled || loading
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60',
    variants[variant],
    sizes[size],
    className,
  )
  const iconSize = size === 'lg' ? 18 : 16
  const content = (
    <>
      {loading ? <LoaderCircle className="animate-spin" size={iconSize} aria-hidden="true" /> : null}
      {!loading && Icon && iconPosition === 'left' ? <Icon size={iconSize} aria-hidden="true" /> : null}
      {children}
      {!loading && Icon && iconPosition === 'right' ? <Icon size={iconSize} aria-hidden="true" /> : null}
    </>
  )

  if (to && !isDisabled) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} disabled={isDisabled} aria-busy={loading || undefined} {...props}>
      {content}
    </button>
  )
}
