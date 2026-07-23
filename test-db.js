const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    console.log("Hero Slides:");
    console.log(await prisma.heroSlide.findMany());
    console.log("Page Content (Home):");
    console.log(await prisma.pageContent.findMany({ where: { pageSlug: 'home' }}));
}
main().catch(console.error).finally(() => prisma.$disconnect());
