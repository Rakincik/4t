module.exports = [
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[externals]/pg [external] (pg, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("pg");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/Desktop/4t-akademi-yeni/src/lib/prisma.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/4t-akademi-yeni/node_modules/@prisma/adapter-pg/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const globalForPrisma = globalThis;
function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL environment variable is not set");
    }
    // Create a pg Pool with the connection string
    const pool = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__["Pool"]({
        connectionString
    });
    // Create adapter with the pool
    const adapter = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PrismaPg"](pool);
    return new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
        adapter,
        log: ("TURBOPACK compile-time truthy", 1) ? [
            "error",
            "warn"
        ] : "TURBOPACK unreachable"
    });
}
const prisma = globalForPrisma.prisma ?? createPrismaClient();
if ("TURBOPACK compile-time truthy", 1) {
    globalForPrisma.prisma = prisma;
}
const __TURBOPACK__default__export__ = prisma;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/Desktop/4t-akademi-yeni/src/app/admin/kurslar/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/* __next_internal_action_entry_do_not_use__ [{"00c095d751fd2f8507d76e45623f2a2cfeb6ed38f3":"getCourses","402aae9e933edd736cd626420373f81e21fdb1b922":"createCourse","403ecfde35d15e8683db4745fcf6872b7da3bf1bad":"getCourse","4053bf9bcf2ca0bf5328eb402444830862d9ee789c":"deleteCourse","6038dd6a94108c9b37029a7e1ddddf2a5293f1cc70":"updateCourse"},"",""] */ __turbopack_context__.s([
    "createCourse",
    ()=>createCourse,
    "deleteCourse",
    ()=>deleteCourse,
    "getCourse",
    ()=>getCourse,
    "getCourses",
    ()=>getCourses,
    "updateCourse",
    ()=>updateCourse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/4t-akademi-yeni/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/4t-akademi-yeni/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/4t-akademi-yeni/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/4t-akademi-yeni/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
async function getCourses() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].course.findMany({
        include: {
            variants: {
                orderBy: {
                    order: 'asc'
                }
            },
            addons: {
                orderBy: {
                    order: 'asc'
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
}
async function getCourse(id) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].course.findUnique({
        where: {
            id
        },
        include: {
            variants: {
                orderBy: {
                    order: 'asc'
                }
            },
            addons: {
                orderBy: {
                    order: 'asc'
                }
            },
            coupons: {
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });
}
function parseFormData(formData) {
    return {
        title: formData.get("title"),
        slug: formData.get("slug"),
        subtitle: formData.get("subtitle") || null,
        description: formData.get("description") || null,
        price: parseFloat(formData.get("price")) || 0,
        oldPrice: formData.get("oldPrice") ? parseFloat(formData.get("oldPrice")) : null,
        imageUrl: formData.get("imageUrl") || null,
        gallery: formData.get("gallery") ? JSON.parse(formData.get("gallery")) : null,
        videoUrl: formData.get("videoUrl") || null,
        category: formData.get("category") || null,
        type: formData.get("type") || "KURS",
        isActive: formData.get("isActive") === "true",
        hours: formData.get("hours") || null,
        questions: formData.get("questions") || null,
        bookPrice: formData.get("bookPrice") ? parseFloat(formData.get("bookPrice")) : null,
        badge: formData.get("badge") || null,
        duration: formData.get("duration") || null,
        studentCount: formData.get("studentCount") || null,
        resources: formData.get("resources") || null,
        features: formData.get("features") ? JSON.parse(formData.get("features")) : null,
        learningOutcomes: formData.get("learningOutcomes") ? JSON.parse(formData.get("learningOutcomes")) : null,
        curriculum: formData.get("curriculum") ? JSON.parse(formData.get("curriculum")) : null,
        instructor: formData.get("instructor") ? JSON.parse(formData.get("instructor")) : null,
        episodes: formData.get("episodes") ? JSON.parse(formData.get("episodes")) : null,
        cast: formData.get("cast") ? JSON.parse(formData.get("cast")) : null,
        tags: formData.get("tags") ? JSON.parse(formData.get("tags")) : null,
        accessEndDate: formData.get("accessEndDate") ? new Date(formData.get("accessEndDate")) : null,
        accessDurationDays: formData.get("accessDurationDays") ? parseInt(formData.get("accessDurationDays")) : null
    };
}
function parseRelations(formData) {
    const variantsList = formData.get("variants") ? JSON.parse(formData.get("variants")) : [];
    const addonsList = formData.get("addons") ? JSON.parse(formData.get("addons")) : [];
    const couponsList = formData.get("coupons") ? JSON.parse(formData.get("coupons")) : [];
    return {
        variants: variantsList.map((v, i)=>({
                title: v.title,
                price: Number(v.price),
                oldPrice: v.oldPrice ? Number(v.oldPrice) : null,
                order: i
            })),
        addons: addonsList.map((a, i)=>({
                title: a.title,
                price: Number(a.price),
                order: i
            })),
        coupons: couponsList.map((c)=>({
                id: c.id || undefined,
                code: c.code,
                type: c.type,
                amount: Number(c.amount),
                maxUses: c.maxUses ? Number(c.maxUses) : null,
                expiresAt: c.expiresAt ? new Date(c.expiresAt) : null,
                isActive: c.isActive ?? true
            }))
    };
}
function revalidateAll(slug) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/kurslar");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/kurslar/[id]", "page");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/kurslar");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/flix");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/kamplar");
    if (slug) (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/kurs/${slug}`);
}
async function createCourse(formData) {
    const data = parseFormData(formData);
    const rels = parseRelations(formData);
    const course = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].course.create({
        data: {
            ...data,
            variants: {
                create: rels.variants
            },
            addons: {
                create: rels.addons
            }
        }
    });
    // Create coupons linked to this course
    if (rels.coupons.length > 0) {
        for (const c of rels.coupons){
            await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].coupon.create({
                data: {
                    code: c.code,
                    type: c.type,
                    amount: c.amount,
                    maxUses: c.maxUses,
                    expiresAt: c.expiresAt,
                    isActive: c.isActive,
                    courseId: course.id
                }
            });
        }
    }
    revalidateAll();
    return {
        success: true,
        id: course.id
    };
}
async function updateCourse(id, formData) {
    const data = parseFormData(formData);
    const rels = parseRelations(formData);
    // Perform inline delete-and-create for relations
    await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].courseVariant.deleteMany({
        where: {
            courseId: id
        }
    });
    await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].courseAddon.deleteMany({
        where: {
            courseId: id
        }
    });
    await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].course.update({
        where: {
            id
        },
        data: {
            ...data,
            variants: {
                create: rels.variants
            },
            addons: {
                create: rels.addons
            }
        }
    });
    // Sync coupons: upsert existing, create new, delete removed
    const existingCoupons = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].coupon.findMany({
        where: {
            courseId: id
        }
    });
    const submittedIds = rels.coupons.filter((c)=>c.id).map((c)=>c.id);
    // Delete removed coupons
    const toDelete = existingCoupons.filter((ec)=>!submittedIds.includes(ec.id));
    for (const d of toDelete){
        await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].coupon.delete({
            where: {
                id: d.id
            }
        });
    }
    // Upsert coupons
    for (const c of rels.coupons){
        if (c.id) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].coupon.update({
                where: {
                    id: c.id
                },
                data: {
                    code: c.code,
                    type: c.type,
                    amount: c.amount,
                    maxUses: c.maxUses,
                    expiresAt: c.expiresAt,
                    isActive: c.isActive
                }
            });
        } else {
            await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].coupon.create({
                data: {
                    code: c.code,
                    type: c.type,
                    amount: c.amount,
                    maxUses: c.maxUses,
                    expiresAt: c.expiresAt,
                    isActive: c.isActive,
                    courseId: id
                }
            });
        }
    }
    revalidateAll(data.slug);
    return {
        success: true
    };
}
async function deleteCourse(id) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].course.delete({
        where: {
            id
        }
    });
    revalidateAll();
    return {
        success: true
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCourses, "00c095d751fd2f8507d76e45623f2a2cfeb6ed38f3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCourse, "403ecfde35d15e8683db4745fcf6872b7da3bf1bad", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createCourse, "402aae9e933edd736cd626420373f81e21fdb1b922", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateCourse, "6038dd6a94108c9b37029a7e1ddddf2a5293f1cc70", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteCourse, "4053bf9bcf2ca0bf5328eb402444830862d9ee789c", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/Desktop/4t-akademi-yeni/.next-internal/server/app/admin/kurslar/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/4t-akademi-yeni/src/app/admin/kurslar/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$admin$2f$kurslar$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/4t-akademi-yeni/src/app/admin/kurslar/actions.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$admin$2f$kurslar$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$admin$2f$kurslar$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/Desktop/4t-akademi-yeni/.next-internal/server/app/admin/kurslar/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/4t-akademi-yeni/src/app/admin/kurslar/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "00c095d751fd2f8507d76e45623f2a2cfeb6ed38f3",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$admin$2f$kurslar$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCourses"],
    "402aae9e933edd736cd626420373f81e21fdb1b922",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$admin$2f$kurslar$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createCourse"],
    "403ecfde35d15e8683db4745fcf6872b7da3bf1bad",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$admin$2f$kurslar$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCourse"],
    "4053bf9bcf2ca0bf5328eb402444830862d9ee789c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$admin$2f$kurslar$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteCourse"],
    "6038dd6a94108c9b37029a7e1ddddf2a5293f1cc70",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$admin$2f$kurslar$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateCourse"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$kurslar$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$admin$2f$kurslar$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/Desktop/4t-akademi-yeni/.next-internal/server/app/admin/kurslar/[id]/page/actions.js { ACTIONS_MODULE0 => "[project]/Desktop/4t-akademi-yeni/src/app/admin/kurslar/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$admin$2f$kurslar$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/4t-akademi-yeni/src/app/admin/kurslar/actions.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$kurslar$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$admin$2f$kurslar$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$admin$2f$kurslar$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$kurslar$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$admin$2f$kurslar$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$admin$2f$kurslar$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__45393811._.js.map