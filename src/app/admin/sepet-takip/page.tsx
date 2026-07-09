import { getAbandonedCarts } from "./actions";
import SepetTakipClient from "./SepetTakipClient";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Sepet Takibi & Sıcak Satış | Admin",
    description: "Sitenizde sepetini ödeme yapmadan bırakan öğrencileri takip edin.",
};

export default async function SepetTakipPage() {
    const initialCarts = await getAbandonedCarts();
    return <SepetTakipClient initialCarts={initialCarts} />;
}
