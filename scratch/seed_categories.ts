import { PrismaClient } from "@prisma/client";

const CATEGORIES = [
    { slug: "kaymakamlik", name: "Kaymakamlık", order: 1 },
    { slug: "kpss-a", name: "KPSS A", order: 2 },
    { slug: "hakimlik", name: "Hakimlik", order: 3 },
    { slug: "sayistay", name: "Sayıştay", order: 4 },
    { slug: "osym", name: "ÖSYM", order: 5 },
    { slug: "guy", name: "GUY", order: 6 },
];

async function main() {
    // Import dynamically so it resolves properly
    const { default: prisma } = await import("../src/lib/prisma");

    console.log("Kategoriler ekleniyor...");
    for (const c of CATEGORIES) {
        await prisma.category.upsert({
            where: { slug: c.slug },
            update: {},
            create: { slug: c.slug, name: c.name, order: c.order }
        });
        console.log(`Eklendi/Var olan korundu: ${c.name}`);
    }
    console.log("İşlem tamamlandı!");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
