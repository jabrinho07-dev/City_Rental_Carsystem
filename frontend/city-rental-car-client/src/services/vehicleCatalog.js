import economyImage from '@/assets/categories/economy.jpg'
import sedanImage from '@/assets/categories/sedan.jpg'
import harrierImage from '@/assets/cars/harrier.jpg'
import pradoTxImage from '@/assets/cars/prado-tx.jpg'
import premioImage from '@/assets/cars/premio.jpg'
import surfImage from '@/assets/cars/surf.jpg'
import { mockVehicles } from '@/constants/mockVehicles'
import { vehicleFeatures } from '@/constants/vehicleOptions'

const galleryExtras = {
  'toyota-corolla': [economyImage, sedanImage, premioImage],
  'toyota-prado': [pradoTxImage],
  'toyota-land-cruiser': [surfImage],
  'hyundai-tucson': [harrierImage],
  'hyundai-santa-fe': [harrierImage],
  'mercedes-e-class': [sedanImage, premioImage],
  'mercedes-s-class': [sedanImage],
  'range-rover': [sedanImage],
  'nissan-patrol': [surfImage],
  'kia-sportage': [harrierImage],
  'lexus-lx': [sedanImage],
}

function normalizeVehicle(vehicle) {
  const extras = galleryExtras[vehicle.id] || []
  const images = vehicle.images?.length ? vehicle.images : [vehicle.image, ...extras.filter((image) => image !== vehicle.image)]

  return {
    ...vehicle,
    images,
    airConditioning: vehicle.airConditioning ?? true,
    pricePerMonth: vehicle.pricePerMonth ?? vehicle.pricePerWeek * 4,
    features: vehicle.features ?? vehicleFeatures,
  }
}

export function getVehicleById(id) {
  const vehicle = mockVehicles.find((item) => item.id === id)
  return vehicle ? normalizeVehicle(vehicle) : null
}

export function getSimilarVehicles(vehicle, limit = 4) {
  if (!vehicle) return []

  return mockVehicles
    .filter((item) => item.id !== vehicle.id && item.category === vehicle.category)
    .slice(0, limit)
    .map(normalizeVehicle)
}
