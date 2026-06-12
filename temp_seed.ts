import { config } from 'dotenv';
config();
import { prisma } from './src/lib/prisma';

const DEFAULT_MENUS: any[] = [
    {
      slug: "header-uzaktan",
      items: [
        { label: "Kaymakamlık Eğitimleri", url: "/kurslar", desc: "Sınav odaklı hazırlık programı" },
        { label: "KPSS A Eğitimleri", url: "/kurslar", desc: "Alan bilgisi uzman anlatımı" },
        { label: "Kurum Sınavları", url: "/kurslar", desc: "Hedefe yönelik özel taktikler" },
        { label: "Tüm Eğitimler", url: "/kurslar", desc: "Tüm online listeyi görüntüle" }
      ]
    },
    {
      slug: "header-kamplar",
      items: [
        { label: "Kamplar", url: "/kamplar" }
      ]
    },
    {
      slug: "header-flix",
      items: [
        { label: "4T FLIX", url: "/flix" }
      ]
    },
    {
      slug: "header-orgun",
      items: [
        { label: "Örgün Eğitim", url: "/orgun-egitim" }
      ]
    },
    {
      slug: "header-blog",
      items: [
        { label: "Blog", url: "/blog" }
      ]
    },
    {
      slug: "header-hakkimizda",
      items: [
        { label: "Hakkımızda", url: "/hakkimizda" }
      ]
    }
];

async function main() {
    for (const menu of DEFAULT_MENUS) {
        const dbMenu = await prisma.menu.findUnique({ where: { slug: menu.slug }});
        if (dbMenu) {
            const count = await prisma.menuItem.count({ where: { menuId: dbMenu.id }});
            if (count === 0) {
                for (let i = 0; i < menu.items.length; i++) {
                    const item = menu.items[i];
                    await prisma.menuItem.create({
                        data: {
                            menuId: dbMenu.id,
                            label: item.label,
                            url: item.url,
                            desc: item.desc || null,
                            order: i
                        }
                    });
                }
                console.log(`Seeded items for ${menu.slug}`);
            }
        }
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
