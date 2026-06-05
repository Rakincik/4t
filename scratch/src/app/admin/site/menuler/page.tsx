import { getMenus, createMenu, deleteMenu, addMenuItem, deleteMenuItem } from "../actions";
import MenuManager from "./MenuManager";

// Varsayılan menüleri oluştur
async function ensureDefaultMenus() {
    const { prisma } = await import("@/lib/prisma");

    const defaultMenus = [
        { slug: "footer-uzaktan", title: "Uzaktan Eğitim" },
        { slug: "footer-urunler", title: "Ürünler" },
        { slug: "footer-kurumsal", title: "Kurumsal" },
        { slug: "footer-yasal", title: "Yasal" },
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
