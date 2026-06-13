import { getMenus, createMenu, deleteMenu, addMenuItem, deleteMenuItem } from "../actions";
import MenuManager from "./MenuManager";

// Varsayılan menüleri oluştur
async function ensureDefaultMenus() {
    const { prisma } = await import("@/lib/prisma");

    const defaultMenus = [
        { slug: "header-uzaktan", title: "Uzaktan Eğitim (Header)" },
        { slug: "header-orgun", title: "Ankara Örgün (Header)" },
        { slug: "header-kamplar", title: "Kamplar (Header)" },
        { slug: "header-flix", title: "4T Flix (Header)" },
        { slug: "header-blog", title: "Blog (Header)" },
        { slug: "header-hakkimizda", title: "Hakkımızda (Header)" },
        { slug: "footer-uzaktan", title: "Uzaktan Eğitim (Alt)" },
        { slug: "footer-urunler", title: "Ürünler (Alt)" },
        { slug: "footer-kurumsal", title: "Kurumsal (Alt)" },
        { slug: "footer-yasal", title: "Yasal (Alt)" },
    ];

    for (const menu of defaultMenus) {
        const existing = await prisma.menu.findUnique({ where: { slug: menu.slug } });
        if (!existing) {
            await prisma.menu.create({ data: menu });
        }
    }
}

export default async function MenulerPage() {
    await ensureDefaultMenus();
    const menus = await getMenus();

    // Menüler artık getMenus() içinde db'deki order alanına göre sıralanmış olarak geliyor.


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">
                        Menü Yönetimi
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Footer ve header menülerini buradan düzenleyin.
                    </p>
                </div>
            </div>

            <MenuManager menus={menus} />
        </div>
    );
}
