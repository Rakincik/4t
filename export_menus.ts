import dotenv from 'dotenv';
dotenv.config();

import prisma from './src/lib/prisma';
import fs from 'fs';

async function main() {
  const menus = await prisma.menu.findMany({
      include: {
          items: {
              include: {
                  children: true
              }
          }
      }
  });

  fs.writeFileSync('menus_backup.json', JSON.stringify(menus, null, 2));
  console.log('Exported ' + menus.length + ' menus');
}

main().catch(console.error).finally(()=>prisma.$disconnect());
