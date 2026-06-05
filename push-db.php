<?php
// Bu dosya Plesk Terminali kısıtlandığında Prisma tablolarını güncellemek için oluşturulmuştur.
echo "<h1>Veritabani Senkronizasyonu (Prisma DB Push)</h1>";
echo "<pre>";

// Plesk Node.js yolu genellikle doğrudan npx çalıştırmaya izin verir ancak emin olmak için:
// Eğer npx yoksa tam yetkiyle çalıştırır
$output = shell_exec('npx prisma db push --accept-data-loss 2>&1');

if ($output) {
    echo "<b>Islem Ciktisi:</b>\n" . htmlspecialchars($output);
} else {
    echo "<b>Hata!</b> Komut ciktisi alinamadi, npx komutu PHP shell_exec tarafindan engellenmis olabilir veya npm install yapilmamis olabilir.";
}

echo "</pre>";
echo "<br/><br/><p>Islem bittiyse (Your database is now in sync yaziyorsa) bu dosyayi lutfen silin.</p>";
?>
