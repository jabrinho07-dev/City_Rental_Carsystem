export function FleetPerformance({ fleet }) {
  return (
    <div className="space-y-4">
      <p className="text-caption text-muted">
        Vehicle status is the current fleet status, not a historical snapshot. Booking counts use bookings created in the period and exclude cancelled and rejected bookings. Maintenance cost includes completed jobs with no linked expense, so a linked expense is not counted here as well.
      </p>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          ['Total vehicles', fleet?.total],
          ['Available', fleet?.available],
          ['Reserved', fleet?.reserved],
          ['Rented', fleet?.rented],
          ['Under maintenance', fleet?.maintenance],
          ['Inactive', fleet?.inactive],
        ].map(([label, value]) => (
          <div key={label} className="rounded-md border border-border px-3 py-2">
            <dt className="text-caption text-muted">{label}</dt>
            <dd className="text-h3 text-foreground">{value ?? 0}</dd>
          </div>
        ))}
      </dl>
      {fleet?.vehicles?.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] border-collapse text-left">
            <caption className="sr-only">Bookings and unlinked maintenance cost by vehicle</caption>
            <thead className="text-caption font-semibold text-muted">
              <tr>
                {['Vehicle', 'Status', 'Bookings', 'Unlinked maintenance cost'].map((heading) => (
                  <th key={heading} scope="col" className="px-2 py-2 font-semibold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fleet.vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-t border-border text-small">
                  <th scope="row" className="px-2 py-2 font-semibold text-foreground">{vehicle.name}</th>
                  <td className="px-2 py-2">{vehicle.status}</td>
                  <td className="px-2 py-2">{vehicle.bookings}</td>
                  <td className="px-2 py-2">{vehicle.maintenanceCost.toFixed(2)} USD</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="text-small text-muted">No vehicles are in the fleet.</p>}
    </div>
  )
}
