import { notFound } from "next/navigation";
import { getAdminById } from "../../actions";
import EditAdminForm from "./EditAdminForm";

export default async function DuzenleAdminPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const admin = await getAdminById(id);

    if (!admin) {
        notFound();
    }

    return <EditAdminForm admin={admin} />;
}
