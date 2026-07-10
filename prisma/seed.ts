import bcrypt from 'bcryptjs';

function generateId() {
  return `seed-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
}
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const BASE_UNIT_MAP: Record<string, string> = {
  Plumbing: 'meter',
  Electrical: 'pcs',
  Paint: 'liter',
  Tools: 'pcs',
  Masonry: 'kg',
  Building: 'kg',
  Safety: 'pcs',
  Fasteners: 'pcs',
}

const SUPPLIER_OPTIONS = [
  { name: 'Amani Hardware Ltd', number: '0712-100-200' },
  { name: 'Mji Safi Supplies', number: '0722-300-400' },
  { name: 'Kifaru Builders', number: '0733-500-600' },
  { name: 'Mshauri Materials', number: '0744-700-800' },
]

const PRODUCT_NICKNAMES = [
  'bomba-pvc',
  'misumari-kubwa',
  'brashi-rangi',
  'balbu-led',
  'mkanda-wa-copper',
  'spana-kubadilika',
  'blokki-tisa',
  'glovu-kali',
  'seti-ya-drill',
  'simiti-50',
  'sandpaper-kiboko',
  'bar-ya-socket',
  'hose-maji',
  'detector-mswaki',
  'bondia-adhesive',
  'msumeno-wa-mkono',
  'kikata-tile',
  'rangi-ya-floor',
  'tester-voltage',
  'kofia-safety',
]

function getPackageConversion(category: string, baseUnit: string) {
  if (baseUnit === 'kg') return { packageUnitLabel: 'bag', packageSize: 50 };
  if (baseUnit === 'liter') return { packageUnitLabel: 'can', packageSize: 5 };
  if (baseUnit === 'meter') return { packageUnitLabel: 'roll', packageSize: 10 };
  if (baseUnit === 'pcs') return { packageUnitLabel: 'box', packageSize: 20 };
  return { packageUnitLabel: undefined, packageSize: undefined };
}

async function createUser(input: { email: string; password: string; firstName: string; lastName: string; phone?: string; storeName?: string }) {
  try {
    const user = await prisma.user.create({
      data: {
        email: input.email,
        password: input.password,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        storeName: input.storeName,
      },
    })
    console.log(`Created user: ${user.email}`)
    return user
  } catch (err: any) {
    const isMissingColumn = err?.code === 'P2022' && err?.meta?.column;
    if (isMissingColumn) {
      console.warn('Prisma client error creating user (missing column), falling back to raw INSERT:', err.meta?.column);

      const cols: Array<{ column_name: string; is_nullable: string; column_default: string | null; data_type: string }> = await prisma.$queryRawUnsafe(
        `SELECT column_name, is_nullable, column_default, data_type
         FROM information_schema.columns
         WHERE table_schema = 'hardware' AND table_name = 'users'`
      );

      const colNames = cols.map(c => c.column_name);
      const insertCols: string[] = [];
      const values: any[] = [];

      const push = (name: string, val: any) => {
        insertCols.push(name);
        values.push(val);
      };

      if (colNames.includes('id')) push('id', generateId());
      if (colNames.includes('email')) push('email', input.email);
      if (colNames.includes('password')) push('password', input.password);
      if (colNames.includes('firstName')) push('"firstName"', input.firstName);
      if (colNames.includes('lastName')) push('"lastName"', input.lastName);
      if (colNames.includes('phone')) push('phone', input.phone ?? null);
      if (colNames.includes('storeName')) push('"storeName"', input.storeName ?? 'My Hardware Store');
      if (colNames.includes('storeLocation')) push('"storeLocation"', null);
      if (colNames.includes('storeDescription')) push('"storeDescription"', null);
      if (colNames.includes('autoLockTimeoutMinutes')) push('"autoLockTimeoutMinutes"', 1);
      if (colNames.includes('createdAt')) push('"createdAt"', new Date());

      for (const c of cols) {
        const already = insertCols.includes(c.column_name) || insertCols.includes(`"${c.column_name}"`);
        const hasDefault = c.column_default !== null;
        if (!already && c.is_nullable === 'NO' && !hasDefault) {
          let fallback: any = null;
          if (c.data_type.includes('char') || c.data_type === 'text' || c.data_type === 'varchar') fallback = '';
          else if (c.data_type.includes('int') || c.data_type === 'numeric' || c.data_type === 'double') fallback = 0;
          else if (c.data_type.includes('timestamp') || c.data_type === 'date') fallback = new Date();
          else if (c.data_type === 'boolean') fallback = false;
          else fallback = '';
          push(`"${c.column_name}"`, fallback);
        }
      }

      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
      const sql = `INSERT INTO "hardware"."users" (${insertCols.join(', ')}) VALUES (${placeholders})`;
      await prisma.$executeRawUnsafe(sql, ...values);
      console.log(`Created user (raw INSERT): ${input.email}`);

      const insertedUser = await prisma.user.findUnique({ where: { email: input.email } });
      if (!insertedUser) {
        throw new Error(`Unable to load created user ${input.email}`);
      }
      return insertedUser;
    }

    throw err;
  }
}

async function main() {
  console.log('Seeding database (TypeScript)...')

  await prisma.$transaction([
    prisma.debtPayment.deleteMany(),
    prisma.debt.deleteMany(),
    prisma.saleItem.deleteMany(),
    prisma.sale.deleteMany(),
    prisma.inventoryTransaction.deleteMany(),
    prisma.product.deleteMany(),
    prisma.hardware.deleteMany(),
    prisma.hardwareList.deleteMany(),
    prisma.user.deleteMany(),
  ])

  const demoPasswordPlain = generateId();
  const demoPassword = await bcrypt.hash(demoPasswordPlain, 10);
  const demoUser = await createUser({
    email: 'demo@hardware.com',
    password: demoPassword,
    firstName: 'Store',
    lastName: 'Owner',
    phone: '0712345678',
    storeName: 'My Hardware Store',
  });

  const secondPasswordPlain = generateId();
  const secondPassword = await bcrypt.hash(secondPasswordPlain, 10);
  const secondUser = await createUser({
    email: 'branch@hardware.com',
    password: secondPassword,
    firstName: 'Branch',
    lastName: 'Manager',
    phone: '0722345678',
    storeName: 'Branch Hardware Store',
  });

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
    const baseUnit = BASE_UNIT_MAP[def.category] || 'pcs'
    const packageInfo = getPackageConversion(def.category, baseUnit)
    const supplier = SUPPLIER_OPTIONS[i % SUPPLIER_OPTIONS.length]
    const nickname = PRODUCT_NICKNAMES[i] || `${def.skuBase.toLowerCase()}-${i + 1}`
    const ownerId = i % 2 === 0 ? demoUser.id : secondUser.id
    const p = await prisma.product.create({
      data: {
        name: def.name,
        category: def.category,
        userId: ownerId,
        nickname,
        currentStock: randInt(10, 200),
        minStockLevel: randInt(5, 15),
        baseUnit,
        packageUnitLabel: packageInfo.packageUnitLabel,
        packageSize: packageInfo.packageSize,
        supplierName: supplier.name,
        supplierNumber: supplier.number,
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
    { name: 'Hand Tools', description: 'Manual tools for general repair and maintenance', ownerId: demoUser.id },
    { name: 'Electrical Supplies', description: 'Wiring, switches, and lighting accessories', ownerId: demoUser.id },
    { name: 'Plumbing Fixtures', description: 'Pipes, fittings, and plumbing installation parts', ownerId: secondUser.id },
    { name: 'Paint & Finishes', description: 'Paints, brushes, and surface finishing supplies', ownerId: secondUser.id },
    { name: 'Safety & PPE', description: 'Protective equipment for construction workers', ownerId: demoUser.id },
  ]
  for (const def of listDefinitions) {
    const list = await prisma.hardwareList.create({
      data: {
        name: def.name,
        description: def.description,
        userId: def.ownerId,
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
    const ownerId = list.userId ?? (i % 2 === 0 ? demoUser.id : secondUser.id)
    const h = await prisma.hardware.create({
      data: {
        name: def.name,
        listId: list.id,
        userId: ownerId,
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
    const supplier = SUPPLIER_OPTIONS[(s - 1) % SUPPLIER_OPTIONS.length]
    const sale = await prisma.sale.create({
      data: {
        totalAmount: 0,
        paymentStatus: s % 3 === 0 ? 'DEBT' : 'PAID',
        supplierName: supplier.name,
        supplierNumber: supplier.number,
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
