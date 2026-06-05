import prisma from "../src/lib/prisma";

const blogs = [
  {
    title: "2026 KPSS A Sınav Takvimi ve Stratejileri",
    slug: "2026-kpss-a-sinav-takvimi-ve-stratejileri",
    category: "Rehberlik",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800",
    excerpt: "Sınav sürecinde motivasyonunuzu korumak ve doğru kaynaklarla çalışmak başarının anahtarıdır. İşte uzmanlarımızdan altın değerinde KPSS A stratejileri...",
    isPublished: true,
    content: `
      <h2>2026 KPSS A Grubu'na Hazırlık Maratonu Başlıyor!</h2>
      <p>KPSS A Grubu sınavı, Müfettiş, Uzman, Denetmen ve Kontrolör gibi kariyer mesleklerini hedefleyen adaylar için en kritik basamaktır. 2026 yılı sınav takvimi genel hatlarıyla açıklanmakla birlikte, başarılı bir hazırlık süreci geçirmek isteyen adayların şimdiden sağlam bir strateji kurması şarttır.</p>
      
      <h3>1. Takvimi Doğru Yönetin</h3>
      <p>Sınava hazırlık sürecinde en sık yapılan hata, çalışma programını sınav tarihine göre orantısız dağıtmaktır. Genel Yetenek-Genel Kültür testleriyle Alan Bilgisi testlerini birbirine paralel götürmelisiniz. Hukuk, İktisat, Maliye ve Muhasebe dörtlüsü, KPSS A sınavının lokomotifleridir. Programınızı yaparken bu dört ana derse haftalık rutinlerinizde mutlaka yer ayırın.</p>

      <h3>2. Çıkmış Soruların Analizi</h3>
      <p>ÖSYM'nin soru dili yıllar içinde belirli bir standarda oturmuştur. Çıkmış soruları sadece "çözmek" için değil, sorunun mantığını ve çeldiricilerini anlamak için masaya yatırın. Bir seçeneğin neden yanlış olduğunu bulmak, doğruyu bulmaktan çok daha kalıcı bir öğrenme sağlar.</p>

      <h3>3. Doğru Kaynak Seçimi ve Tekrarlar</h3>
      <p>Piyasada yüzlerce kaynak bulunuyor ancak 4T Akademi'nin hazırladığı gibi spesifik, güncel mevzuata ve ÖSYM formatına %100 uyumlu kaynaklarla çalışmak size zaman kazandırır. Öğrendiğiniz bilgilerin hafızada kalıcı olabilmesi için "Aralıklı Tekrar" (Spaced Repetition) yöntemini kullanın. Konu bitiminden 1 gün, 1 hafta ve 1 ay sonra o konunun testlerini çözerek bilgiyi uzun süreli hafızanıza kazıyın.</p>

      <p><em>Unutmayın, KPSS bir depar değil maratondur. Nefesini doğru ayarlayanlar ipi göğüsler. Başarılar dileriz!</em></p>
    `
  },
  {
    title: "Kaymakamlık Mülakatlarında Dikkat Edilmesi Gerekenler",
    slug: "kaymakamlik-mulakatlarinda-dikkat-edilmesi-gerekenler",
    category: "Mülakat",
    imageUrl: "https://images.unsplash.com/photo-1506784381384-e36da0344b1c?q=80&w=800",
    excerpt: "Kaymakamlık sınavını kazandıktan sonraki en kritik aşama mülakattır. Komisyon karşısında sergilenmesi gereken duruş ve püf noktaları...",
    isPublished: true,
    content: `
      <h2>Mülakat Masasında Kazanan Taraf Siz Olun</h2>
      <p>Kaymakamlık yazılı sınavını geçmek büyük bir başarıdır ancak nihai zafer mülakat komisyonunun onayından geçer. Komisyon sadece mevzuat bilginizi değil; kriz yönetimi becerinizi, liyakatinizi, diksiyonunuzu ve devlet memuriyeti ciddiyetine uygunluğunuzu ölçer.</p>

      <h3>Duruş, Beden Dili ve İlk İzlenim</h3>
      <p>Odaya girdiğiniz andan itibaren değerlendirme başlar. Temiz, ütülü bir takım elbise/döpiyes, abartısız bir görünüm ve özgüvenli bir yürüyüş şarttır. Göz temasını komisyon üyeleri arasında dengeli dağıtın, soruyu kim sorduysa yanıtı ona odaklanarak verin.</p>

      <h3>"Bilmiyorum" Demenin Sanatı</h3>
      <p>Komisyon her şeyi bilmenizi beklemez. Yanıtını tam olarak bilmediğiniz veya emin olmadığınız detay bir mevzuat sorusunda yanlış tahminde bulunmak, dürüstçe "Efendim bu konudaki bilgimi şu an hatırlayamadım, incelemek isterim" demekten çok daha fazla puan kaybettirir.</p>

      <h3>Gündeme ve İdare Hukukuna Hakimiyet</h3>
      <p>Son dönemdeki önemli yasa değişiklikleri, Türkiye'nin idari yapısındaki güncel durumlar ve bulunduğu bölgenin dinamiklerini bilmek adayı her zaman bir adım öne çıkarır. İçişleri tüzük ve yönetmeliklerine dair günlük okumalar yapmayı mülakat gününe kadar bırakmayın.</p>

      <p><em>Kaymakamlık makamı bir idare sanatıdır. Komisyona, bir ilçeyi sakin, adil ve dirayetli şekilde yönetebilecek o vizyona sahip olduğunuzu hissettirin.</em></p>
    `
  },
  {
    title: "Verimli Ders Çalışma ve Hafıza Teknikleri",
    slug: "verimli-ders-calisma-ve-hafiza-teknikleri",
    category: "Rehberlik",
    imageUrl: "https://images.unsplash.com/photo-1506784983877-45594fa4c58d?q=80&w=800",
    excerpt: "Saatlerce masada oturmak verimli çalışmak anlamına gelmez. Zihninizi hackleyerek bilgileri kalıcı hale getirmenin bilimsel yöntemlerini öğrenin.",
    isPublished: true,
    content: `
      <h2>Pomodoro'dan Zihin Saraylarına: Çalışma Disiplini Oluşturmak</h2>
      <p>Özellikle Hukuk, İktisat gibi ağır teorik konuların yer aldığı sınavlarda saatlerce masa başında oturmak, bir süre sonra "hayal kurma" evresine dönüşebiliyor. Verimi artırmak, süreyi değil yöntemi değiştirmekle başlar.</p>

      <h3>1. Pomodoro Tekniğini Özelleştirin</h3>
      <p>25 dakika çalışma, 5 dakika mola şeklinde bilinen klasik Pomodoro tekniği, KPSS veya Kaymakamlık gibi ağır sınavlarda yetersiz kalabilir. 4T Akademi uzmanları olarak 50 dakika çalışma + 10 dakika mola döngüsünün, odaklanma derinliğini çok daha fazla artırdığını gözlemliyoruz.</p>

      <h3>2. Zihin Sarayları (Method of Loci)</h3>
      <p>Karmaşık yasaları, tarihleri veya maddeleri ezberlemek yerine zihninizde çok iyi bildiğiniz bir mekanı (örneğin eviniz) kurgulayın. Bütün bilgileri bu evin odalarına yerleştirin. İdare hukukunun temel ilkelerini salondaki eşyalara, anayasa maddelerini mutfağa kodlamak, bilgileri sadece ezberlemekten çıkarıp kalıcı hafızaya aktarır.</p>

      <h3>3. Feyman Tekniği ile Kendi Kendine Anlat</h3>
      <p>Bir konuyu gerçekten öğrenip öğrenmediğinizi anlamanın en iyi yolu, onu hiç bilmeyen birine anlatmaktır. Konuyu çalıştıktan sonra kitabınızı kapatın ve sanki karşınızda bir öğrenci varmış gibi konuyu sesli olarak anlatın. Tıkandığınız yerler, eksik kaldığınız yerlerdir; hemen o noktaya geri dönüp o deliği kapatın.</p>

      <p><em>Stres yapmadan, sistematik ve kendinizi dinleyerek ilerlediğiniz bir hazırlık süreci asla sonuçsuz kalmayacaktır. Bol odaklanmalar!</em></p>
    `
  }
];

async function main() {
  console.log("Seeding Database ile Blog Yazıları...");
  
  for (const b of blogs) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: b.slug }
    });
    
    if (existing) {
      console.log(`Updating existing post: ${b.slug}`);
      await prisma.blogPost.update({
        where: { slug: b.slug },
        data: b
      });
    } else {
      console.log(`Creating new post: ${b.slug}`);
      await prisma.blogPost.create({
        data: b
      });
    }
  }

  console.log("Mükemmel! Blog yazıları başarıyla kaydedildi.");
}

main()
  .catch((e) => {
    console.error("Hاتا oluştu:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
