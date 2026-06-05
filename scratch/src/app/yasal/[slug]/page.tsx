// Dosya Yolu: app/yasal/[slug]/page.tsx
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

// BİLEŞENLERİMİZİ IMPORT EDİYORUZ
import MainHeader from '@/app/components/MainHeader';
import Footer from '@/app/components/Footer';

// Bu tip, Next.js'in URL'den 'slug' parametresini almasını sağlar
type PageProps = {
  params: {
    slug: string; // 'kvkk', 'iade-sartlari', 'gizlilik-politikasi' vb.
  };
};

// TODO: Bu veriler CMS'ten 'slug'a göre çekilecek.
// Şimdilik 'slug'a göre hangi başlığı ve içeriği göstereceğimizi belirleyen
// statik bir fonksiyon yazıyoruz.
const getLegalContent = (slug: string) => {
  let title = "Yasal Metin";
  let content = `
    <h2 class="text-3xl font-bold text-gray-900 mb-4">Metin Bulunamadı</h2>
    <p class="text-lg text-gray-700 leading-relaxed mb-6">
      Bu sayfaya ait içerik henüz yüklenmemiş. Lütfen daha sonra tekrar deneyin.
    </p>
  `;

  if (slug === 'kvkk') {
    title = "KVKK Aydınlatma Metni";
    content = `
      <h2 class="text-3xl font-bold text-gray-900 mb-6">Kişisel Verilerin Korunması</h2>
      <p class="text-lg text-gray-700 leading-relaxed mb-6">
        Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, 
        4T Akademi ("Şirket") olarak, veri sorumlusu sıfatıyla, 
        işlediğimiz kişisel verilerinize ilişkin aydınlatma yükümlülüğümüzü yerine getirmek 
        amacıyla hazırlanmıştır.
      </p>
      <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">1. İşlenen Kişisel Verileriniz</h3>
      <p class="text-lg text-gray-700 leading-relaxed mb-6">
        Tarafınızca sağlanan ad, soyad, e-posta adresi, telefon numarası gibi kimlik 
        ve iletişim verileriniz...
      </p>
      <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Kişisel Verilerinizin İşlenme Amaçları</h3>
      <ul class="list-disc list-inside text-lg text-gray-700 leading-relaxed space-y-2 mb-6 pl-4">
        <li>Satın alma süreçlerinizin yürütülmesi.</li>
        <li>Hizmet sonrası destek (eğitim paneli erişimi) sağlanması.</li>
        <li>İlgili mevzuat uyarınca yasal yükümlülüklerin yerine getirilmesi.</li>
        <li>Kampanya ve duyurulardan haberdar edilmeniz (açık rıza halinde).</li>
      </ul>
    `;
  }
  
  if (slug === 'iade-sartlari') {
    title = "İptal ve İade Şartları";
    content = `
      <h2 class="text-3xl font-bold text-gray-900 mb-6">İptal ve İade Politikası</h2>
      <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Dijital Hizmetler (4T FLIX, Offline Paketler)</h3>
      <p class="text-lg text-gray-700 leading-relaxed mb-6">
        Mesafeli Sözleşmeler Yönetmeliği’nin 15. maddesinin (ğ) bendi uyarınca, 
        "elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim 
        edilen gayrimaddi mallar" kapsamındaki hizmetlerde (VOD, Offline Video Paketleri vb.) 
        kullanıcının <b>cayma hakkı bulunmamaktadır.</b>
      </p>
      <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Canlı Ders Paketleri (Örgün ve Uzaktan)</h3>
      <p class="text-lg text-gray-700 leading-relaxed mb-6">
        Canlı ders paketlerinde, hizmetin başladığı tarihten itibaren, 
        kullanıcının faydalandığı ders saati ve hizmet bedeli düşülerek 
        kalan tutar üzerinden iade hesaplaması yapılır...
      </p>
    `;
  }

  if (slug === 'gizlilik-politikasi') {
    title = "Gizlilik Politikası";
    content = `
      <h2 class="text-3xl font-bold text-gray-900 mb-6">Gizlilik Politikası</h2>
      <p class="text-lg text-gray-700 leading-relaxed mb-6">
        4T Akademi olarak, kullanıcılarımızın gizliliğine son derece önem vermekteyiz. 
        Bu politika, hangi verileri topladığımızı ve bu verileri nasıl kullandığımızı açıklar.
      </p>
      <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Çerez (Cookie) Kullanımı</h3>
      <p class="text-lg text-gray-700 leading-relaxed mb-6">
        Web sitemiz, kullanıcı deneyimini iyileştirmek (örn: sepet bilgilerini hatırlamak) 
        ve site trafiğini analiz etmek amacıyla çerezler kullanmaktadır.
      </p>
    `;
  }

  return { title, content };
};


export default function LegalPageTemplate({ params }: PageProps) {
  const { slug } = params;
  const { title, content } = getLegalContent(slug); // 'slug'a göre veriyi çek

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50">
      
      {/* 1. Parça: Header */}
      <MainHeader />
      
      {/* 2. Parça: Hero Alanı (Dinamik Başlıklı) */}
      <section className="w-full bg-white pt-20 pb-16 border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <ShieldCheckIcon className="h-16 w-16 text-blue-800 mx-auto" />
          <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
            {title}
          </h1>
        </div>
      </section>

      {/* 3. Parça: Yasal Metin İçeriği */}
      <section className="w-full py-20 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-10 md:p-16 rounded-lg shadow-xl border border-gray-200">
            {/* Blog sayfasında kurduğumuz @tailwindcss/typography eklentisi
              sayesinde 'prose' sınıfı bu HTML'i otomatik olarak güzelleştirecek.
            */}
            <div 
              className="prose prose-lg prose-blue max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </section>

      {/* 4. Parça: Footer */}
      <Footer />
    </main>
  );
}