import corollaImage from '@/assets/cars/corolla.jpg'
import harrierImage from '@/assets/cars/harrier.jpg'
import pradoImage from '@/assets/cars/prado.jpg'
import pradoTxImage from '@/assets/cars/prado-tx.jpg'
import premioImage from '@/assets/cars/premio.jpg'
import surfImage from '@/assets/cars/surf.jpg'

export const sampleCars = [
  {
    id: 'corolla',
    name: 'Corolla',
    category: 'Sedan',
    year: 2024,
    seats: 5,
    doors: 4,
    transmission: 'Automatic',
    fuel: 'Petrol',
    luggage: 3,
    dailyRate: 45,
    status: 'Available',
    image: corollaImage,
    summary: 'A compact sedan for daily city driving and easy parking.',
  },
  {
    id: 'premio',
    name: 'Premio',
    category: 'Sedan',
    year: 2022,
    seats: 5,
    doors: 4,
    transmission: 'Automatic',
    fuel: 'Petrol',
    luggage: 3,
    dailyRate: 55,
    status: 'Available',
    image: premioImage,
    summary: 'A comfortable sedan for longer city and highway trips.',
  },
  {
    id: 'surf',
    name: 'Surf',
    category: 'SUV',
    year: 2008,
    seats: 5,
    doors: 5,
    transmission: 'Automatic',
    fuel: 'Petrol',
    luggage: 4,
    dailyRate: 70,
    status: 'Available',
    image: surfImage,
    summary: 'A rugged midsize SUV with room for luggage and higher seating.',
  },
  {
    id: 'harrier',
    name: 'Harrier',
    category: 'SUV',
    year: 2021,
    seats: 5,
    doors: 5,
    transmission: 'Automatic',
    fuel: 'Hybrid',
    luggage: 4,
    dailyRate: 95,
    status: 'Available',
    image: harrierImage,
    summary: 'A premium crossover for a quiet ride in the city or on the highway.',
  },
  {
    id: 'prado',
    name: 'Prado',
    category: 'SUV',
    year: 2018,
    seats: 7,
    doors: 5,
    transmission: 'Automatic',
    fuel: 'Diesel',
    luggage: 4,
    dailyRate: 120,
    status: 'On the road',
    image: pradoImage,
    summary: 'A seven-seat Prado for family travel and longer journeys.',
  },
  {
    id: 'prado-tx',
    name: 'Prado TX',
    category: 'Premium',
    year: 2020,
    seats: 7,
    doors: 5,
    transmission: 'Automatic',
    fuel: 'Diesel',
    luggage: 4,
    dailyRate: 145,
    status: 'Available',
    image: pradoTxImage,
    summary: 'The TX trim of the Prado, with a higher specification for executive travel.',
  },
]

export const carCategories = ['All', ...new Set(sampleCars.map((car) => car.category))]

export function findSampleCar(id) {
  return sampleCars.find((car) => car.id === id)
}

export function formatDailyRate(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}
