export function ExpenseCategoryBadge({ category }) {
  return (
    <span className="inline-flex rounded-full border border-border bg-canvas px-2.5 py-1 text-caption font-semibold text-foreground">
      {category}
    </span>
  )
}
