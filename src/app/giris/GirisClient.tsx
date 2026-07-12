"use client";

import { useState } from "react";
import styles from "./giris.module.css";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { logGenerateLead } from "@/lib/gtag";

export default function GirisClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [aktif, setAktif] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerContract, setRegisterContract] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  // Handle Login
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const result = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
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
    } finally {
      setLoginLoading(false);
    }
  }

  // Handle Register
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");
    setRegisterLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
          phone: registerPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setRegisterError(data.error || "Kayıt başarısız");
      } else {
        logGenerateLead("register_form", "User Sign Up");
        setRegisterSuccess("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
        setRegisterName("");
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterPhone("");
        // 2 saniye sonra giriş formuna geç
        const callbackUrl = searchParams.get("callbackUrl");
        setTimeout(() => {
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
    } finally {
      setRegisterLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={`${styles.container} ${aktif ? styles.active : ""}`}>
        {/* SOL / KAYIT OL */}
        <div className={`${styles.formContainer} ${styles.signUp}`}>
          <form onSubmit={handleRegister}>
            <Image
              src="/Logo.svg"
              alt="4T Akademi"
              width={140}
              height={45}
              className={styles.logo}
              priority
            />

            <h1 className="text-2xl font-extrabold text-[#0B1221] mt-2 mb-1">Hesap Oluştur</h1>
            <span className="mb-4 text-xs text-gray-500 font-medium">Tüm eğitimlere erişim için kayıt olun</span>

            <div className="grid grid-cols-2 gap-x-3 w-full">
              <input
                type="text"
                placeholder="Ad Soyad"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                className="col-span-2 text-sm w-full"
                required
              />
              <input
                type="email"
                placeholder="E-posta"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="text-sm w-full"
                required
              />
              <input
                type="tel"
                placeholder="Telefon"
                value={registerPhone}
                onChange={(e) => setRegisterPhone(e.target.value)}
                className="text-sm w-full"
                required
              />
              <input
                type="password"
                placeholder="Şifre (min. 6 krk)"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                minLength={6}
                className="col-span-2 text-sm w-full"
                required
              />
            </div>

            <div className="flex items-start gap-2 mt-3 mb-2 w-full text-left px-1">
              <input
                type="checkbox"
                id="contract"
                checked={registerContract}
                onChange={(e) => setRegisterContract(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-[#512da8] cursor-pointer"
                required
              />
              <label htmlFor="contract" className="text-[11px] text-gray-600 cursor-pointer select-none leading-tight mt-1">
                <span className="font-bold text-[#512da8]">Üyelik Sözleşmesi</span>'ni ve <span className="font-bold text-[#512da8]">KVKK Aydınlatma Metni</span>'ni okudum, kabul ediyorum.
              </label>
            </div>

            {registerError && (
              <div className={styles.error}>{registerError}</div>
            )}
            {registerSuccess && (
              <div className={styles.success}>{registerSuccess}</div>
            )}

            <button type="submit" disabled={registerLoading || !registerContract}>
              {registerLoading ? "Kaydediliyor..." : "Kayıt Ol"}
            </button>

            {/* Mobile Switch Link */}
            <div className="mt-5 md:hidden text-xs text-gray-500 font-semibold text-center">
              Zaten üye misiniz?{" "}
              <button
                type="button"
                onClick={() => setAktif(false)}
                className="text-[#2563EB] hover:underline font-bold cursor-pointer ml-1"
              >
                Giriş Yap
              </button>
            </div>
          </form>
        </div>

        {/* SAĞ / GİRİŞ */}
        <div className={`${styles.formContainer} ${styles.signIn}`}>
          <form onSubmit={handleLogin}>
            <Image
              src="/Logo.svg"
              alt="4T Akademi"
              width={120}
              height={40}
              className={styles.logo}
            />

            <h1 className="text-2xl font-extrabold text-[#0B1221] mt-6 mb-1">Giriş Yap</h1>

            <span className="mb-6 text-sm text-gray-500 font-medium">E-posta ve şifre ile giriş</span>

            <input
              type="email"
              placeholder="E-posta"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Şifre"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />

            <a href="#" className="mt-4 text-sm font-bold text-gray-500 hover:text-[#DC2626] transition-colors self-end">Şifremi Unuttum?</a>

            {loginError && (
              <div className={styles.error}>{loginError}</div>
            )}

            <button type="submit" disabled={loginLoading}>
              {loginLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>

            {/* Mobile Switch Link */}
            <div className="mt-5 md:hidden text-xs text-gray-500 font-semibold text-center">
              Hesabınız yok mu?{" "}
              <button
                type="button"
                onClick={() => setAktif(true)}
                className="text-[#2563EB] hover:underline font-bold cursor-pointer ml-1"
              >
                Kayıt Ol
              </button>
            </div>
          </form>
        </div>

        {/* MOR PANEL */}
        <div className={styles.toggleContainer}>
          <div className={styles.toggle}>
            <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
              <h1 className="text-4xl font-extrabold mb-4">Tekrar Hoş Geldin!</h1>
              <p className="text-lg text-gray-300 font-light mb-8 max-w-[280px]">
                Hesabına giriş yaparak tüm <b>4T Akademi</b> özelliklerini kullanmaya devam et.
              </p>
              <button
                className={styles.hiddenBtn}
                onClick={() => setAktif(false)}
                type="button"
              >
                Giriş Yap
              </button>
            </div>

            <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
              <h1 className="text-4xl font-extrabold mb-4">Merhaba!</h1>
              <p className="text-lg text-gray-300 font-light mb-8 max-w-[280px]">
                Kayıt ol, dünyadaki en seçkin <b>Eğitimlere</b> anında eriş.
              </p>
              <button
                className={styles.hiddenBtn}
                onClick={() => setAktif(true)}
                type="button"
              >
                Kayıt Ol
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
