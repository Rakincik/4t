// Dosya Yolu: app/components/ComparisonTable.tsx
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

// TODO: Bu veriler CMS'ten kategoriye özel (Kaymakamlık, KPSS) olarak çekilecek.
// Şimdilik Kaymakamlık için statik bir data oluşturduk.
const plans = [
  {
    name: 'Premium Eğitim (Sıfırdan)',
    href: '/kurs/premium-kaymakamlik',
    price: '₺7.900',
    description: 'Tüm konuları sıfırdan, en temelden öğrenmek isteyenler için tam paket.',
  },
  {
    name: '115. Dönem Kaymakamlık',
    href: '/kurs/115-donem-kaymakamlik',
    price: '₺15.500',
    description: 'En kapsamlı, 2 kez canlı dinleme imkanı olan amiral gemisi kursumuz.',
  },
  {
    name: 'Soru Çözüm Kampı',
    href: '/kurs/kaymakamlik-soru-kampi',
    price: '₺3.500',
    description: 'Konuları bitirmiş, sadece soru pratiği ve tekrar yapmak isteyenler için.',
  },
];

const features = [
  { name: 'Tüm Konu Anlatımları', values: [true, true, false] },
  { name: 'Toplam Ders Saati', values: ['350+ Saat', '500+ Saat', '100 Saat'] },
  { name: '2 Kez Canlı Dinleme', values: [false, true, false] },
  { name: 'Video (Offline) Erişim', values: ['1 Yıl', '2 Yıl', 'Sınava Kadar'] },
  { name: 'Hocalarla Soru-Cevap', values: [true, true, true] },
  { name: 'Çıkmış Soru Çözümleri', values: [true, true, true] },
  { name: 'Özel Rehberlik Desteği', values: [false, true, false] },
  { name: '4T FLIX Erişimi', values: ['Yok', '1 Yıl Hediye', 'Yok'] },
];

export default function ComparisonTable() {
  return (
    <div className="bg-white py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Size En Uygun Paketi Seçin
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Farklı ihtiyaçlara yönelik hazırladığımız kurs paketlerimizi karşılaştırın.
          </p>
        </div>

        {/* Tailwind'in 'table-auto' ve 'divide-y' özellikleri ile temiz bir tablo */}
        <div className="mt-16 overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left divide-y divide-gray-200">
            {/* Tablo Başlığı (Paketler) */}
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-white p-4 pr-8 text-lg font-bold text-gray-900">
                  Özellikler
                </th>
                {plans.map((plan) => (
                  <th key={plan.name} className="p-4 px-6 text-center w-1/4">
                    <h3 className="text-lg font-bold text-blue-800">{plan.name}</h3>
                    <p className="mt-1 text-sm text-gray-600 h-10">{plan.description}</p>
                    <p className="mt-2 text-2xl font-extrabold text-gray-900">{plan.price}</p>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Tablo İçeriği (Özellikler) */}
            <tbody className="divide-y divide-gray-200">
              {features.map((feature) => (
                <tr key={feature.name}>
                  <td className="sticky left-0 z-10 bg-white p-4 pr-8 text-base font-medium text-gray-800">
                    {feature.name}
                  </td>
                  {feature.values.map((value, idx) => (
                    <td key={idx} className="p-4 px-6 text-center text-base text-gray-700">
                      {typeof value === 'boolean' ? (
                        value ? (
                          <CheckIcon className="h-6 w-6 text-green-500 mx-auto" aria-label="Evet" />
                        ) : (
                          <XMarkIcon className="h-6 w-6 text-red-500 mx-auto" aria-label="Hayır" />
                        )
                      ) : (
                        <span className="font-semibold">{value}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

            {/* Tablo Altı (Butonlar) */}
            <tfoot>
              <tr className="border-t border-gray-200">
                <td className="sticky left-0 z-10 bg-white p-4 pr-8"></td>
                {plans.map((plan) => (
                  <td key={plan.name} className="p-4 px-6 text-center">
                    <a
                      href={plan.href}
                      className="block w-full px-4 py-3 text-base font-bold text-white bg-blue-800 rounded-lg shadow-md hover:bg-blue-900"
                    >
                      İncele ve Satın Al
                    </a>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}