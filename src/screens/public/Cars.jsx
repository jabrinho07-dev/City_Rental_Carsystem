import { SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from '@/lib/router'
import { Container } from '@/components/common/Container'
import { ActiveFilters } from '@/components/fleet/ActiveFilters'
import { FleetResultsHeader } from '@/components/fleet/FleetResultsHeader'
import { VehicleEmptyState } from '@/components/fleet/VehicleEmptyState'
import { VehicleFilters } from '@/components/fleet/VehicleFilters'
import { FleetPagination, VehicleGrid } from '@/components/fleet/VehicleGrid'
import { VehicleSort } from '@/components/fleet/VehicleSort'
import { VehicleSearch } from '@/components/forms/VehicleSearch'
import { FleetHero } from '@/components/sections/FleetHero'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { mockVehicles } from '@/constants/mockVehicles'
import { filterVehicles, paginateVehicles, readFleetQuery, writeFleetQuery } from '@/utils/fleetQuery'

const emptyFilters = {
  category: '',
  transmission: '',
  fuel: '',
  seats: '',
  availability: '',
  minPrice: '',
  maxPrice: '',
}

export default function Cars() {
  const [params, setParams] = useSearchParams()
  const query = useMemo(() => readFleetQuery(params), [params])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [draft, setDraft] = useState(query)
  const filtered = useMemo(() => filterVehicles(mockVehicles, query), [query])
  const { items, currentPage, pageCount } = paginateVehicles(filtered, query.page)

  useEffect(() => {
    if (query.page !== currentPage) {
      setParams(writeFleetQuery(query, { page: currentPage }, { resetPage: false }), { replace: true })
    }
  }, [currentPage, query, setParams])

  function update(updates, options) {
    setParams(writeFleetQuery(query, updates, options), { replace: true })
  }

  function clearFilters() {
    update({ search: '', ...emptyFilters, page: 1 }, { resetPage: false })
    setDraft((current) => ({ ...current, search: '', ...emptyFilters }))
    setFiltersOpen(false)
  }

  function removeFilter(key) {
    if (key === 'price') {
      update({ minPrice: '', maxPrice: '' })
      return
    }
    update({ [key]: '' })
  }

  function openFilters() {
    setDraft(query)
    setFiltersOpen(true)
  }

  function applyDraft() {
    update({
      category: draft.category,
      transmission: draft.transmission,
      fuel: draft.fuel,
      seats: draft.seats,
      availability: draft.availability,
      minPrice: draft.minPrice,
      maxPrice: draft.maxPrice,
    })
    setFiltersOpen(false)
  }

  return (
    <>
      <FleetHero />
      <Container className="py-8 sm:py-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
          <aside className="hidden lg:block lg:sticky lg:top-24">
            <Card>
              <h2 className="text-h3 text-foreground">Filters</h2>
              <div className="mt-4">
                <VehicleFilters
                  values={query}
                  onChange={(key, value) => update({ [key]: value })}
                />
              </div>
              <Button type="button" variant="ghost" className="mt-4 w-full" onClick={clearFilters}>
                Clear Filters
              </Button>
            </Card>
          </aside>

          <div className="min-w-0 space-y-5">
            <VehicleSearch value={query.search} onChange={(search) => update({ search })} />

            <div className="grid grid-cols-2 items-end gap-2 lg:hidden">
              <Button type="button" variant="outline" icon={SlidersHorizontal} aria-haspopup="dialog" aria-expanded={filtersOpen} onClick={openFilters}>
                Filters
              </Button>
              <VehicleSort id="fleet-sort-mobile" value={query.sort} onChange={(sort) => update({ sort })} />
            </div>

            <ActiveFilters query={query} onRemove={removeFilter} onClear={clearFilters} />
            <FleetResultsHeader count={filtered.length} sort={query.sort} onSort={(sort) => update({ sort })} />

            {items.length > 0 ? (
              <VehicleGrid vehicles={items} />
            ) : (
              <VehicleEmptyState onClear={clearFilters} />
            )}

            <FleetPagination page={currentPage} pageCount={pageCount} onPage={(page) => update({ page }, { resetPage: false })} />
          </div>
        </div>
      </Container>

      <Modal open={filtersOpen} title="Filters" onClose={() => setFiltersOpen(false)}>
        <div className="max-h-[65vh] overflow-y-auto pr-1 text-foreground">
          <VehicleFilters
            idPrefix="mobile-fleet"
            values={draft}
            onChange={(key, value) => setDraft((current) => ({ ...current, [key]: value }))}
          />
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Button type="button" variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
          <Button type="button" onClick={applyDraft}>
            Apply Filters
          </Button>
        </div>
      </Modal>
    </>
  )
}
