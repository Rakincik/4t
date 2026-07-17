const prisma = require('./src/lib/prisma').default || require('./src/lib/prisma');

async function main() {
  const coupons = await prisma.coupon.findMany();
  console.log("Coupons:", JSON.stringify(coupons, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
