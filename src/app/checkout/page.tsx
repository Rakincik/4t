"use client";

import React, { useMemo, useState } from "react";
import { contractTextParagraphs } from "./contractText";
import MainHeader from "@/app/components/MainHeader";
import Footer from "@/app/components/Footer";
import { useCart } from "@/app/components/cart/cartStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  CheckBadgeIcon,
  LockClosedIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";

/* ===================================================== */
/* Utils                                                 */
/* ===================================================== */
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function formatTRY(n: number) {
  try {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `₺${Math.round(n)}`;
  }
}

/* ===================================================== */
/* Page                                                  */
/* ===================================================== */
type Step = 1 | 2 | 3;

export default function CheckoutPage() {
  // ✅ store
  const cart = useCart();

  /**
   * Beklenen shape:
   * cart.state.items: { id, title, price, qty }[]
   * cart.subtotal / cart.total: number
   *
   * ✅ ADAPT:
   * Eğer sende `inc/dec/remove/clear` yoksa:
   * - useCart store’una bu action’ları ekle (önerilir)
   * - veya aşağıdaki butonları pasif yap.
   */
  const { state, subtotal, total } = cart as any;
  const items = (state?.items ?? []) as Array<{
    id: string;
    title: string;
    price: number;
    qty: number;
  }>;

  const hasActions =
    typeof (cart as any).inc === "function" &&
    typeof (cart as any).dec === "function" &&
    typeof (cart as any).remove === "function";

  const [step, setStep] = useState<Step>(1);

  // form
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [tcNo, setTcNo] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

  // credit card details
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvc, setCvc] = useState("");


  // cities data
  const [citiesData, setCitiesData] = useState<{name: string, districts: string[]}[]>([]);

  React.useEffect(() => {
    fetch("/iller.json")
      .then(r => r.json())
      .then(setCitiesData)
      .catch(console.error);
  }, []);

  const availableDistricts = useMemo(() => {
    if (!city) return [];
    const found = citiesData.find(c => c.name === city);
    return found ? found.districts : [];
  }, [city, citiesData]);

  // checkout controls
  const [agree, setAgree] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"EFT" | "CC">("EFT");
  const [errorMsg, setErrorMsg] = useState("");

  // Installment states
  const [installments, setInstallments] = useState<any[]>([]);
  const [selectedInstallment, setSelectedInstallment] = useState<number>(1);
  const [fetchingInstallments, setFetchingInstallments] = useState(false);
  const [lastFetchedBin, setLastFetchedBin] = useState("");
  const [hasReadContract, setHasReadContract] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    async function loadSavedProfile() {
      if (status !== "authenticated") return;
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.name) setFullName(data.name);
          if (data.phone) setPhone(data.phone);
          if (data.email) setEmail(data.email);
          if (data.tcNo) setTcNo(data.tcNo);
          if (data.city) setCity(data.city);
          if (data.district) setDistrict(data.district);
          if (data.address) setAddress(data.address);
        }
      } catch (err) {
        console.error("Failed to load saved checkout profile details:", err);
      }
    }
    loadSavedProfile();
  }, [status]);

  const disabled = items.length === 0;

  const stepTitle = useMemo(() => {
    if (step === 1) return "Bilgiler";
    if (step === 2) return "Ödeme";
    return "Onay";
  }, [step]);

  const infoValid = useMemo(() => {
    const eOk = email.trim().includes("@") && email.trim().includes(".");
    const pOk = phone.replace(/\D/g, "").length >= 10;
    const tcOk = tcNo.trim().length === 11;
    return fullName.trim().length >= 3 && pOk && eOk && tcOk && city && district && address.trim().length >= 10;
  }, [fullName, phone, email, tcNo, city, district, address]);

  const hasInstallmentRestricted = useMemo(() => {
    return items.some(item => (item as any).isInstallmentApplicable === false);
  }, [items]);

  const cardValid = useMemo(() => {
    if (paymentMethod === "EFT") return true;
    const nameOk = cardHolderName.trim().length >= 3;
    const numOk = cardNumber.replace(/\D/g, "").length === 16;
    const monthOk = expMonth.trim().length === 2 && Number(expMonth) >= 1 && Number(expMonth) <= 12;
    const yearLength = expYear.trim().length;
    const yearOk = (yearLength === 2 || yearLength === 4) && Number(expYear) >= (yearLength === 2 ? Number(new Date().getFullYear().toString().slice(-2)) : new Date().getFullYear());
    const cvcOk = cvc.trim().length >= 3 && cvc.trim().length <= 4;
    return nameOk && numOk && monthOk && yearOk && cvcOk;
  }, [paymentMethod, cardHolderName, cardNumber, expMonth, expYear, cvc]);


  async function fetchInstallments(bin: string) {
    if (hasInstallmentRestricted) return;
    if (bin === lastFetchedBin) return;
    setLastFetchedBin(bin);
    setFetchingInstallments(true);
    try {
      const res = await fetch("/api/checkout/installments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ binCode: bin, totalPrice: total ?? subtotal }),
      });
      const result = await res.json();
      if (res.ok && result.success && result.data?.InstallmentHeaderList) {
        const header = result.data.InstallmentHeaderList[0];
        if (header && header.InstallmentDetailList) {
          setInstallments(header.InstallmentDetailList);
        } else {
          setInstallments([]);
        }
      } else {
        setInstallments([]);
      }
    } catch (err) {
      console.error("Installment fetch error:", err);
      setInstallments([]);
    } finally {
      setFetchingInstallments(false);
    }
  }

  async function handleStep1Submit() {
    setStep(2);
    try {
      await fetch("/api/checkout/abandoned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email: email,
          phone: phone,
          courses: items.map(i => ({ id: i.id, title: i.title }))
        })
      });
    } catch (err) {
      console.error("Failed to log abandoned cart:", err);
    }
  }

  async function onPayStart() {
    setStep(3);
  }

  async function onComplete() {
    if (!agree) return;
    setPaying(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({ 
            id: i.id, 
            qty: i.qty,
            variantId: (i as any).variantId,
            selectedAddonIds: (i as any).selectedAddonIds || []
          })),
          customerName: fullName,
          customerPhone: phone,
          customerEmail: email,
          customerTc: tcNo,
          customerCity: city,
          customerDistrict: district,
          customerAddress: address,
          paymentMethod: paymentMethod === "EFT" ? "EFT / Havale" : "Kredi Kartı",
          couponCode: (state as any).coupon?.code,
          cardHolderName: paymentMethod === "CC" ? cardHolderName : undefined,
          cardNumber: paymentMethod === "CC" ? cardNumber.replace(/\D/g, "") : undefined,
          expMonth: paymentMethod === "CC" ? expMonth : undefined,
          expYear: paymentMethod === "CC" ? expYear : undefined,
          cvc: paymentMethod === "CC" ? cvc : undefined,
          installmentNumber: paymentMethod === "CC" ? selectedInstallment : 1
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Sipariş oluşturulamadı.");
      }

      if (paymentMethod === "EFT") {
        // Başarılı! Sepeti temizle
        if (typeof (cart as any).clear === "function") {
          (cart as any).clear();
        }
        // Başarı sayfasına git
        window.location.href = `/checkout/success?orderId=${result.orderId}`;
      } else {
        // Kredi Kartı ise Moka 3D Secure yönlendirmesi yap
        if (result.redirectUrl) {
          window.location.href = result.redirectUrl;
        } else {
          throw new Error("Ödeme yönlendirme adresi alınamadı.");
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
      setPaying(false);
    }

  }

  // Not Logged In View
  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-light pb-10 flex flex-col">
        <MainHeader />
        <section className="container mx-auto max-w-xl px-4 pt-40 pb-20 flex-1 flex flex-col items-center justify-center">
          <div className="rounded-3xl border border-black/10 bg-white p-8 text-center w-full shadow-lg">
            <LockClosedIcon className="h-10 w-10 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-extrabold text-dark tracking-tight">Eğitime Başlamak İçin Giriş Yap</h1>
            <p className="mt-3 text-dark/70">
              Satın alma işlemine devam edebilmek ve eğitimlerin hesabına tanımlanabilmesi için kayıtlı olman gerekiyor.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push("/giris?callbackUrl=/checkout")}
                className="w-full rounded-2xl px-5 py-3 font-extrabold text-white btn-4t-secondary"
              >
                Giriş Yap / Üye Ol
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  if (status === "loading") {
    return (
       <main className="min-h-screen bg-light text-center pt-40">Yükleniyor...</main>
    )
  }

  return (
    // ✅ mobile bottom boşluk (ileride sticky bar gelirse)
    <main className="min-h-screen bg-light pb-10">
      <MainHeader />

      <section className="container mx-auto max-w-7xl px-4 pt-12 pb-20">
        {/* शीर्ष */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-extrabold text-dark/60">
              <LockClosedIcon className="h-4 w-4 text-primary" />
              Güvenli checkout
            </div>
            <h1 className="mt-3 text-3xl font-extrabold text-dark">
              Satın alma • {stepTitle}
            </h1>
            <p className="mt-2 text-sm text-dark/60">
              Sepetini tamamla, ödeme adımına geç, erişim otomatik açılsın.
            </p>
          </div>

          {/* Stepper (desktop) */}
          <div className="hidden sm:flex items-center gap-2">
            {[1, 2, 3].map((n) => {
              const active = step === n;
              const done = step > n;
              return (
                <button
                  key={n}
                  disabled={disabled || (n === 2 && !infoValid) || (n === 3 && !infoValid)}
                  onClick={() => setStep(n as Step)}
                  className={cn(
                    "rounded-2xl px-4 py-2 border text-sm font-extrabold transition",
                    active
                      ? "border-primary text-primary bg-white"
                      : done
                      ? "border-black/10 bg-white text-dark hover:bg-light-muted"
                      : "border-black/10 bg-white text-dark/50 hover:bg-light-muted",
                    disabled ? "opacity-40 cursor-not-allowed" : ""
                  )}
                >
                  {done ? "✓" : n}
                </button>
              );
            })}
          </div>

          {/* Stepper (mobile) */}
          <div className="sm:hidden">
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((n) => {
                const active = step === n;
                const locked = (n !== 1 && !infoValid) || disabled;
                return (
                  <button
                    key={n}
                    onClick={() => !locked && setStep(n as Step)}
                    className={cn(
                      "rounded-2xl px-3 py-2 border text-xs font-extrabold transition",
                      active ? "border-primary text-primary bg-white" : "border-black/10 bg-white text-dark/60",
                      locked ? "opacity-40" : "hover:bg-light-muted"
                    )}
                  >
                    {n === 1 ? "Bilgi" : n === 2 ? "Ödeme" : "Onay"}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {disabled ? (
              <div className="rounded-3xl border border-black/10 bg-white p-8">
                <div className="text-xl font-extrabold text-dark">Sepet boş</div>
                <div className="mt-2 text-sm text-dark/60">
                  Ödemeye geçmeden önce kurs eklemelisin.
                </div>
                <a
                  href="/kurslar"
                  className="mt-6 inline-flex items-center justify-center rounded-2xl px-6 py-3 font-extrabold text-white btn-4t"
                >
                  Kurslara Git <ArrowRightIcon className="h-5 w-5 ml-2" />
                </a>
              </div>
            ) : (
              <>
                {/* STEP 1 */}
                {step === 1 && (
                  <div className="rounded-3xl border border-black/10 bg-white p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-lg font-extrabold text-dark">
                          İletişim bilgileri
                        </div>
                        <div className="mt-1 text-sm text-dark/60">
                          Erişim ve fatura süreçleri için gerekli.
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-black/10 bg-light px-4 py-2 text-xs font-extrabold text-dark/70">
                        <CheckBadgeIcon className="h-4 w-4 text-primary" />
                        2 dk’da tamamlanır
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-bold text-dark/60 mb-2">Ad Soyad</div>
                        <input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full rounded-2xl border border-black/10 bg-white p-3 sm:p-4 outline-none focus:border-[#DC2626] focus:ring-4 focus:ring-red-100/50 focus:shadow-md transition-all duration-300"
                          placeholder="Ad Soyad"
                        />
                      </div>

                      <div>
                        <div className="text-xs font-bold text-dark/60 mb-2">Telefon</div>
                        <input
                          value={phone}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, '').slice(0, 11);
                            setPhone(v);
                          }}
                          className="w-full rounded-2xl border border-black/10 bg-white p-3 sm:p-4 outline-none focus:border-[#DC2626] focus:ring-4 focus:ring-red-100/50 focus:shadow-md transition-all duration-300"
                          placeholder="05xx xxx xx xx"
                          maxLength={11}
                          inputMode="tel"
                        />
                      </div>

                      <div>
                        <div className="text-xs font-bold text-dark/60 mb-2">E-posta</div>
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-2xl border border-black/10 bg-white p-3 sm:p-4 outline-none focus:border-[#DC2626] focus:ring-4 focus:ring-red-100/50 focus:shadow-md transition-all duration-300"
                          placeholder="ornek@mail.com"
                        />
                      </div>

                      <div>
                        <div className="text-xs font-bold text-dark/60 mb-2">TC Kimlik No (Zorunlu)</div>
                        <input
                          value={tcNo}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, '').slice(0, 11);
                            setTcNo(v);
                          }}
                          className="w-full rounded-2xl border border-black/10 bg-white p-3 sm:p-4 outline-none focus:border-[#DC2626] focus:ring-4 focus:ring-red-100/50 focus:shadow-md transition-all duration-300"
                          placeholder="TC Kimlik Nonuz"
                          maxLength={11}
                          inputMode="numeric"
                        />
                      </div>

                      <div>
                        <div className="text-xs font-bold text-dark/60 mb-2">İl</div>
                        <select
                          value={city}
                          onChange={(e) => {
                            setCity(e.target.value);
                            setDistrict("");
                          }}
                          className="w-full rounded-2xl border border-black/10 bg-white p-3 sm:p-4 outline-none focus:border-[#DC2626] focus:ring-4 focus:ring-red-100/50 focus:shadow-md transition-all duration-300"
                        >
                          <option value="">İl Seçiniz</option>
                          {citiesData.map(c => (
                            <option key={c.name} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-dark/60 mb-2">İlçe</div>
                        <select
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          disabled={!city}
                          className="w-full rounded-2xl border border-black/10 bg-white p-3 sm:p-4 outline-none focus:border-[#DC2626] focus:ring-4 focus:ring-red-100/50 focus:shadow-md transition-all duration-300 disabled:opacity-50"
                        >
                          <option value="">İlçe Seçiniz</option>
                          {availableDistricts.map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <div className="text-xs font-bold text-dark/60 mb-2">Açık Adres</div>
                        <textarea
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full rounded-2xl border border-black/10 bg-white p-3 sm:p-4 outline-none focus:border-[#DC2626] focus:ring-4 focus:ring-red-100/50 focus:shadow-md transition-all duration-300"
                          placeholder="Açık adresinizi, mahalle/sokak/kapı no olarak yazınız"
                          rows={2}
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
                      <a
                        href="/kurslar"
                        className="w-full sm:w-auto flex-1 rounded-2xl px-5 py-3 font-extrabold border border-black/10 bg-white hover:bg-light-muted transition text-center"
                      >
                        Kurslara dön
                      </a>

                      <button
                        onClick={handleStep1Submit}
                        disabled={!infoValid}
                        className={cn(
                          "w-full sm:w-auto flex-1 rounded-2xl px-5 py-3 font-extrabold text-white btn-4t",
                          !infoValid && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        Devam Et
                      </button>
                    </div>

                    {!infoValid && (
                      <div className="mt-3 text-xs text-dark/50 text-center font-medium bg-red-50 p-2 rounded-lg border border-red-100 text-red-600">
                        Devam etmek için tüm iletişim ve adres fatura alanlarını eksiksiz doldurunuz.
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div className="rounded-3xl border border-black/10 bg-white p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-lg font-extrabold text-dark">Ödeme Yöntemi</div>
                        <div className="mt-1 text-sm text-dark/60">
                          Sizin için en uygun olan seçeneği işaretleyin.
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-light px-4 py-2 text-xs font-extrabold text-dark/70">
                        <CreditCardIcon className="h-4 w-4 text-primary" />
                        Güvenli
                      </div>
                    </div>

                    {/* Method Selector */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label 
                         className={cn(
                           "flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition",
                           paymentMethod === "EFT" ? "border-primary bg-primary/5" : "border-black/10 bg-white hover:border-black/20"
                         )}
                      >
                         <input type="radio" className="mt-1" name="paymethod" checked={paymentMethod === "EFT"} onChange={() => setPaymentMethod("EFT")} />
                         <div>
                            <div className="font-extrabold text-dark">EFT / Havale ile Öde</div>
                            <div className="text-xs text-dark/60 mt-1">Siparişi onayladıktan sonra 4T Akademi banka hesaplarına transfer gerçekleştirebilirsiniz. Hızlı onay ve komisyonsuz.</div>
                         </div>
                      </label>

                      <label 
                         className={cn(
                           "flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition",
                           paymentMethod === "CC" ? "border-primary bg-primary/5" : "border-black/10 bg-white hover:border-black/20"
                         )}
                      >
                         <input type="radio" className="mt-1" name="paymethod" checked={paymentMethod === "CC"} onChange={() => setPaymentMethod("CC")} />
                         <div>
                            <div className="font-extrabold text-dark flex items-center justify-between">
                              <span>Kredi Kartı ile Öde</span>
                              <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full uppercase tracking-wider">Aktif</span>
                            </div>
                            <div className="text-xs text-dark/60 mt-1">Moka POS altyapısı ile 3D Secure güvenli ödeme. Kredi kartı veya banka kartıyla peşin ödeyin.</div>
                         </div>
                      </label>
                    </div>

                    {/* Credit Card Form */}
                    {paymentMethod === "CC" && (
                      <div className="mt-6 border-t border-black/10 pt-6 space-y-4">
                        <div className="text-sm font-extrabold text-dark mb-2">Kart Bilgileri</div>
                        
                        <div>
                          <div className="text-xs font-bold text-dark/60 mb-2">Kart Sahibi Ad Soyad</div>
                          <input
                            value={cardHolderName}
                            onChange={(e) => setCardHolderName(e.target.value)}
                            className="w-full rounded-2xl border border-black/10 bg-white p-3 sm:p-4 outline-none focus:border-[#DC2626] focus:ring-4 focus:ring-red-100/50 focus:shadow-md transition-all duration-300"
                            placeholder="Kartın üzerindeki isim"
                          />
                        </div>

                        <div>
                          <div className="text-xs font-bold text-dark/60 mb-2">Kart Numarası</div>
                          <input
                            value={cardNumber}
                            onChange={(e) => {
                              const raw = e.target.value;
                              const formatted = raw
                                .replace(/\D/g, "")
                                .replace(/(.{4})/g, "$1 ")
                                .trim()
                                .substring(0, 19);
                              setCardNumber(formatted);

                              const clean = formatted.replace(/\D/g, "");
                              if (clean.length < 6) {
                                setInstallments([]);
                                setLastFetchedBin("");
                                setSelectedInstallment(1);
                              } else if (clean.length >= 6) {
                                if (hasInstallmentRestricted) {
                                  setSelectedInstallment(1);
                                } else {
                                  fetchInstallments(clean.substring(0, 6));
                                }
                              }
                            }}
                            className="w-full rounded-2xl border border-black/10 bg-white p-3 sm:p-4 outline-none focus:border-[#DC2626] focus:ring-4 focus:ring-red-100/50 focus:shadow-md transition-all duration-300 font-mono"
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="col-span-2">
                            <div className="text-xs font-bold text-dark/60 mb-2">Son Kullanma Tarihi</div>
                            <div className="flex gap-2">
                              <select
                                value={expMonth}
                                onChange={(e) => setExpMonth(e.target.value)}
                                className="w-full rounded-2xl border border-black/10 bg-white p-3 sm:p-4 outline-none focus:border-[#DC2626] focus:ring-4 focus:ring-red-100/50 focus:shadow-md transition-all duration-300"
                              >
                                <option value="">Ay</option>
                                {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map(m => (
                                  <option key={m} value={m}>{m}</option>
                                ))}
                              </select>

                              <select
                                value={expYear}
                                onChange={(e) => setExpYear(e.target.value)}
                                className="w-full rounded-2xl border border-black/10 bg-white p-3 sm:p-4 outline-none focus:border-[#DC2626] focus:ring-4 focus:ring-red-100/50 focus:shadow-md transition-all duration-300"
                              >
                                <option value="">Yıl</option>
                                {Array.from({ length: 11 }, (_, i) => String(new Date().getFullYear() + i)).map(y => (
                                  <option key={y} value={y}>{y}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <div className="text-xs font-bold text-dark/60 mb-2">CVC</div>
                            <input
                              value={cvc}
                              onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                              className="w-full rounded-2xl border border-black/10 bg-white p-3 sm:p-4 outline-none focus:border-[#DC2626] focus:ring-4 focus:ring-red-100/50 focus:shadow-md transition-all duration-300 font-mono text-center"
                              placeholder="123"
                              maxLength={4}
                            />
                          </div>
                        </div>

                        {/* Taksit Seçenekleri */}
                        {hasInstallmentRestricted ? (
                          <div className="mt-4 border-t border-black/10 pt-4">
                            <div className="text-xs font-bold text-dark/60 mb-2 font-extrabold">Taksit Seçenekleri</div>
                            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-2xl text-xs flex flex-col gap-1 font-semibold leading-relaxed mb-3">
                              <span>⚠️ Sepetinizdeki bazı ürünler taksitli ödemeye uygun değildir.</span>
                              <span className="font-normal text-amber-700">Bu sipariş için sadece Tek Çekim seçeneği geçerlidir.</span>
                            </div>
                            <div className="space-y-2">
                              <label className="flex items-center justify-between rounded-2xl border-2 border-primary bg-primary/5 p-3 text-sm font-extrabold select-none cursor-default">
                                <div className="flex items-center gap-3">
                                  <input
                                    type="radio"
                                    checked={true}
                                    readOnly
                                    className="h-4 w-4 text-primary focus:ring-primary/30"
                                  />
                                  <span className="text-xs font-bold text-dark">Tek Çekim</span>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs font-extrabold text-primary">{formatTRY(total ?? subtotal)} / ay</div>
                                </div>
                              </label>
                            </div>
                          </div>
                        ) : (installments.length > 0 || fetchingInstallments) && (
                          <div className="mt-4 border-t border-black/10 pt-4">
                            <div className="text-xs font-bold text-dark/60 mb-2 font-extrabold">Taksit Seçenekleri</div>
                            {fetchingInstallments ? (
                              <div className="text-xs text-dark/50 animate-pulse py-2">Taksit seçenekleri sorgulanıyor...</div>
                            ) : (
                              <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-visible pr-2">
                                {installments.map((inst: any) => {
                                  const count = inst.InstallmentNumber;
                                  const isSelected = selectedInstallment === count;
                                  const monthlyAmount = inst.Amount;
                                  const totalPayable = inst.TotalPrice;
                                  return (
                                    <label
                                      key={count}
                                      className={cn(
                                        "flex cursor-pointer items-center justify-between rounded-2xl border p-3 transition text-sm select-none",
                                        isSelected ? "border-primary bg-primary/5 font-extrabold" : "border-black/10 bg-white hover:border-black/20"
                                      )}
                                    >
                                      <div className="flex items-center gap-3">
                                        <input
                                          type="radio"
                                          name="installment"
                                          checked={isSelected}
                                          onChange={() => setSelectedInstallment(count)}
                                          className="h-4 w-4 text-primary focus:ring-primary/30"
                                        />
                                        <span className="text-xs font-bold text-dark">
                                          {count === 1 ? "Tek Çekim" : `${count} Taksit`}
                                        </span>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-xs font-extrabold text-primary">{formatTRY(monthlyAmount)} / ay</div>
                                        {count > 1 && (
                                          <div className="text-[10px] text-dark/50 font-normal">Toplam: {formatTRY(totalPayable)}</div>
                                        )}
                                      </div>
                                    </label>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}




                    <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
                      <button
                        onClick={() => setStep(1)}
                        className="w-full sm:w-auto flex-1 rounded-2xl px-5 py-3 font-extrabold border border-black/10 bg-white hover:bg-light-muted transition"
                      >
                        Geri
                      </button>
                      <button
                        onClick={onPayStart}
                        disabled={paying || !cardValid}
                        className={cn(
                          "w-full sm:w-auto flex-1 rounded-2xl px-5 py-3 font-extrabold text-white transition",
                          (paying || !cardValid) ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "btn-4t",
                          paying && "opacity-70 cursor-wait"
                        )}
                      >
                        {paying ? "Başlatılıyor..." : "Devam Et"}
                      </button>
                    </div>

                  </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <div className="rounded-3xl border border-black/10 bg-white p-4 sm:p-6">
                    <div className="text-lg font-extrabold text-dark">Onay</div>

                    <div className="mt-4 border border-black/10 rounded-2xl bg-light p-4">
                      <div className="text-xs font-bold text-dark/70 mb-2">Öğrenim ve Eğitim Hizmetleri Sözleşmesi</div>
                      <div 
                        onScroll={(e) => {
                          const target = e.currentTarget;
                          const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 15;
                          if (isAtBottom) {
                            setHasReadContract(true);
                          }
                        }}
                        className="h-44 overflow-y-auto scrollbar-visible text-[11px] text-dark/60 space-y-2 pr-2 font-medium leading-relaxed bg-white border border-black/5 rounded-xl p-3"
                      >
                        {contractTextParagraphs.map((p, idx) => (
                          <p key={idx}>{p}</p>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 rounded-3xl border border-black/10 bg-light p-5">
                      <div className="flex items-start gap-3">
                        <ShieldCheckIcon className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-extrabold text-dark">
                            {paymentMethod === "EFT" ? "Havale İşlemi" : "Erişim otomatik açılır"}
                          </div>
                          <div className="mt-1 text-sm text-dark/60">
                            {paymentMethod === "EFT" 
                              ? "Sipariş onayından sonra dekont göndermeniz gerekecek. Tüm IBAN detayları bu adımdan sonra gösterilecektir." 
                              : "Ödeme onayından sonra panelde kursların aktif olur."}
                          </div>
                        </div>
                      </div>
                    </div>

                    <label className={cn(
                      "mt-6 flex items-start gap-3 select-none",
                      hasReadContract ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                    )}>
                      <input
                        type="checkbox"
                        checked={agree}
                        disabled={!hasReadContract}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="mt-1 h-5 w-5 rounded border-black/20"
                      />
                      <span className="text-sm text-dark/70">
                        Mesafeli satış sözleşmesini ve KVKK aydınlatma metnini okudum, kabul ediyorum.
                        {!hasReadContract && (
                          <span className="block text-xs text-red-500 font-extrabold mt-1 animate-pulse font-sans">
                            (Onaylamak için lütfen sözleşmeyi sonuna kadar kaydırın.)
                          </span>
                        )}
                      </span>
                    </label>

                    <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
                      <button
                        onClick={() => setStep(2)}
                        className="w-full sm:w-auto flex-1 rounded-2xl px-5 py-3 font-extrabold border border-black/10 bg-white hover:bg-light-muted transition"
                      >
                        Geri
                      </button>
                      <button
                        onClick={onComplete}
                        disabled={!agree || paying}
                        className={cn(
                          "w-full sm:w-auto flex-1 rounded-2xl px-5 py-3 font-extrabold text-white btn-4t-secondary",
                          (!agree || paying) && "opacity-60 cursor-not-allowed"
                        )}
                      >
                        {paying ? "Tamamlanıyor..." : "Siparişi Tamamla"}
                      </button>
                    </div>

                    {errorMsg && (
                       <div className="mt-4 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-bold border border-red-100">
                         {errorMsg}
                       </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* RIGHT */}
          <aside className="lg:sticky lg:top-28 space-y-4">
            <div className="rounded-3xl border border-black/10 bg-white p-4 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-dark/60">Sipariş özeti</div>
                  <div className="mt-1 text-xs text-dark/50">
                    {items.length} ürün
                  </div>
                </div>

                {items.length > 0 && (
                  <div className="flex items-center gap-2 text-xs font-extrabold text-dark/60">
                    <LockClosedIcon className="h-4 w-4 text-primary" />
                    Güvenli
                  </div>
                )}
              </div>

              <div className="mt-5 space-y-3">
                {items.map((it) => (
                  <div
                    key={it.id}
                    className="rounded-2xl border border-black/10 bg-light p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-extrabold text-dark truncate">
                          {it.title?.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ")}
                        </div>
                        <div className="mt-1 text-xs text-dark/50">
                          {formatTRY(it.price)} / adet
                        </div>
                      </div>

                      <div className="text-sm font-extrabold text-primary">
                        {formatTRY(it.price * it.qty)}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2">
                        <button
                          type="button"
                          disabled={!hasActions}
                          onClick={() => (cart as any).dec?.(it.id)}
                          className={cn(
                            "p-1 rounded-lg hover:bg-light-muted transition",
                            !hasActions && "opacity-40 cursor-not-allowed"
                          )}
                          aria-label="Azalt"
                        >
                          <MinusIcon className="h-4 w-4 text-dark/70" />
                        </button>

                        <div className="text-xs font-extrabold text-dark w-6 text-center">
                          {it.qty}
                        </div>

                        <button
                          type="button"
                          disabled={!hasActions}
                          onClick={() => (cart as any).inc?.(it.id)}
                          className={cn(
                            "p-1 rounded-lg hover:bg-light-muted transition",
                            !hasActions && "opacity-40 cursor-not-allowed"
                          )}
                          aria-label="Arttır"
                        >
                          <PlusIcon className="h-4 w-4 text-dark/70" />
                        </button>
                      </div>

                      <button
                        type="button"
                        disabled={!hasActions}
                        onClick={() => (cart as any).remove?.(it.id)}
                        className={cn(
                          "inline-flex items-center gap-2 text-xs font-extrabold text-secondary hover:opacity-90",
                          !hasActions && "opacity-40 cursor-not-allowed"
                        )}
                      >
                        <TrashIcon className="h-4 w-4" />
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-black/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark/60 font-bold">Ara toplam</span>
                  <span className="text-dark font-extrabold">
                    {formatTRY(subtotal ?? 0)}
                  </span>
                </div>

                {(state as any).coupon && (
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-dark/60 font-bold">Kupon İndirimi ({(state as any).coupon.code})</span>
                    <span className="text-green-600 font-extrabold">
                      -{formatTRY((state as any).coupon.type === 'PERCENT' ? (subtotal * (state as any).coupon.amount) / 100 : (state as any).coupon.amount)}
                    </span>
                  </div>
                )}

                <div className="mt-2 flex items-center justify-between text-sm border-t border-black/10 pt-2">
                  <span className="text-dark/60 font-bold">Toplam</span>
                  <span className="text-primary font-extrabold">
                    {formatTRY(total ?? subtotal ?? 0)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-extrabold text-dark/70">
                  <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2">
                    <ShieldCheckIcon className="h-4 w-4 text-primary" />
                    KVKK
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2">
                    <CreditCardIcon className="h-4 w-4 text-primary" />
                    Taksit imkanı
                  </div>
                </div>

                {/* Quick proceed button on right card */}
                <button
                  onClick={() => {
                    if (disabled) return;
                    if (step === 1 && infoValid) setStep(2);
                    else if (step === 1 && !infoValid) {
                      // küçük yönlendirme hissi
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    } else if (step === 2) onPayStart();
                  }}
                  disabled={disabled || (step === 1 && !infoValid) || (step === 2 && !cardValid) || paying}
                  className={cn(
                    "mt-5 w-full rounded-2xl px-5 py-3 font-extrabold text-white btn-4t",
                    (disabled || (step === 1 && !infoValid) || (step === 2 && !cardValid) || paying) &&
                      "opacity-60 cursor-not-allowed"
                  )}
                >
                  {step === 1
                    ? infoValid
                      ? "Ödemeye geç"
                      : "Bilgileri doldur"
                    : step === 2
                    ? cardValid
                      ? "Onay adımına geç"
                      : "Kart bilgilerini doldur"
                    : "Onay"}
                </button>


                <div className="mt-3 text-xs text-red-600 font-semibold">
                  * Kart bilgilerinizi girdikten sonra taksit seçeneklerinizi görebilirsiniz.
                </div>
              </div>
            </div>

            {/* Trust card */}
            <div className="rounded-3xl border border-black/10 bg-white p-6">
              <div className="text-sm font-bold text-dark/60">Güven</div>
              <div className="mt-3 space-y-3 text-sm">
                {[
                  "SSL ile şifreli ödeme",
                  "KVKK uyumlu veri işleme",
                  "Ödeme sonrası hızlı aktivasyon",
                ].map((t) => (
                  <div key={t} className="flex items-start gap-2">
                    <CheckBadgeIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-dark/70">{t}</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
