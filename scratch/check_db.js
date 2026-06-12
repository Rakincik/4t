const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const docs = await prisma.pageContent.findMany();
    const result = docs.map(d => ({
        page: d.pageSlug, 
        key: d.sectionKey, 
        content: d.content,
        metadata: d.metadata
    }));
    console.log(JSON.stringify(result, null, 2));
}
main();
