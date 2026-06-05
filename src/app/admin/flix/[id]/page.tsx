import FlixForm from "../FlixForm";
import { getFlixPackage, updateFlixPackage } from "../actions";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function FlixEditPage({ params }: Props) {
    const { id } = await params;
    const pkg = await getFlixPackage(id);

    if (!pkg) notFound();

    async function handleSave(formData: FormData) {
        "use server";
        await updateFlixPackage(id, formData);
    }

    return <FlixForm mode="edit" pkg={pkg as any} onSave={handleSave} />;
}
