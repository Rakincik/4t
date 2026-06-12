const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function normalize(str) {
    if (!str) return '';
    return str.toLowerCase().trim()
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
        .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function main() {
    const categories = await prisma.category.findMany();
    const courses = await prisma.course.findMany();
    
    let updated = 0;
    
    for (const course of courses) {
        if (!course.category) continue;
        
        // Let's see if course.category matches any existing category slug exactly
        const exactMatch = categories.find(c => c.slug === course.category);
        if (exactMatch) continue; // Already fine
        
        // It didn't match. Let's try to normalize the old category string
        const oldCatNormalized = normalize(course.category);
        
        // Find if any new category slug matches the normalized old category
        const newCat = categories.find(c => c.slug === oldCatNormalized || normalize(c.name) === oldCatNormalized);
        
        if (newCat) {
            console.log(`Updating Course '${course.title}' category from '${course.category}' -> '${newCat.slug}'`);
            await prisma.course.update({
                where: { id: course.id },
                data: { category: newCat.slug }
            });
            updated++;
        } else {
            console.log(`NO MATCH FOUND for Course '${course.title}' with old category '${course.category}'. Normalized: '${oldCatNormalized}'`);
        }
    }
    console.log(`Total courses updated: ${updated}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
