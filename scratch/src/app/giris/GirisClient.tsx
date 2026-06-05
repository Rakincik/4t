"use client";

import { useState } from "react";
import styles from "./giris.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function GirisClient() {
  const router = useRouter();
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
        // Başarılı giriş - admin mi öğrenci mi kontrol et
        router.push("/");
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
        setRegisterSuccess("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
        setRegisterName("");
        setRegisterEmail("");
        setRegisterPassword("");
        // 2 saniye sonra giriş formuna geç
        setTimeout(() => {
          setAktif(false);
          setRegisterSuccess("");
        }, 2000);
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

            <h1>Hesap Oluştur</h1>
            <span className="mb-4 text-xs text-gray-500">Tüm eğitimlere erişim için kayıt olun</span>

            <input
              type="text"
              placeholder="Ad Soyad"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="E-posta"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Telefon (İsteğe bağlı)"
              value={registerPhone}
              onChange={(e) => setRegisterPhone(e.target.value)}
            />
            <input
              type="password"
              placeholder="Şifre (min. 6 karakter)"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              minLength={6}
              required
            />

            <div className="flex items-start gap-2 mt-3 mb-2 w-full text-left px-1">
              <input
                type="checkbox"
                id="contract"
                checked={registerContract}
                onChange={(e) => setRegisterContract(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-[#512da8] cursor-pointer"
                required
              />
              <label htmlFor="contract" className="text-xs text-gray-600 cursor-pointer select-none leading-tight">
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

            <h1>Giriş Yap</h1>

            <span>E-posta ve şifre ile giriş</span>

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

            <a href="#">Şifremi Unuttum</a>

            {loginError && (
              <div className={styles.error}>{loginError}</div>
            )}

            <button type="submit" disabled={loginLoading}>
              {loginLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
        </div>

        {/* MOR PANEL */}
        <div className={styles.toggleContainer}>
          <div className={styles.toggle}>
            <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
              <h1>Tekrar Hoş Geldin!</h1>
              <p>
                Hesabına giriş yaparak tüm <b>4T Akademi</b> özelliklerini kullan
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
              <h1>Merhaba!</h1>
              <p>
                Kayıt ol, <b>KPSS A & B</b> için tüm içeriklere eriş
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
