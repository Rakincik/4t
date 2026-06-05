const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  const courses = await prisma.course.findMany({
     // Also fetch related addon/variants? Wait, export ALL!
     // Prisma doesn't natively include relations unless specified, but for quick export, maybe just the main table.
     // Wait, did they create relations? Let's just fetch everything.
     include: {
         addons: true,
         variants: true,
         coupons: true
     }
  });
  fs.writeFileSync('all_courses_backup.json', JSON.stringify(courses, null, 2));
  console.log('Exported ' + courses.length + ' courses');
}

main().finally(() => prisma.$disconnect());
