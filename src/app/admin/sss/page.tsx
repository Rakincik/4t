import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PlusIcon, TrashIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

const CATEGORIES = [
    { id: "genel", name: "Genel Sorular" },
    { id: "odeme", name: "Ödeme & İptal" },
    { id: "teknik", name: "Teknik Destek" },
    { id: "flix", name: "4T FLIX" },
];

async function createFaq(formData: FormData) {
    "use server";
    const count = await prisma.fAQ.count();
    await prisma.fAQ.create({
        data: {
            question: formData.get("question") as string,
            answer: formData.get("answer") as string,
            category: formData.get("category") as string || "genel",
            order: count,
            isActive: true,
        },
    });
    revalidatePath("/admin/sss");
    redirect("/admin/sss");
}

async function deleteFaq(formData: FormData) {
    "use server";
    await prisma.fAQ.delete({ where: { id: formData.get("id") as string } });
    revalidatePath("/admin/sss");
}

async function toggleFaq(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const faq = await prisma.fAQ.findUnique({ where: { id } });
    if (faq) {
        await prisma.fAQ.update({ where: { id }, data: { isActive: !faq.isActive } });
    }
    revalidatePath("/admin/sss");
}

export default async function AdminSssPage() {
    const faqs = await prisma.fAQ.findMany({ orderBy: { order: "asc" } });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">SSS Yönetimi</h1>
                <p className="text-gray-500 text-sm">Sıkça sorulan soruları yönetin.</p>
            </div>

            {/* Yeni SSS Formu */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Yeni Soru Ekle</h2>
                <form action={createFaq} className="space-y-4">
                    <input name="question" placeholder="Soru *" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    <textarea name="answer" placeholder="Cevap *" required rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none" />
                    <div className="flex items-center gap-4">
                        <select name="category" className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
                            {CATEGORIES.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">
                            <PlusIcon className="w-4 h-4" /> Ekle
                        </button>
                    </div>
                </form>
            </div>

            {/* SSS Listesi */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {faqs.length === 0 ? (
                    <div className="p-12 text-center">
                        <QuestionMarkCircleIcon className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700">Henüz SSS yok</h3>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {faqs.map((faq) => (
                            <div key={faq.id} className={`px-5 py-4 ${!faq.isActive ? "opacity-50" : ""}`}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1 ${
                                            faq.category === "genel" ? "bg-blue-100 text-blue-700" :
                                            faq.category === "odeme" ? "bg-amber-100 text-amber-700" :
                                            faq.category === "teknik" ? "bg-green-100 text-green-700" :
                                            "bg-purple-100 text-purple-700"
                                        }`}>
                                            {CATEGORIES.find(c => c.id === faq.category)?.name || faq.category}
                                        </span>
                                        <p className="font-medium text-gray-900 text-sm">{faq.question}</p>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{faq.answer}</p>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <form action={toggleFaq}>
                                            <input type="hidden" name="id" value={faq.id} />
                                            <button type="submit" className={`px-2 py-1 text-xs font-medium rounded-lg ${faq.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                                {faq.isActive ? "Aktif" : "Pasif"}
                                            </button>
                                        </form>
                                        <form action={deleteFaq}>
                                            <input type="hidden" name="id" value={faq.id} />
                                            <button type="submit" className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
