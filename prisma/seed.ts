import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 12);
  console.log('Password hashed successfully');

  // Create users with hashed passwords
  const user1 = await prisma.user.upsert({
    where: { email: 'admin@planova.com' },
    update: {},
    create: {
      email: 'admin@planova.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'john@planova.com' },
    update: {},
    create: {
      email: 'john@planova.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'USER',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'jane@planova.com' },
    update: {},
    create: {
      email: 'jane@planova.com',
      name: 'Jane Smith',
      password: hashedPassword,
      role: 'USER',
    },
  });

  console.log('Created users:', { user1, user2, user3 });
  console.log('All users created with password: password123');
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
