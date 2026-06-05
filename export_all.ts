import dotenv from 'dotenv';
dotenv.config();

import prisma from './src/lib/prisma';
import fs from 'fs';

async function main() {
  const courses = await prisma.course.findMany({
    include: {
      variants: true,
      addons: true,
      coupons: true
    }
  });
  fs.writeFileSync('kurslar_backup.json', JSON.stringify(courses, null, 2));
  console.log('Exported ' + courses.length + ' courses');
}

main().catch(console.error).finally(()=>prisma.$disconnect());
