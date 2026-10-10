export const dashboardStats = {
  totalVehicles: { value: 120, note: 'Sample fleet size' },
  available: { value: 78, note: '65% of fleet' },
  rented: { value: 28, note: 'Currently out' },
  reserved: { value: 10, note: 'Held for pickup' },
  maintenance: { value: 4, note: 'Off the road' },
  totalCustomers: { value: 1250, note: 'Sample directory' },
  pendingBookings: { value: 18, note: 'Awaiting confirmation' },
  todaysRentals: { value: 6, note: 'Sample desk count' },
  monthlyRevenue: { value: 45800, money: true, note: 'Sample trend · +12.5% this month' },
  outstandingPayments: { value: 6420, money: true, note: 'Sample balance' },
}

export const revenueDatasets = {
  '7d': [
    { label: 'Mon', amount: 1200 },
    { label: 'Tue', amount: 980 },
    { label: 'Wed', amount: 1460 },
    { label: 'Thu', amount: 1320 },
    { label: 'Fri', amount: 1680 },
    { label: 'Sat', amount: 2100 },
    { label: 'Sun', amount: 1540 },
  ],
  '30d': [
    { label: 'Week 1', amount: 8200 },
    { label: 'Week 2', amount: 9100 },
    { label: 'Week 3', amount: 10400 },
    { label: 'Week 4', amount: 11200 },
  ],
  '6m': [
    { label: 'May', amount: 31000 },
    { label: 'Jun', amount: 34000 },
    { label: 'Jul', amount: 39000 },
    { label: 'Aug', amount: 42000 },
    { label: 'Sep', amount: 45000 },
    { label: 'Oct', amount: 45800 },
  ],
  '1y': [
    { label: 'Jan', amount: 18000 },
    { label: 'Feb', amount: 22000 },
    { label: 'Mar', amount: 25000 },
    { label: 'Apr', amount: 27000 },
    { label: 'May', amount: 31000 },
    { label: 'Jun', amount: 34000 },
    { label: 'Jul', amount: 39000 },
    { label: 'Aug', amount: 42000 },
    { label: 'Sep', amount: 45000 },
    { label: 'Oct', amount: 45800 },
    { label: 'Nov', amount: 43000 },
    { label: 'Dec', amount: 47000 },
  ],
}

export const bookingStatusData = [
  { status: 'Pending', count: 18 },
  { status: 'Confirmed', count: 42 },
  { status: 'Active', count: 16 },
  { status: 'Completed', count: 86 },
  { status: 'Cancelled', count: 9 },
]

export const vehicleAvailabilityData = [
  { status: 'Available', count: 78 },
  { status: 'Reserved', count: 10 },
  { status: 'Rented', count: 28 },
  { status: 'Maintenance', count: 4 },
  { status: 'Inactive', count: 2 },
]

export const recentBookings = [
  {
    id: 'CR-2026-0001',
    customer: 'Ahmed Ali',
    vehicle: 'Toyota Prado',
    pickupDate: '2026-10-10',
    returnDate: '2026-10-13',
    amount: 270,
    status: 'Confirmed',
  },
  {
    id: 'CR-2026-0012',
    customer: 'Amina Hassan',
    vehicle: 'Toyota Land Cruiser',
    pickupDate: '2026-10-11',
    returnDate: '2026-10-14',
    amount: 540,
    status: 'Active',
  },
  {
    id: 'CR-2026-0009',
    customer: 'Hassan Noor',
    vehicle: 'Hyundai Tucson',
    pickupDate: '2026-10-08',
    returnDate: '2026-10-12',
    amount: 240,
    status: 'Pending',
  },
  {
    id: 'CR-2026-0007',
    customer: 'Fatima Yusuf',
    vehicle: 'Toyota Corolla',
    pickupDate: '2026-10-02',
    returnDate: '2026-10-05',
    amount: 120,
    status: 'Completed',
  },
  {
    id: 'CR-2026-0004',
    customer: 'Omar Farah',
    vehicle: 'Mercedes-Benz E-Class',
    pickupDate: '2026-10-15',
    returnDate: '2026-10-18',
    amount: 390,
    status: 'Reserved',
  },
  {
    id: 'CR-2026-0003',
    customer: 'Hodan Warsame',
    vehicle: 'Toyota Hiace',
    pickupDate: '2026-09-28',
    returnDate: '2026-09-30',
    amount: 160,
    status: 'Cancelled',
  },
]

export const recentCustomers = [
  {
    id: 'customer-014',
    name: 'Ahmed Ali',
    email: 'ahmed.ali@example.com',
    phone: '+252 61 555 0142',
    bookings: 4,
    joined: '2026-09-12',
    status: 'Active',
  },
  {
    id: 'customer-013',
    name: 'Amina Hassan',
    email: 'amina.hassan@example.com',
    phone: '+252 61 555 0188',
    bookings: 2,
    joined: '2026-09-20',
    status: 'Active',
  },
  {
    id: 'customer-011',
    name: 'Hassan Noor',
    email: 'hassan.noor@example.com',
    phone: '+252 61 555 0110',
    bookings: 1,
    joined: '2026-08-02',
    status: 'Inactive',
  },
  {
    id: 'customer-009',
    name: 'Fatima Yusuf',
    email: 'fatima.yusuf@example.com',
    phone: '+252 61 555 0094',
    bookings: 6,
    joined: '2026-06-18',
    status: 'Active',
  },
  {
    id: 'customer-006',
    name: 'Omar Farah',
    email: 'omar.farah@example.com',
    phone: '+252 61 555 0061',
    bookings: 0,
    joined: '2026-05-03',
    status: 'Blocked',
  },
]

export const recentActivity = [
  {
    id: 'activity-001',
    description: 'New booking CR-2026-0012 created',
    time: '12 minutes ago',
    status: 'Booking',
  },
  {
    id: 'activity-002',
    description: 'Payment received for CR-2026-0009',
    time: '1 hour ago',
    status: 'Payment',
  },
  {
    id: 'activity-003',
    description: 'Toyota Prado marked as Maintenance',
    time: '3 hours ago',
    status: 'Vehicle',
  },
  {
    id: 'activity-004',
    description: 'New customer registered',
    time: 'Yesterday',
    status: 'Customer',
  },
  {
    id: 'activity-005',
    description: 'Booking CR-2026-0007 completed',
    time: 'Yesterday',
    status: 'Booking',
  },
]

export const headerNotices = [
  { id: 'notice-001', title: '18 bookings are waiting for confirmation', time: 'Today' },
  { id: 'notice-002', title: '4 vehicles are in maintenance', time: 'Today' },
  { id: 'notice-003', title: 'Sample revenue report is ready to review', time: 'Yesterday' },
]
