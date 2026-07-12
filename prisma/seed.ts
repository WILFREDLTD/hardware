import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateId() {
  return `seed-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
};

const SUPPLIER_OPTIONS = [
  { name: 'Amani Hardware Ltd', number: '0712-100-200' },
  { name: 'Mji Safi Supplies', number: '0722-300-400' },
  { name: 'Kifaru Builders', number: '0733-500-600' },
  { name: 'Mshauri Materials', number: '0744-700-800' },
];

function getPackageConversion(baseUnit: string) {
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
    });
    console.log(`Created user: ${user.email}`);
    return user;
  } catch (err: any) {
    const isMissingColumn = err?.code === 'P2022' && err?.meta?.column;
    if (isMissingColumn) {
      console.warn('Prisma client error creating user (missing column), falling back to raw INSERT:', err.meta?.column);

      const cols: Array<{ column_name: string; is_nullable: string; column_default: string | null; data_type: string }> = await prisma.$queryRawUnsafe(
        `SELECT column_name, is_nullable, column_default, data_type
         FROM information_schema.columns
         WHERE table_schema = 'hardware' AND table_name = 'users'`
      );

      const colNames = cols.map((c) => c.column_name);
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
  console.log('Seeding database (TypeScript)...');

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
  ]);

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

  await prisma.baseUnit.createMany({
    data: ['kg', 'g', 'liter', 'pcs', 'meter', 'bag', 'box'].map((name) => ({ name })),
    skipDuplicates: true,
  });

  const productTemplates = [
    { userId: demoUser.id, name: 'PVC Pipe 1/2 inch', category: 'Plumbing', nickname: 'demo-pvc-12', baseUnit: 'meter' },
    { userId: demoUser.id, name: 'LED Bulb 10W', category: 'Electrical', nickname: 'demo-led-10w', baseUnit: 'pcs' },
    { userId: secondUser.id, name: 'Galvanized Nails 50mm', category: 'Fasteners', nickname: 'branch-nails-50', baseUnit: 'kg' },
    { userId: secondUser.id, name: 'Safety Helmet', category: 'Safety', nickname: 'branch-helmet', baseUnit: 'pcs' },
  ];

  const createdProducts = [] as Array<{ id: string; userId: string }>;
  for (const template of productTemplates) {
    const supplier = SUPPLIER_OPTIONS[createdProducts.length % SUPPLIER_OPTIONS.length];
    const unitPrice = randInt(250, 15000);
    const purchasePrice = parseFloat((unitPrice * 0.6).toFixed(2));
    const packageInfo = getPackageConversion(template.baseUnit);
    const product = await prisma.product.create({
      data: {
        name: template.name,
        category: template.category,
        userId: template.userId,
        nickname: template.nickname,
        currentStock: randInt(10, 80),
        minStockLevel: randInt(5, 15),
        baseUnit: template.baseUnit,
        packageUnitLabel: packageInfo.packageUnitLabel,
        packageSize: packageInfo.packageSize,
        supplierName: supplier.name,
        supplierNumber: supplier.number,
        unitPrice,
        purchasePrice,
      },
    });
    createdProducts.push({ id: product.id, userId: template.userId });
  }

  const hardwareLists = await Promise.all([
    prisma.hardwareList.create({ data: { name: 'Main Tools', description: 'Primary tools for the main branch', userId: demoUser.id } }),
    prisma.hardwareList.create({ data: { name: 'Branch Tools', description: 'Tools for the secondary branch', userId: secondUser.id } }),
  ]);

  const hardwares = await Promise.all([
    prisma.hardware.create({
      data: {
        name: 'Adjustable Spanner',
        listId: hardwareLists[0].id,
        userId: demoUser.id,
        sku: 'SPANNER-01',
        description: 'Main branch spanner',
        quantity: 12,
        unitPrice: 1800,
        purchasePrice: 1200,
      },
    }),
    prisma.hardware.create({
      data: {
        name: 'Safety Gloves',
        listId: hardwareLists[1].id,
        userId: secondUser.id,
        sku: 'GLOVES-01',
        description: 'Secondary branch gloves',
        quantity: 18,
        unitPrice: 950,
        purchasePrice: 650,
      },
    }),
  ]);

  for (const product of createdProducts) {
    await prisma.inventoryTransaction.create({
      data: {
        userId: product.userId,
        productId: product.id,
        type: 'IN',
        quantity: randInt(5, 30),
        notes: 'Seed stock entry',
      },
    });
  }

  const users = [demoUser, secondUser];
  for (const [index, user] of users.entries()) {
    const userProducts = createdProducts.filter((product) => product.userId === user.id);
    if (userProducts.length === 0) continue;

    const sale = await prisma.sale.create({
      data: {
        userId: user.id,
        totalAmount: 0,
        paymentStatus: index === 0 ? 'DEBT' : 'PAID',
        supplierName: SUPPLIER_OPTIONS[index % SUPPLIER_OPTIONS.length].name,
        supplierNumber: SUPPLIER_OPTIONS[index % SUPPLIER_OPTIONS.length].number,
        notes: `${user.firstName} seed sale`,
      },
    });

    const product = userProducts[0];
    const unitPrice = randInt(500, 3000);
    await prisma.saleItem.create({
      data: {
        saleId: sale.id,
        productId: product.id,
        quantity: 2,
        unitPrice,
        total: unitPrice * 2,
      },
    });

    await prisma.sale.update({
      where: { id: sale.id },
      data: { totalAmount: unitPrice * 2 },
    });

    if (index === 0) {
      const debt = await prisma.debt.create({
        data: {
          userId: user.id,
          saleId: sale.id,
          debtorName: `${user.firstName} Customer`,
          debtorPhone: '+254700000001',
          amount: unitPrice * 2,
          amountPaid: 0,
          status: 'PENDING',
        },
      });

      await prisma.debtPayment.create({
        data: {
          userId: user.id,
          debtId: debt.id,
          amount: 0,
          notes: 'Seed debt created',
        },
      });
    }
  }

  console.log(`Seeded ${createdProducts.length} products, ${hardwares.length} hardware items, and debts for ${users.length} users.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
