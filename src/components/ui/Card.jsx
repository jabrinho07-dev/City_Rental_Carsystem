import { cn } from '@/utils/cn'

export function Card({ className, children, as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={cn('rounded-lg border border-border bg-surface p-5 shadow-card transition duration-150', className)}
      {...props}
    >
      {children}
    </Tag>
  )
}
