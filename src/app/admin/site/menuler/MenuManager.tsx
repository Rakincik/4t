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
    desc?: string | null;
    parentId?: string | null;
    children?: MenuItem[];
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
    const [newSubItemParentId, setNewSubItemParentId] = useState<string | null>(null);

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
                                <div key={item.id} className="space-y-2">
                                    <MenuItemRow
                                        item={item}
                                        isEditing={editingItem === item.id}
                                        onEdit={() => setEditingItem(item.id)}
                                        onCancel={() => setEditingItem(null)}
                                        onSave={() => setEditingItem(null)}
                                        onAddSubItem={() => setNewSubItemParentId(item.id)}
                                    />
                                    
                                    {/* Children List */}
                                    {item.children && item.children.length > 0 && (
                                        <div className="pl-8 space-y-2 border-l-2 border-gray-100 ml-4">
                                            {item.children.map(child => (
                                                <MenuItemRow
                                                    key={child.id}
                                                    item={child}
                                                    isSubItem={true}
                                                    isEditing={editingItem === child.id}
                                                    onEdit={() => setEditingItem(child.id)}
                                                    onCancel={() => setEditingItem(null)}
                                                    onSave={() => setEditingItem(null)}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Add Child Form */}
                                    {newSubItemParentId === item.id && (
                                        <div className="pl-8 ml-4 mt-2">
                                            <AddItemForm
                                                menuId={menu.id}
                                                parentId={item.id}
                                                onCancel={() => setNewSubItemParentId(null)}
                                                onSuccess={() => setNewSubItemParentId(null)}
                                                isSubItem={true}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Add New Item Form */}
                            {newItemMenu === menu.id ? (
                                <div className="pt-4 border-t border-gray-100 mt-4">
                                    <AddItemForm
                                        menuId={menu.id}
                                        onCancel={() => setNewItemMenu(null)}
                                        onSuccess={() => setNewItemMenu(null)}
                                    />
                                </div>
                            ) : (
                                <button
                                    onClick={() => setNewItemMenu(menu.id)}
                                    className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:border-primary hover:text-primary transition mt-4"
                                >
                                    <PlusIcon className="h-5 w-5" />
                                    Yeni Ana Menü Öğesi Ekle
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
    isSubItem = false,
    isEditing,
    onEdit,
    onCancel,
    onSave,
    onAddSubItem,
}: {
    item: MenuItem;
    isSubItem?: boolean;
    isEditing: boolean;
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
    onAddSubItem?: () => void;
}) {
    const [deleting, setDeleting] = useState(false);

    async function handleDelete() {
        if (!confirm("Bu öğeyi silmek istediğinize emin misiniz? Alt öğeleri de silinir!")) return;
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
                className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 shadow-inner"
            >
                <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                        <input
                            name="label"
                            defaultValue={item.label}
                            placeholder="Başlık (örn: Hakkımızda)"
                            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            required
                        />
                        <input
                            name="url"
                            defaultValue={item.url}
                            placeholder="Link (örn: /hakkimizda)"
                            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            required
                        />
                    </div>
                    {isSubItem && (
                        <input
                            name="desc"
                            defaultValue={item.desc || ""}
                            placeholder="Açıklama (Açılır menüde başlığın altında görünür)"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    )}
                </div>
                
                <input type="hidden" name="isActive" value="true" />
                <div className="flex flex-col gap-1">
                    <button
                        type="submit"
                        className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
                        title="Kaydet"
                    >
                        <CheckIcon className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="p-2 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 transition"
                        title="İptal"
                    >
                        <XMarkIcon className="h-4 w-4" />
                    </button>
                </div>
            </form>
        );
    }

    return (
        <div className={`flex items-start justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 group hover:border-gray-300 transition ${isSubItem ? 'bg-gray-50 border-gray-100' : ''}`}>
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">{item.label}</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{item.url}</span>
                </div>
                {item.desc && (
                    <span className="text-xs text-gray-500 mt-0.5">{item.desc}</span>
                )}
            </div>
            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition">
                {!isSubItem && onAddSubItem && (
                    <button
                        onClick={onAddSubItem}
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition flex items-center text-xs font-medium mr-1"
                        title="Alt Menü Ekle"
                    >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Alt Menü
                    </button>
                )}
                <button
                    onClick={onEdit}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition"
                    title="Düzenle"
                >
                    <PencilIcon className="h-4 w-4" />
                </button>
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition"
                    title="Sil"
                >
                    <TrashIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

function AddItemForm({
    menuId,
    parentId,
    onCancel,
    onSuccess,
    isSubItem = false,
}: {
    menuId: string;
    parentId?: string;
    onCancel: () => void;
    onSuccess: () => void;
    isSubItem?: boolean;
}) {
    const [saving, setSaving] = useState(false);

    async function handleSubmit(formData: FormData) {
        setSaving(true);
        formData.append("menuId", menuId);
        if (parentId) formData.append("parentId", parentId);
        await addMenuItem(formData);
        setSaving(false);
        onSuccess();
    }

    return (
        <form
            action={handleSubmit}
            className={`flex items-center gap-3 rounded-xl p-3 border ${isSubItem ? 'bg-blue-50/50 border-blue-100' : 'bg-primary/5 border-primary/20'}`}
        >
            <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                    <input
                        name="label"
                        placeholder="Başlık (örn: Kariyer)"
                        required
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <input
                        name="url"
                        placeholder="Link (örn: /kariyer)"
                        required
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                </div>
                {isSubItem && (
                    <input
                        name="desc"
                        placeholder="İsteğe Bağlı Açıklama (Alt menü kutusunda çıkar)"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                )}
            </div>
            
            <div className="flex flex-col gap-1 shrink-0 mt-1">
                <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center min-w-[80px]"
                >
                    {saving ? "..." : "Ekle"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="p-2 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 transition w-full flex items-center justify-center"
                >
                    <XMarkIcon className="h-4 w-4" />
                </button>
            </div>
        </form>
    );
}
