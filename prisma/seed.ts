import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');
  const password = await bcrypt.hash('password', 10);

  // Create Tenants
  const acme = await prisma.tenant.create({
    data: {
      name: 'Acme',
      slug: 'acme',
    },
  });

  const globex = await prisma.tenant.create({
    data: {
      name: 'Globex',
      slug: 'globex',
    },
  });

  // Create Users
  await prisma.user.createMany({
    data: [
      {
        email: 'admin@acme.test',
        passwordHash: password,
        role: 'ADMIN',
        tenantId: acme.id,
      },
      {
        email: 'user@acme.test',
        passwordHash: password,
        role: 'MEMBER',
        tenantId: acme.id,
      },
      {
        email: 'admin@globex.test',
        passwordHash: password,
        role: 'ADMIN',
        tenantId: globex.id,
      },
      {
        email: 'user@globex.test',
        passwordHash: password,
        role: 'MEMBER',
        tenantId: globex.id,
      },
    ],
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });