import { getSiteConfig, updateSiteConfig } from "./actions";
import SiteConfigForm from "./SiteConfigForm";

export default async function SiteSettingsPage() {
    const config = await getSiteConfig();

    return (
        <div className="max-w-2xl">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900">
                        Genel Site Ayarları
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Bu bilgiler footer ve iletişim sayfalarında görünür.
                    </p>
                </div>

                <SiteConfigForm config={config} />
            </div>
        </div>
    );
}
