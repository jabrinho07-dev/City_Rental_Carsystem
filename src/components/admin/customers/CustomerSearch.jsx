export function CustomerSearch({ value, onChange }) {
  return (
    <label className="block text-small font-medium text-foreground" htmlFor="customer-search">
      Search customers
      <input
        id="customer-search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Name, email, phone, or ID"
        className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3 text-small text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />
    </label>
  )
}
