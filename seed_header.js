const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function seed() {
  const m = await prisma.menu.findUnique({ where: { slug: 'header-main' } });
  if (!m) {
    await prisma.menu.create({ data: { slug: 'header-main', title: 'Üst Menü (Header)' } });
    console.log('Created header-main menu!');
  } else {
    console.log('Already exists');
  }
}
seed().finally(() => prisma.$disconnect());
