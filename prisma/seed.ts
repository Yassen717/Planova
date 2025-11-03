import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create users
  const user1 = await prisma.user.upsert({
    where: { email: 'admin@planova.com' },
    update: {},
    create: {
      email: 'admin@planova.com',
      name: 'Admin User',
      password: 'password123', // In production, this should be hashed
      role: 'ADMIN',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'john@planova.com' },
    update: {},
    create: {
      email: 'john@planova.com',
      name: 'John Doe',
      password: 'password123',
      role: 'USER',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'jane@planova.com' },
    update: {},
    create: {
      email: 'jane@planova.com',
      name: 'Jane Smith',
      password: 'password123',
      role: 'USER',
    },
  });

  console.log('Created users:', { user1, user2, user3 });
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
