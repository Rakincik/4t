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
import { addMenuItem, deleteMenuItem, updateMenuItem, updateMenuTitle } from "../actions";

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
    const [editingMenuTitleId, setEditingMenuTitleId] = useState<string | null>(null);

    const headerMenus = menus.filter((m) => m.slug.startsWith("header-"));
    const footerMenus = menus.filter((m) => m.slug.startsWith("footer-"));

    const renderMenuGroup = (title: string, groupMenus: Menu[]) => (
        <div className="mb-10">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                {title}
            </h3>
            <div className="space-y-4">
                {groupMenus.map((menu) => (
                    <div
                        key={menu.id}
                        className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
                    >
                        {/* Menu Header */}
                        <div className={`w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0 ${expandedMenu === menu.id ? 'bg-gray-50' : ''}`}>
                            {editingMenuTitleId === menu.id ? (
                                <form 
                                    action={async (formData) => {
                                        formData.append("id", menu.id);
                                        await updateMenuTitle(formData);
                                        setEditingMenuTitleId(null);
                                    }} 
                                    className="flex-1 flex items-center gap-2 mr-4"
                                >
                                    <input
                                        name="title"
                                        defaultValue={menu.title}
                                        className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        required
                                    />
                                    <button type="submit" className="p-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition" title="Kaydet">
                                        <CheckIcon className="h-4 w-4" />
                                    </button>
                                    <button type="button" onClick={() => setEditingMenuTitleId(null)} className="p-1.5 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 transition" title="İptal">
                                        <XMarkIcon className="h-4 w-4" />
                                    </button>
                                </form>
                            ) : (
                                <button
                                    onClick={() =>
                                        setExpandedMenu(
                                            expandedMenu === menu.id ? null : menu.id
                                        )
                                    }
                                    className="flex-1 flex items-center gap-3 text-left"
                                >
                                    <span className="font-bold text-gray-900">
                                        {menu.title}
                                    </span>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        {menu.slug}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {menu.items.length} öğe
                                    </span>
                                </button>
                            )}
                            
                            <div className="flex items-center gap-2 ml-4 shrink-0">
                                {editingMenuTitleId !== menu.id && (
                                    <button
                                        onClick={() => setEditingMenuTitleId(menu.id)}
                                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                                        title="Menü Adını Düzenle"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </button>
                                )}
                                <button
                                    onClick={() =>
                                        setExpandedMenu(
                                            expandedMenu === menu.id ? null : menu.id
                                        )
                                    }
                                    className="p-2 text-gray-400 hover:text-gray-600"
                                >
                                    {expandedMenu === menu.id ? (
                                        <ChevronUpIcon className="h-5 w-5" />
                                    ) : (
                                        <ChevronDownIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Menu Items */}
                        {expandedMenu === menu.id && (
                            <div className="border-t border-gray-200 px-6 py-4 space-y-3 bg-gray-50/50">
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
                                            <div className="pl-6 space-y-2 ml-4">
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
                                            <div className="pl-6 ml-4 mt-2">
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
                                    <div className="pt-4 border-t border-gray-200 mt-4">
                                        <AddItemForm
                                            menuId={menu.id}
                                            onCancel={() => setNewItemMenu(null)}
                                            onSuccess={() => setNewItemMenu(null)}
                                        />
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setNewItemMenu(menu.id)}
                                        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 bg-white rounded-xl text-sm font-medium text-gray-500 hover:border-primary hover:text-primary transition mt-4"
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
        </div>
    );

    return (
        <div className="space-y-2">
            {renderMenuGroup("Üst Menüler (Header)", headerMenus)}
            {renderMenuGroup("Alt Menüler (Footer)", footerMenus)}
        </div>
    );
}

function DeleteConfirmModal({ isOpen, onClose, onConfirm, title }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, title: string }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                    <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Emin misiniz?</h3>
                <p className="text-center text-sm text-gray-500 mb-6">{title}</p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition">İptal</button>
                    <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-200">Evet, Sil</button>
                </div>
            </div>
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    async function handleConfirmDelete() {
        setShowDeleteModal(false);
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
                    {isSubItem && (
                        <span className="text-gray-300 text-lg font-light translate-y-[-2px] ml-1">↳</span>
                    )}
                    <span className="font-semibold text-gray-900">{item.label}</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{item.url}</span>
                </div>
                {item.desc && (
                    <span className={`text-xs text-gray-500 mt-0.5 ${isSubItem ? 'ml-7' : ''}`}>{item.desc}</span>
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
                    onClick={() => setShowDeleteModal(true)}
                    disabled={deleting}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition"
                    title="Sil"
                >
                    <TrashIcon className="h-4 w-4" />
                </button>
            </div>
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                title={`"${item.label}" adlı öğeyi silmek istediğinize emin misiniz? Alt öğeleri de silinecektir!`}
            />
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
