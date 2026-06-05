"use client";

import { useState } from "react";
import {
    PlusIcon,
    TrashIcon,
    PencilIcon,
    CheckIcon,
    XMarkIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { addMenuItem, deleteMenuItem, updateMenuItem } from "../actions";

interface MenuItem {
    id: string;
    label: string;
    url: string;
    order: number;
    isActive: boolean;
}

interface Menu {
    id: string;
    slug: string;
    title: string;
    items: MenuItem[];
}

export default function MenuManager({ menus }: { menus: Menu[] }) {
    const [expandedMenu, setExpandedMenu] = useState<string | null>(
        menus[0]?.id || null
    );
    const [editingItem, setEditingItem] = useState<string | null>(null);
    const [newItemMenu, setNewItemMenu] = useState<string | null>(null);

    return (
        <div className="space-y-4">
            {menus.map((menu) => (
                <div
                    key={menu.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
                >
                    {/* Menu Header */}
                    <button
                        onClick={() =>
                            setExpandedMenu(
                                expandedMenu === menu.id ? null : menu.id
                            )
                        }
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
                    >
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-900">
                                {menu.title}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {menu.slug}
                            </span>
                            <span className="text-xs text-gray-400">
                                {menu.items.length} öğe
                            </span>
                        </div>
                        {expandedMenu === menu.id ? (
                            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                        )}
                    </button>

                    {/* Menu Items */}
                    {expandedMenu === menu.id && (
                        <div className="border-t border-gray-200 px-6 py-4 space-y-3">
                            {menu.items.map((item) => (
                                <MenuItemRow
                                    key={item.id}
                                    item={item}
                                    isEditing={editingItem === item.id}
                                    onEdit={() => setEditingItem(item.id)}
                                    onCancel={() => setEditingItem(null)}
                                    onSave={() => setEditingItem(null)}
                                />
                            ))}

                            {/* Add New Item Form */}
                            {newItemMenu === menu.id ? (
                                <AddItemForm
                                    menuId={menu.id}
                                    onCancel={() => setNewItemMenu(null)}
                                    onSuccess={() => setNewItemMenu(null)}
                                />
                            ) : (
                                <button
                                    onClick={() => setNewItemMenu(menu.id)}
                                    className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:border-primary hover:text-primary transition"
                                >
                                    <PlusIcon className="h-5 w-5" />
                                    Yeni Öğe Ekle
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function MenuItemRow({
    item,
    isEditing,
    onEdit,
    onCancel,
    onSave,
}: {
    item: MenuItem;
    isEditing: boolean;
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
}) {
    const [deleting, setDeleting] = useState(false);

    async function handleDelete() {
        if (!confirm("Bu öğeyi silmek istediğinize emin misiniz?")) return;
        setDeleting(true);
        await deleteMenuItem(item.id);
    }

    async function handleSave(formData: FormData) {
        formData.append("id", item.id);
        await updateMenuItem(formData);
        onSave();
    }

    if (isEditing) {
        return (
            <form
                action={handleSave}
                className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
            >
                <input
                    name="label"
                    defaultValue={item.label}
                    placeholder="Başlık"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input
                    name="url"
                    defaultValue={item.url}
                    placeholder="/sayfa-linki"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input type="hidden" name="isActive" value="true" />
                <button
                    type="submit"
                    className="p-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition"
                >
                    <CheckIcon className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="p-2 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 transition"
                >
                    <XMarkIcon className="h-4 w-4" />
                </button>
            </form>
        );
    }

    return (
        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 group">
            <div className="flex items-center gap-4">
                <span className="font-medium text-gray-900">{item.label}</span>
                <span className="text-sm text-gray-400">{item.url}</span>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                    onClick={onEdit}
                    className="p-2 rounded-lg hover:bg-white transition"
                >
                    <PencilIcon className="h-4 w-4 text-gray-500" />
                </button>
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="p-2 rounded-lg hover:bg-red-50 transition"
                >
                    <TrashIcon className="h-4 w-4 text-red-500" />
                </button>
            </div>
        </div>
    );
}

function AddItemForm({
    menuId,
    onCancel,
    onSuccess,
}: {
    menuId: string;
    onCancel: () => void;
    onSuccess: () => void;
}) {
    const [saving, setSaving] = useState(false);

    async function handleSubmit(formData: FormData) {
        setSaving(true);
        formData.append("menuId", menuId);
        await addMenuItem(formData);
        setSaving(false);
        onSuccess();
    }

    return (
        <form
            action={handleSubmit}
            className="flex items-center gap-3 bg-primary/5 rounded-xl p-3 border border-primary/20"
        >
            <input
                name="label"
                placeholder="Başlık (örn: Hakkımızda)"
                required
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
                name="url"
                placeholder="Link (örn: /hakkimizda)"
                required
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary/90 transition disabled:opacity-50"
            >
                {saving ? "..." : "Ekle"}
            </button>
            <button
                type="button"
                onClick={onCancel}
                className="p-2 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 transition"
            >
                <XMarkIcon className="h-4 w-4" />
            </button>
        </form>
    );
}
