import { Suspense } from "react";
import GirisClient from "./GirisClient";

export const metadata = {
  title: "Giriş | 4T Akademi",
};

export default function GirisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-light text-center pt-40">Yükleniyor...</div>}>
      <GirisClient />
    </Suspense>
  );
}
