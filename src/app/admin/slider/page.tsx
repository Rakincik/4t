import prisma from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PlusIcon, PencilIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon, PhotoIcon } from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

/* ===================================================== */
/* SERVER ACTIONS                                        */
/* ===================================================== */
async function createSlide(formData: FormData) {
    "use server";
    const count = await prisma.heroSlide.count();
    await prisma.heroSlide.create({
        data: {
            title: formData.get("title") as string,
            subtitle: formData.get("subtitle") as string || null,
            description: formData.get("description") as string || null,
            cta: formData.get("cta") as string || null,
            href: formData.get("href") as string || null,
            imageUrl: formData.get("imageUrl") as string || null,
            order: count,
            isActive: true,
        },
    });
    revalidatePath("/admin/slider");
    redirect("/admin/slider");
}

async function deleteSlide(formData: FormData) {
    "use server";
    await prisma.heroSlide.delete({ where: { id: formData.get("id") as string } });
    revalidatePath("/admin/slider");
}

async function toggleSlide(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const slide = await prisma.heroSlide.findUnique({ where: { id } });
    if (slide) {
        await prisma.heroSlide.update({ where: { id }, data: { isActive: !slide.isActive } });
    }
    revalidatePath("/admin/slider");
}

async function moveSlide(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const dir = formData.get("dir") as string;
    const slide = await prisma.heroSlide.findUnique({ where: { id } });
    if (!slide) return;
    const newOrder = dir === "up" ? slide.order - 1 : slide.order + 1;
    const swap = await prisma.heroSlide.findFirst({ where: { order: newOrder } });
    if (swap) {
        await prisma.heroSlide.update({ where: { id: swap.id }, data: { order: slide.order } });
    }
    await prisma.heroSlide.update({ where: { id }, data: { order: newOrder } });
    revalidatePath("/admin/slider");
}

/* ===================================================== */
/* PAGE                                                  */
/* ===================================================== */
export default async function AdminSliderPage() {
    const slides = await prisma.heroSlide.findMany({ orderBy: { order: "asc" } });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Slider Yönetimi</h1>
                    <p className="text-gray-500 text-sm">Ana sayfa hero slider&apos;larını yönetin.</p>
                </div>
            </div>

            {/* Yeni Slide Formu */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Yeni Slide Ekle</h2>
                <form action={createSlide} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="title" placeholder="Başlık *" required className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    <input name="subtitle" placeholder="Alt başlık (badge)" className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    <input name="description" placeholder="Açıklama" className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none md:col-span-2" />
                    <input name="cta" placeholder="Buton yazısı (örn: Eğitimleri İncele)" className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    <input name="href" placeholder="Buton linki (örn: /kurslar)" className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    <input name="imageUrl" placeholder="Görsel URL" className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none md:col-span-2" />
                    <div className="md:col-span-2">
                        <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">
                            <PlusIcon className="w-4 h-4" /> Slide Ekle
                        </button>
                    </div>
                </form>
            </div>

            {/* Slide Listesi */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {slides.length === 0 ? (
                    <div className="p-12 text-center">
                        <PhotoIcon className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700">Henüz slide yok</h3>
                        <p className="text-gray-400 text-sm">Yukarıdaki formu kullanarak yeni slide ekleyin.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {slides.map((slide, i) => (
                            <div key={slide.id} className={`flex items-center gap-4 px-5 py-4 ${!slide.isActive ? "opacity-50" : ""}`}>
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-gray-500">
                                    {i + 1}
                                </div>
                                {slide.imageUrl && (
                                    <img src={slide.imageUrl} className="w-20 h-12 object-cover rounded-lg" alt="" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 text-sm truncate">{slide.title}</p>
                                    <p className="text-xs text-gray-400 truncate">{slide.subtitle} • {slide.cta} → {slide.href}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <form action={moveSlide}>
                                        <input type="hidden" name="id" value={slide.id} />
                                        <input type="hidden" name="dir" value="up" />
                                        <button type="submit" className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg" title="Yukarı">
                                            <ArrowUpIcon className="w-4 h-4" />
                                        </button>
                                    </form>
                                    <form action={moveSlide}>
                                        <input type="hidden" name="id" value={slide.id} />
                                        <input type="hidden" name="dir" value="down" />
                                        <button type="submit" className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg" title="Aşağı">
                                            <ArrowDownIcon className="w-4 h-4" />
                                        </button>
                                    </form>
                                    <form action={toggleSlide}>
                                        <input type="hidden" name="id" value={slide.id} />
                                        <button type="submit" className={`px-2 py-1 text-xs font-medium rounded-lg ${slide.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                            {slide.isActive ? "Aktif" : "Pasif"}
                                        </button>
                                    </form>
                                    <form action={deleteSlide}>
                                        <input type="hidden" name="id" value={slide.id} />
                                        <button type="submit" className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Sil">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
