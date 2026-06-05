"use client";

import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteCourse } from "./actions";
import { useRouter } from "next/navigation";

interface Props {
    id: string;
    title: string;
}

export default function DeleteCourseButton({ id, title }: Props) {
    const router = useRouter();
    const [deleting, setDeleting] = useState(false);

    async function handleDelete() {
        if (!confirm(`"${title}" kursunu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
            return;
        }

        setDeleting(true);
        try {
            await deleteCourse(id);
            router.refresh();
        } catch (error) {
            alert("Silme işlemi başarısız oldu.");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
        >
            <TrashIcon className="h-4 w-4" />
        </button>
    );
}
