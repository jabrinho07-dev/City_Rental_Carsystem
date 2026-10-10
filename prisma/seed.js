import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const users = [
  ['Abdi', 'Mohamed', 'customer@cityrentalcar.com', '+252 61 000 0001', 'CUSTOMER', 'Customer123!'],
  ['Amina', 'Hassan', 'staff@cityrentalcar.com', '+252 61 000 0002', 'STAFF', 'Staff123!'],
  ['Omar', 'Ali', 'admin@cityrentalcar.com', '+252 61 000 0003', 'ADMIN', 'Admin123!'],
  ['Hodan', 'Yusuf', 'superadmin@cityrentalcar.com', '+252 61 000 0004', 'SUPER_ADMIN', 'SuperAdmin123!'],
]

const vehicles = [
  ['toyota-prado', 'Toyota', 'Prado', 'SUV', 90, 'available'],
  ['toyota-land-cruiser', 'Toyota', 'Land Cruiser', '4x4', 180, 'available'],
  ['hyundai-tucson', 'Hyundai', 'Tucson', 'SUV', 60, 'available'],
  ['toyota-corolla', 'Toyota', 'Corolla', 'Economy', 40, 'available'],
  ['toyota-hiace', 'Toyota', 'Hiace', 'Van', 80, 'available'],
]

async function main() {
  for (const [firstName, lastName, email, phone, role, password] of users) {
    const passwordHash = await bcrypt.hash(password, 10)
    await prisma.user.upsert({
      where: { email },
      update: { firstName, lastName, phone, role, passwordHash },
      create: { firstName, lastName, email, phone, role, passwordHash, country: 'Somalia' },
    })
  }

  for (const [id, brand, model, category, pricePerDay, availability] of vehicles) {
    await prisma.vehicle.upsert({
      where: { id },
      update: { brand, model, category, pricePerDay, availability },
      create: { id, brand, model, category, pricePerDay, availability },
    })
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
