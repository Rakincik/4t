import { Metadata } from "next";
import { getCategories } from "./actions";
import CategoryManager from "./CategoryManager";
import { TagIcon } from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Kategori Yönetimi | 4T Akademi",
};

export default async function KategorilerPage() {
    const categories = await getCategories();

    return (
        <div className="space-y-6 max-w-5xl">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <TagIcon className="w-6 h-6 text-blue-600" /> Kategori Yönetimi
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Kurslar, FLIX paketleri ve kamplar için kullanılacak kategorileri buradan yönetebilirsiniz.
                </p>
            </div>

            <CategoryManager initialCategories={categories} />
        </div>
    );
}
