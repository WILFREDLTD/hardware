import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function main() {
  console.log('Seeding database (TypeScript)...')

  // Create 20 sample Products with realistic Kenyan hardware names
  const productDefinitions = [
    { name: 'PVC Pipe 1/2 inch', category: 'Plumbing', skuBase: 'PVC-12' },
    { name: 'Galvanized Nails 50mm', category: 'Fasteners', skuBase: 'NAIL-50' },
    { name: 'Roller Paint Brush', category: 'Paint', skuBase: 'BRUSH-PR' },
    { name: 'LED Bulb 10W', category: 'Electrical', skuBase: 'LED-10W' },
    { name: 'Copper Tape', category: 'Electrical', skuBase: 'CTAPE' },
    { name: 'Adjustable Spanner 10"', category: 'Tools', skuBase: 'SPANNER-10' },
    { name: 'Hollow Block 9inch', category: 'Masonry', skuBase: 'BLOCK-9' },
    { name: 'Hand Gloves Heavy Duty', category: 'Safety', skuBase: 'GLOVES-HD' },
    { name: 'Steel Drill Bit Set', category: 'Tools', skuBase: 'DRILL-SET' },
    { name: 'Cement 50kg', category: 'Building', skuBase: 'CEMENT-50' },
    { name: 'Sandpaper Pack', category: 'Paint', skuBase: 'SANDP-5' },
    { name: 'Socket Extension Bar', category: 'Tools', skuBase: 'SOCKET-EXT' },
    { name: 'Water Hose 30m', category: 'Plumbing', skuBase: 'HOSE-30' },
    { name: 'Smoke Detector', category: 'Electrical', skuBase: 'SMOKED' },
    { name: 'Industrial Adhesive', category: 'Building', skuBase: 'ADH-IND' },
    { name: 'Hand Saw 22"', category: 'Tools', skuBase: 'SAW-22' },
    { name: 'Tile Cutter', category: 'Building', skuBase: 'TILE-CTR' },
    { name: 'Floor Paint 5L', category: 'Paint', skuBase: 'PAINT-FL' },
    { name: 'Voltage Tester', category: 'Electrical', skuBase: 'VT-TEST' },
    { name: 'Safety Helmet', category: 'Safety', skuBase: 'HELMET' },
  ]

  const products = [] as any[]
  for (let i = 0; i < productDefinitions.length; i++) {
    const def = productDefinitions[i]
    const unitPrice = randInt(250, 15000)
    const purchasePrice = parseFloat((unitPrice * (0.5 + Math.random() * 0.35)).toFixed(2))
    const p = await prisma.product.create({
      data: {
        name: def.name,
        category: def.category,
        sku: `${def.skuBase}-${i + 1}`,
        currentStock: randInt(10, 200),
        minStockLevel: randInt(5, 15),
        unitPrice,
        purchasePrice,
      },
    })
    products.push(p)
  }
  console.log(`Created ${products.length} products`)

  // Create 5 HardwareLists and 20 Hardwares with realistic item names
  const lists = [] as any[]
  const listDefinitions = [
    { name: 'Hand Tools', description: 'Manual tools for general repair and maintenance' },
    { name: 'Electrical Supplies', description: 'Wiring, switches, and lighting accessories' },
    { name: 'Plumbing Fixtures', description: 'Pipes, fittings, and plumbing installation parts' },
    { name: 'Paint & Finishes', description: 'Paints, brushes, and surface finishing supplies' },
    { name: 'Safety & PPE', description: 'Protective equipment for construction workers' },
  ]
  for (const def of listDefinitions) {
    const list = await prisma.hardwareList.create({
      data: {
        name: def.name,
        description: def.description,
      },
    })
    lists.push(list)
  }

  const hardwareDefinitions = [
    { name: 'Adjustable Spanner', skuBase: 'SPANNER' },
    { name: 'Insulated Screwdriver Set', skuBase: 'SCREWDR' },
    { name: 'PVC Elbow Joint 90°', skuBase: 'ELBOW' },
    { name: 'Metal Wire Brush', skuBase: 'BRUSH' },
    { name: 'Electrical Tape Roll', skuBase: 'ETAPE' },
    { name: 'Concrete Mixer Shovel', skuBase: 'SHOVEL' },
    { name: 'Safety Gloves', skuBase: 'GLOVES' },
    { name: 'Face Shield', skuBase: 'FSHIELD' },
    { name: 'Paint Tray', skuBase: 'TRAY' },
    { name: 'Drain Cleaner 1L', skuBase: 'DRAIN' },
    { name: 'Cable Ties Pack', skuBase: 'TIES' },
    { name: 'Harmonik Wrench Set', skuBase: 'WRENCH' },
    { name: 'Silicone Sealant', skuBase: 'SEAL' },
    { name: 'Extension Cord 10m', skuBase: 'CORD' },
    { name: 'Masking Tape', skuBase: 'MTAPE' },
    { name: 'Wire Stripper', skuBase: 'STRIP' },
    { name: 'Socket Set', skuBase: 'SOCKET' },
    { name: 'Paint Roller', skuBase: 'ROLLER' },
    { name: 'Goggles Safety', skuBase: 'GOGGLES' },
    { name: 'Stone Drill Bit', skuBase: 'DRILL' },
  ]

  const hardwares = [] as any[]
  for (let i = 0; i < hardwareDefinitions.length; i++) {
    const list = lists[i % lists.length]
    const def = hardwareDefinitions[i]
    const unitPrice = randInt(150, 12000)
    const purchasePrice = parseFloat((unitPrice * (0.45 + Math.random() * 0.35)).toFixed(2))
    const h = await prisma.hardware.create({
      data: {
        name: def.name,
        listId: list.id,
        sku: `${def.skuBase}-${i + 1}`,
        description: `Premium ${def.name.toLowerCase()} for hardware and construction work`,
        quantity: randInt(5, 150),
        unitPrice,
        purchasePrice,
      },
    })
    hardwares.push(h)
  }
  console.log(`Created ${hardwares.length} hardware items across ${lists.length} lists`)

  // Create inventory transactions for a subset of products
  let txCount = 0
  for (let i = 0; i < 20; i++) {
    const prod = products[i]
    await prisma.inventoryTransaction.create({
      data: {
        productId: prod.id,
        type: 'IN',
        quantity: randInt(5, 50),
        notes: 'Initial seed stock',
      },
    })
    txCount++
  }
  console.log(`Created ${txCount} inventory transactions`)

  // Create a few Sales and SaleItems
  for (let s = 1; s <= 8; s++) {
    const sale = await prisma.sale.create({
      data: {
        totalAmount: 0,
        paymentStatus: s % 3 === 0 ? 'DEBT' : 'PAID',
      },
    })

    // add 1-4 items per sale
    const itemsCount = randInt(1, 4)
    let total = 0
    for (let k = 0; k < itemsCount; k++) {
      const product = products[randInt(0, products.length - 1)]
      const qty = randInt(1, 5)
      const unitPrice = product.unitPrice
      const totalPrice = parseFloat((unitPrice * qty).toFixed(2))
      total += totalPrice
      await prisma.saleItem.create({
        data: {
          saleId: sale.id,
          productId: product.id,
          quantity: qty,
          unitPrice: unitPrice,
          total: totalPrice,
        },
      })
    }

    // update sale total
    await prisma.sale.update({
      where: { id: sale.id },
      data: { totalAmount: parseFloat(total.toFixed(2)) },
    })
  }

  // Create some Debts and DebtPayments for sales marked as DEBT
  const debtSales = await prisma.sale.findMany({ where: { paymentStatus: 'DEBT' } })
  for (const ds of debtSales) {
    const debt = await prisma.debt.create({
      data: {
        saleId: ds.id,
        debtorName: `Debtor for ${ds.id.slice(0,6)}`,
        debtorPhone: `+1000000${randInt(1000,9999)}`,
        amount: ds.totalAmount || 0,
        amountPaid: 0,
        status: 'PENDING',
      },
    })

    // create one partial payment sometimes
    if (Math.random() > 0.6) {
      const paid = parseFloat(((debt.amount || 0) * 0.4).toFixed(2))
      await prisma.debtPayment.create({
        data: {
          debtId: debt.id,
          amount: paid,
          notes: 'Partial seed payment',
        },
      })
      await prisma.debt.update({ where: { id: debt.id }, data: { amountPaid: paid, status: 'PARTIAL' } })
    }
  }

  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
