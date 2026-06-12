const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const menus = await prisma.menu.findMany({
    where: { slug: { startsWith: 'header-' } }
  });
  console.log(JSON.stringify(menus.map(m => ({ slug: m.slug, title: m.title, items: m.items })), null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
