"use client";

import React, { useState, useRef, Fragment } from "react";
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon, EyeIcon, EyeSlashIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { createCategory, updateCategory, deleteCategory, updateCategoryOrders } from "./actions";

export type Category = {
    id: string;
    slug: string;
    name: string;
    order: number;
    isActive: boolean;
    parentId: string | null;
    courses?: { id: string; title: string; type: string }[];
};

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
    const [categories, setCategories] = useState<Category[]>(
        [...initialCategories].sort((a, b) => a.order - b.order)
    );
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    
    // form states
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [parentId, setParentId] = useState<string | null>(null);

    const draggedItem = useRef<number | null>(null);
    const draggedOverItem = useRef<number | null>(null);

    // Flatten tree for display
    const buildTree = (cats: Category[], parent: string | null = null, depth = 0): (Category & { depth: number })[] => {
        let result: (Category & { depth: number })[] = [];
        const children = cats.filter(c => c.parentId === parent).sort((a, b) => a.order - b.order);
        for (const child of children) {
            result.push({ ...child, depth });
            result = result.concat(buildTree(cats, child.id, depth + 1));
        }
        return result;
    };

    const flatCategories = buildTree(categories);

    const startAdd = () => {
        setIsAdding(true);
        setEditingId(null);
        setName("");
        setSlug("");
        setIsActive(true);
        setParentId(null);
    };

    const startEdit = (cat: Category) => {
        setIsAdding(false);
        setEditingId(cat.id);
        setName(cat.name);
        setSlug(cat.slug);
        setIsActive(cat.isActive);
        setParentId(cat.parentId);
    };

    const cancel = () => {
        setIsAdding(false);
        setEditingId(null);
    };

    const handleSave = async () => {
        try {
            const fd = new FormData();
            fd.append("name", name);
            fd.append("slug", slug);
            if (parentId) fd.append("parentId", parentId);
            fd.append("isActive", isActive.toString());

            if (isAdding) {
                // yeni eklenen her zaman en sona eklensin
                const newOrder = categories.length > 0 ? Math.max(...categories.map(c => c.order)) + 1 : 0;
                fd.append("order", newOrder.toString());
                const newCat = await createCategory(fd);
                setCategories([...categories, newCat].sort((a, b) => a.order - b.order));
            } else if (editingId) {
                fd.append("id", editingId);
                await updateCategory(fd);
                setCategories(categories.map(c => c.id === editingId ? { ...c, name, slug: slug || c.slug, isActive, parentId } : c));
            }
            cancel();
        } catch (e: any) {
            alert(e.message);
        }
    };

    const confirmDelete = (id: string) => {
        setItemToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        try {
            await deleteCategory(itemToDelete);
            setCategories(categories.filter(c => c.id !== itemToDelete));
            setDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (e: any) {
            alert(e.message);
        }
    };

    const toggleActive = async (cat: Category) => {
        try {
            const fd = new FormData();
            fd.append("id", cat.id);
            fd.append("name", cat.name);
            fd.append("slug", cat.slug);
            fd.append("isActive", (!cat.isActive).toString());
            await updateCategory(fd);
            setCategories(categories.map(c => c.id === cat.id ? { ...c, isActive: !cat.isActive } : c));
        } catch (e: any) {
            alert(e.message);
        }
    };

    // Drag and Drop
    const handleSort = async () => {
        if (draggedItem.current === null || draggedOverItem.current === null) return;
        if (draggedItem.current === draggedOverItem.current) return;

        const catsCopy = [...flatCategories];
        const draggedCat = catsCopy[draggedItem.current];
        
        // Remove dragged item
        catsCopy.splice(draggedItem.current, 1);
        // Insert at new position
        catsCopy.splice(draggedOverItem.current, 0, draggedCat);

        // Calculate new orders (just array index)
        const newCats = catsCopy.map((c, index) => ({ ...c, order: index }));
        
        // Update local state
        // To maintain the tree structure correctly we update original categories by matching ID
        const updatedOriginals = categories.map(oc => {
            const match = newCats.find(nc => nc.id === oc.id);
            return match ? { ...oc, order: match.order } : oc;
        });

        setCategories(updatedOriginals.sort((a, b) => a.order - b.order));

        // Save to backend
        try {
            await updateCategoryOrders(newCats.map(c => ({ id: c.id, order: c.order })));
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (e: any) {
            alert("Sıralama kaydedilemedi: " + e.message);
        }

        draggedItem.current = null;
        draggedOverItem.current = null;
    };

    const toggleExpand = (id: string) => {
        setExpandedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-lg font-bold text-gray-800">Kategori Listesi</h2>
                <button onClick={startAdd} className="bg-[#0B1221] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-[#0B1221]/90">
                    <PlusIcon className="w-4 h-4" /> Yeni Kategori
                </button>
            </div>
            
            <div className="p-4 overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-100 text-gray-700 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-4 py-3 w-10"></th>
                            <th className="px-4 py-3 rounded-tl-lg">Kategori Adı</th>
                            <th className="px-4 py-3">Slug (URL)</th>
                            <th className="px-4 py-3">Üst Kategori</th>
                            <th className="px-4 py-3 w-24">Durum</th>
                            <th className="px-4 py-3 w-32 rounded-tr-lg text-right">İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isAdding && (
                            <tr className="border-b border-gray-100 bg-blue-50/50">
                                <td></td>
                                <td className="px-4 py-3">
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500" placeholder="Kategori Adı" autoFocus />
                                </td>
                                <td className="px-4 py-3">
                                    <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500" placeholder="Otomatik (Opsiyonel)" />
                                </td>
                                <td className="px-4 py-3">
                                    <select value={parentId || ""} onChange={e => setParentId(e.target.value || null)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500">
                                        <option value="">Yok (Ana Kategori)</option>
                                        {categories.filter(c => !c.parentId).map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-4 py-3">
                                    <button onClick={() => setIsActive(!isActive)} className={`text-xs px-2 py-1 rounded font-bold ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {isActive ? 'Aktif' : 'Pasif'}
                                    </button>
                                </td>
                                <td className="px-4 py-3 flex items-center justify-end gap-2">
                                    <button onClick={handleSave} className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600"><CheckIcon className="w-4 h-4" /></button>
                                    <button onClick={cancel} className="p-1.5 bg-gray-400 text-white rounded hover:bg-gray-500"><XMarkIcon className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        )}
                        {flatCategories.map((cat, index) => (
                            <Fragment key={cat.id}>
                                <tr 
                                className={`border-b border-gray-100 hover:bg-gray-50 ${editingId !== cat.id ? 'cursor-move' : ''}`}
                                draggable={editingId !== cat.id}
                                onDragStart={() => (draggedItem.current = index)}
                                onDragEnter={() => (draggedOverItem.current = index)}
                                onDragEnd={handleSort}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                <td className="px-4 py-3 text-gray-400">
                                    {editingId !== cat.id && <Bars3Icon className="w-5 h-5" />}
                                </td>
                                {editingId === cat.id ? (
                                    <>
                                        <td className="px-4 py-3">
                                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500" autoFocus />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <select value={parentId || ""} onChange={e => setParentId(e.target.value || null)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500">
                                                <option value="">Yok (Ana Kategori)</option>
                                                {categories.filter(c => c.id !== cat.id).map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => setIsActive(!isActive)} className={`text-xs px-2 py-1 rounded font-bold ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {isActive ? 'Aktif' : 'Pasif'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 flex items-center justify-end gap-2">
                                            <button onClick={handleSave} className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600"><CheckIcon className="w-4 h-4" /></button>
                                            <button onClick={cancel} className="p-1.5 bg-gray-400 text-white rounded hover:bg-gray-500"><XMarkIcon className="w-4 h-4" /></button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-4 py-3 font-medium text-gray-900" style={{ paddingLeft: `${(cat.depth * 1.5) + 1}rem` }}>
                                            <div className="flex items-center gap-2">
                                                {cat.depth > 0 && <span className="text-gray-300">└</span>}
                                                <button 
                                                    onClick={() => toggleExpand(cat.id)}
                                                    className="flex items-center gap-1.5 hover:text-blue-600 transition-colors text-left"
                                                >
                                                    {cat.name}
                                                    {cat.courses && cat.courses.length > 0 && (
                                                        <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                                            {cat.courses.length}
                                                        </span>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3"><span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs">{cat.slug}</span></td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">
                                            {cat.parentId ? categories.find(c => c.id === cat.parentId)?.name : '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => toggleActive(cat)} className={`flex items-center gap-1 text-xs px-2 py-1 rounded font-bold transition-colors ${cat.isActive ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>
                                                {cat.isActive ? <EyeIcon className="w-3.5 h-3.5" /> : <EyeSlashIcon className="w-3.5 h-3.5" />}
                                                {cat.isActive ? 'Aktif' : 'Gizli'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 flex items-center justify-end gap-2">
                                            <button onClick={() => startEdit(cat)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><PencilIcon className="w-4 h-4" /></button>
                                            <button onClick={() => confirmDelete(cat.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><TrashIcon className="w-4 h-4" /></button>
                                        </td>
                                    </>
                                )}
                            </tr>
                            {/* Genişletilmiş Bölüm (Ürünler) */}
                            {expandedIds.includes(cat.id) && editingId !== cat.id && (
                                <tr className="bg-blue-50/30">
                                    <td colSpan={6} className="px-10 py-4 border-b border-gray-100">
                                        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                            <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                                Bu Kategoriye Ait Ürünler ({cat.courses?.length || 0})
                                            </h4>
                                            {cat.courses && cat.courses.length > 0 ? (
                                                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                                    {cat.courses.map(course => (
                                                        <li key={course.id} className="text-sm bg-gray-50 border border-gray-100 rounded px-3 py-2 flex items-center justify-between">
                                                            <span className="truncate max-w-[200px]" title={course.title.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')}>
                                                                {course.title.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')}
                                                            </span>
                                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-200 text-gray-600">{course.type}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-sm text-gray-500 italic">Bu kategoriye ait ürün bulunmuyor.</p>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </Fragment>
                        ))}
                        {!isAdding && categories.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">Henüz hiç kategori eklenmemiş.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {deleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
                                <TrashIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Kategoriyi Sil</h3>
                            <p className="text-gray-500 text-sm">
                                Bu kategoriyi silmek istediğinize emin misiniz? Eğer bu kategorinin altında başka kategoriler veya ürünler varsa etkilenebilir. Bu işlem geri alınamaz.
                            </p>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-100">
                            <button 
                                onClick={() => { setDeleteModalOpen(false); setItemToDelete(null); }}
                                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                İptal
                            </button>
                            <button 
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm shadow-red-600/20"
                            >
                                Evet, Sil
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed top-24 right-8 bg-green-500 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 z-[100] animate-in fade-in slide-in-from-top-5 duration-300">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <CheckIcon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm">Başarılı</span>
                        <span className="text-xs text-green-100">Sıralama güncellendi</span>
                    </div>
                </div>
            )}
        </div>
    );
}
