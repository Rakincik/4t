// Dosya Yolu: app/components/PricingTable.tsx
"use client"; // Fiyat geçişi (state) için bu gerekli

import { useState } from 'react';
import { Switch } from '@headlessui/react'; // Yeni yüklediğimiz kütüphane
import { CheckIcon } from '@heroicons/react/24/solid';

// TODO: Bu veriler CMS'ten çekilecek.
const plans = [
  {
    name: 'HUKUK FLIX',
    description: 'Tüm Hukuk dersleri (Anayasa, İdare, Medeni vb.)',
    priceMonthly: '₺350',
    priceYearly: '₺3.500',
    features: ['Sınırsız Erişim', 'Tüm Hukuk Videoları', 'Özel Ders Notları (PDF)', 'Çıkmış Soru Çözümleri'],
  },
  {
    name: 'TÜM FLIX PAKETİ',
    description: 'Hukuk, İktisat, Maliye... Tüm KPSS A ve Kurum Sınavı videoları.',
    priceMonthly: '₺750',
    priceYearly: '₺7.500',
    isMostPopular: true, // Kartı vurgulamak için
    features: [
      'Sınırsız Erişim',
      'TÜM Ders Videoları',
      'TÜM Ders Notları (PDF)',
      'TÜM Soru Çözümleri',
      'Rehberlik Videoları',
    ],
  },
  {
    name: 'İKTİSAT FLIX',
    description: 'Mikro, Makro, Para-Banka, Uluslararası İktisat...',
    priceMonthly: '₺350',
    priceYearly: '₺3.500',
    features: ['Sınırsız Erişim', 'Tüm İktisat Videoları', 'Özel Ders Notları (PDF)', 'Çıkmış Soru Çözümleri'],
  },
];

function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default function PricingTable() {
  const [isYearly, setIsYearly] = useState(true); // Varsayılan: Yıllık (daha kârlı)

  return (
    <div className="w-full">
      {/* 1. Toggle (Aylık/Yıllık Geçişi) */}
      <div className="flex justify-center items-center space-x-4">
        <span className={classNames(isYearly ? 'text-gray-500' : 'text-blue-800 font-bold', 'text-lg')}>
          Aylık
        </span>
        <Switch
          checked={isYearly}
          onChange={setIsYearly}
          className={classNames(
            isYearly ? 'bg-blue-800' : 'bg-gray-300',
            'relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2'
          )}
        >
          <span
            aria-hidden="true"
            className={classNames(
              isYearly ? 'translate-x-7' : 'translate-x-0',
              'pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
            )}
          />
        </Switch>
        <span className={classNames(isYearly ? 'text-blue-800 font-bold' : 'text-gray-500', 'text-lg relative')}>
          Yıllık
          <span className="absolute -top-4 -right-12 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            %15 İNDİRİM
          </span>
        </span>
      </div>

      {/* 2. Fiyat Kartları */}
      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-3 items-start">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={classNames(
              plan.isMostPopular ? 'border-4 border-blue-800 shadow-2xl' : 'border-2 border-gray-200 shadow-lg',
              'relative flex flex-col rounded-2xl overflow-hidden'
            )}
          >
            {plan.isMostPopular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="bg-blue-800 text-white px-5 py-1 text-sm font-bold rounded-full shadow-lg">
                  EN POPÜLER
                </div>
              </div>
            )}
            
            <div className="bg-white p-8">
              <h3 className="text-2xl font-extrabold text-blue-900 text-center">{plan.name}</h3>
              <p className="mt-2 text-sm text-gray-600 text-center h-10">{plan.description}</p>
              
              {/* Dinamik Fiyat */}
              <div className="mt-6 flex flex-col items-center">
                <span className="text-5xl font-extrabold text-gray-900">
                  {isYearly ? plan.priceYearly : plan.priceMonthly}
                </span>
                <span className="text-base font-medium text-gray-600">
                  {isYearly ? '/ yıllık' : '/ aylık'}
                </span>
              </div>
            </div>

            {/* Özellikler */}
            <div className="p-8 bg-gray-50 flex-grow">
              <ul role="list" className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                    </div>
                    <p className="ml-3 text-base font-medium text-gray-700">{feature}</p>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Buton */}
            <a
              href="#" // TODO: Sepete ekle (plan adı + aylık/yıllık bilgisiyle)
              className={classNames(
                plan.isMostPopular
                  ? 'bg-blue-800 text-white hover:bg-blue-900'
                  : 'bg-white text-blue-800 border-2 border-blue-800 hover:bg-blue-50',
                'block w-full text-center px-6 py-4 text-lg font-bold transition-colors'
              )}
            >
              Abone Ol
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}