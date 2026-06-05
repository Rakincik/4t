(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/4t-akademi-yeni/src/app/giris/giris.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "active": "giris-module__u0FjfW__active",
  "container": "giris-module__u0FjfW__container",
  "error": "giris-module__u0FjfW__error",
  "formContainer": "giris-module__u0FjfW__formContainer",
  "hiddenBtn": "giris-module__u0FjfW__hiddenBtn",
  "logo": "giris-module__u0FjfW__logo",
  "page": "giris-module__u0FjfW__page",
  "signIn": "giris-module__u0FjfW__signIn",
  "signUp": "giris-module__u0FjfW__signUp",
  "success": "giris-module__u0FjfW__success",
  "toggle": "giris-module__u0FjfW__toggle",
  "toggleContainer": "giris-module__u0FjfW__toggleContainer",
  "toggleLeft": "giris-module__u0FjfW__toggleLeft",
  "togglePanel": "giris-module__u0FjfW__togglePanel",
  "toggleRight": "giris-module__u0FjfW__toggleRight",
});
}),
"[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GirisClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/4t-akademi-yeni/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/4t-akademi-yeni/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$giris$2f$giris$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/Desktop/4t-akademi-yeni/src/app/giris/giris.module.css [app-client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/4t-akademi-yeni/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/4t-akademi-yeni/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/4t-akademi-yeni/node_modules/next-auth/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function GirisClient() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [aktif, setAktif] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Login state
    const [loginEmail, setLoginEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [loginPassword, setLoginPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [loginError, setLoginError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [loginLoading, setLoginLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Register state
    const [registerName, setRegisterName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [registerEmail, setRegisterEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [registerPassword, setRegisterPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [registerPhone, setRegisterPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [registerTcNo, setRegisterTcNo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [registerAddress, setRegisterAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [registerCity, setRegisterCity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [registerContract, setRegisterContract] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [registerError, setRegisterError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [registerSuccess, setRegisterSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [registerLoading, setRegisterLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Handle Login
    async function handleLogin(e) {
        e.preventDefault();
        setLoginError("");
        setLoginLoading(true);
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signIn"])("credentials", {
                email: loginEmail,
                password: loginPassword,
                redirect: false
            });
            if (result?.error) {
                setLoginError(result.error);
            } else {
                const callbackUrl = searchParams.get("callbackUrl");
                if (callbackUrl) {
                    router.push(callbackUrl);
                } else {
                    router.push("/");
                }
                router.refresh();
            }
        } catch (error) {
            setLoginError("Bir hata oluştu");
        } finally{
            setLoginLoading(false);
        }
    }
    // Handle Register
    async function handleRegister(e) {
        e.preventDefault();
        setRegisterError("");
        setRegisterSuccess("");
        setRegisterLoading(true);
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: registerName,
                    email: registerEmail,
                    password: registerPassword,
                    phone: registerPhone,
                    tcNo: registerTcNo,
                    address: registerAddress,
                    city: registerCity
                })
            });
            const data = await response.json();
            if (!response.ok) {
                setRegisterError(data.error || "Kayıt başarısız");
            } else {
                setRegisterSuccess("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
                setRegisterName("");
                setRegisterEmail("");
                setRegisterPassword("");
                setRegisterPhone("");
                setRegisterTcNo("");
                setRegisterAddress("");
                setRegisterCity("");
                // 2 saniye sonra giriş formuna geç
                const callbackUrl = searchParams.get("callbackUrl");
                setTimeout(()=>{
                    if (callbackUrl) {
                        router.push(callbackUrl);
                    } else {
                        router.push("/");
                    }
                    router.refresh();
                }, 1500);
            }
        } catch (error) {
            setRegisterError("Bir hata oluştu");
        } finally{
            setRegisterLoading(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$giris$2f$giris$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].page,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$giris$2f$giris$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].container} ${aktif ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$giris$2f$giris$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].active : ""}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$giris$2f$giris$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].formContainer} ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$giris$2f$giris$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].signUp}`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleRegister,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: "/Logo.svg",
                                alt: "4T Akademi",
                                width: 140,
                                height: 45,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$giris$2f$giris$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].logo,
                                priority: true
                            }, void 0, false, {
                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                lineNumber: 123,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                children: "Hesap Oluştur"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                lineNumber: 132,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mb-4 text-xs text-gray-500",
                                children: "Tüm eğitimlere erişim için kayıt olun"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                lineNumber: 133,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Ad Soyad",
                                value: registerName,
                                onChange: (e)=>setRegisterName(e.target.value),
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                lineNumber: 135,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "email",
                                placeholder: "E-posta",
                                value: registerEmail,
                                onChange: (e)=>setRegisterEmail(e.target.value),
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                lineNumber: 142,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "tel",
                                placeholder: "Telefon",
                                value: registerPhone,
                                onChange: (e)=>setRegisterPhone(e.target.value),
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                lineNumber: 149,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "TC Kimlik No (Fatura için)",
                                value: registerTcNo,
                                onChange: (e)=>{
                                    const v = e.target.value.replace(/\D/g, '').slice(0, 11);
                                    setRegisterTcNo(v);
                                },
                                maxLength: 11,
                                inputMode: "numeric"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                lineNumber: 156,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Şehir",
                                value: registerCity,
                                onChange: (e)=>setRegisterCity(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                lineNumber: 167,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Adres",
                                value: registerAddress,
                                onChange: (e)=>setRegisterAddress(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                lineNumber: 173,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "password",
                                placeholder: "Şifre (min. 6 karakter)",
                                value: registerPassword,
                                onChange: (e)=>setRegisterPassword(e.target.value),
                                minLength: 6,
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                lineNumber: 179,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start gap-2 mt-3 mb-2 w-full text-left px-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        id: "contract",
                                        checked: registerContract,
                                        onChange: (e)=>setRegisterContract(e.target.checked),
                                        className: "w-4 h-4 mt-0.5 accent-[#512da8] cursor-pointer",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                        lineNumber: 189,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "contract",
                                        className: "text-xs text-gray-600 cursor-pointer select-none leading-tight",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-bold text-[#512da8]",
                                                children: "Üyelik Sözleşmesi"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                                lineNumber: 198,
                                                columnNumber: 17
                                            }, this),
                                            "'ni ve ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-bold text-[#512da8]",
                                                children: "KVKK Aydınlatma Metni"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                                lineNumber: 198,
                                                columnNumber: 91
                                            }, this),
                                            "'ni okudum, kabul ediyorum."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                        lineNumber: 197,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                lineNumber: 188,
                                columnNumber: 13
                            }, this),
                            registerError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$giris$2f$giris$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].error,
                                children: registerError
                            }, void 0, false, {
                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                lineNumber: 203,
                                columnNumber: 15
                            }, this),
                            registerSuccess && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$giris$2f$giris$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].success,
                                children: registerSuccess
                            }, void 0, false, {
                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                lineNumber: 206,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: registerLoading || !registerContract,
                                children: registerLoading ? "Kaydediliyor..." : "Kayıt Ol"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                lineNumber: 209,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                        lineNumber: 122,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                    lineNumber: 121,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$giris$2f$giris$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].formContainer} ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$giris$2f$giris$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].signIn}`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleLogin,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: "/Logo.svg",
                                alt: "4T Akademi",
                                width: 120,
                                height: 40,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$giris$2f$giris$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].logo
                            }, void 0, false, {
                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                lineNumber: 218,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                children: "Giriş Yap"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                lineNumber: 226,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "E-posta ve şifre ile giriş"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                lineNumber: 228,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "email",
                                placeholder: "E-posta",
                                value: loginEmail,
                                onChange: (e)=>setLoginEmail(e.target.value),
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                lineNumber: 230,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "password",
                                placeholder: "Şifre",
                                value: loginPassword,
                                onChange: (e)=>setLoginPassword(e.target.value),
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                lineNumber: 237,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "#",
                                children: "Şifremi Unuttum"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                lineNumber: 245,
                                columnNumber: 13
                            }, this),
                            loginError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$giris$2f$giris$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].error,
                                children: loginError
                            }, void 0, false, {
                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                lineNumber: 248,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: loginLoading,
                                children: loginLoading ? "Giriş yapılıyor..." : "Giriş Yap"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                lineNumber: 251,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                        lineNumber: 217,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                    lineNumber: 216,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$giris$2f$giris$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].toggleContainer,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$giris$2f$giris$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].toggle,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$giris$2f$giris$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].togglePanel} ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$giris$2f$giris$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].toggleLeft}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        children: "Tekrar Hoş Geldin!"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                        lineNumber: 261,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "Hesabına giriş yaparak tüm ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                children: "4T Akademi"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                                lineNumber: 263,
                                                columnNumber: 44
                                            }, this),
                                            " özelliklerini kullan"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                        lineNumber: 262,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$giris$2f$giris$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].hiddenBtn,
                                        onClick: ()=>setAktif(false),
                                        type: "button",
                                        children: "Giriş Yap"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                        lineNumber: 265,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                lineNumber: 260,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$giris$2f$giris$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].togglePanel} ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$giris$2f$giris$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].toggleRight}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        children: "Merhaba!"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                        lineNumber: 275,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "Kayıt ol, ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                children: "KPSS A & B"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                                lineNumber: 277,
                                                columnNumber: 27
                                            }, this),
                                            " için tüm içeriklere eriş"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                        lineNumber: 276,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$giris$2f$giris$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].hiddenBtn,
                                        onClick: ()=>setAktif(true),
                                        type: "button",
                                        children: "Kayıt Ol"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                        lineNumber: 279,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                                lineNumber: 274,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                        lineNumber: 259,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
                    lineNumber: 258,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
            lineNumber: 119,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/4t-akademi-yeni/src/app/giris/GirisClient.tsx",
        lineNumber: 118,
        columnNumber: 5
    }, this);
}
_s(GirisClient, "hf9+tShHaWnfHS9Tyedm0ghW1bY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = GirisClient;
var _c;
__turbopack_context__.k.register(_c, "GirisClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_4t-akademi-yeni_src_app_giris_ce260bd0._.js.map