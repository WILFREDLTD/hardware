const { PrismaClient } = require('@prisma/client')
const { execSync } = require('child_process')

const prisma = new PrismaClient()

async function main() {
  try {
    const productCount = await prisma.product.count()
    if (productCount === 0) {
      console.log('No product records found. Running database seed...')
      execSync('npm run prisma:seed', { stdio: 'inherit' })
    } else {
      console.log('Product records already exist. Skipping seed.')
    }
  } catch (error) {
    console.error('Failed to check seed status:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
