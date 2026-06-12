const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({});
async function main() {
    const docs = await prisma.pageContent.findMany();
    console.log(JSON.stringify(docs.map(d => ({page: d.pageSlug, key: d.sectionKey, content: d.content})), null, 2));
}
main();
