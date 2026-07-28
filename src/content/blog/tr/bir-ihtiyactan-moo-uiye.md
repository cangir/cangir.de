---
title: "Bir ihtiyaçtan Moo UI’ye: Bootstrap markup, shadcn feel"
description: "Olympiad için Odoo Community seçimiyle başlayan ve Bootstrap’ın sağlam temellerini shadcn/ui’nin görsel diliyle buluşturan Moo UI hikâyesi."
pubDate: 2026-07-27
tags: [moo-ui, bootstrap, odoo, server-rendered]
category: Frontend
draft: false
---

Moo UI, yeni bir frontend kütüphanesi geliştirme isteğiyle başlamadı.

Her şey, çalıştığım yerde gerçek bir uygulamaya ihtiyaç duyulmasıyla başladı. Workspace içinde bugün **Olympiad** adını verdiğimiz bu uygulama için kullanıcı yönetimi, yetkilendirme, iş akışları, portal erişimi ve yönetim ekranları gerekiyordu.

Bunların her birini sıfırdan geliştirmek yerine, olgun ve genişletilebilir bir temel kullanmak istedim. Bu nedenle **Odoo 19 Community**’yi tercih ettim.

Odoo yalnızca bir ERP sistemi değil. Model katmanı, erişim kuralları, yönetim arayüzü, portal altyapısı, web sayfaları ve server-rendered şablonlarıyla uygulama geliştirmek için güçlü bir platform sunuyor. Özellikle Community sürümü, ihtiyaç duyduğumuz iş mantığını Odoo’nun doğal yapısı içinde geliştirmemize imkân veriyordu.

Ancak uygulamanın işlevsel temeli oturdukça başka bir ihtiyaç daha görünür hâle geldi: kullanıcı arayüzü.

## Bootstrap’ı tanıyordum, ama yeterli gelmiyordu

Odoo’nun portal ve web katmanı Bootstrap kullanıyor. Bu benim için önemli bir avantajdı çünkü Bootstrap’ı uzun yıllardır tanıyorum.

Bootstrap’ın güçlü yanları oldukça net:

- Sağlam ve yaygın HTML sözleşmeleri sunuyor.
- Server-rendered uygulamalara doğal biçimde uyuyor.
- Grid, form, modal, dropdown ve navigation gibi temel ihtiyaçları karşılıyor.
- JavaScript davranışları belirli ve öngörülebilir.
- Bir frontend framework’üne ihtiyaç duymadan kullanılabiliyor.
- Erişilebilirlik ve tarayıcı uyumluluğu konusunda yılların birikimini taşıyor.

Fakat saf Bootstrap’ın görsel dili, geliştirdiğimiz uygulama için istediğim hissi tam olarak vermiyordu.

Sorun Bootstrap’ın yetersiz olması değildi. Aksine, altyapı olarak oldukça güçlüydü. Fakat varsayılan görünümü daha genel amaçlıydı. Bizim ihtiyacımız ise daha sakin, daha yoğun bilgi taşıyabilen ve modern ürün arayüzlerine daha yakın bir tasarım diliydi.

Formların, menülerin, kartların ve navigasyon yüzeylerinin daha rafine görünmesini istiyordum. Bileşenlerin yalnızca işlevsel olması değil, birlikte tutarlı bir ürün hissi oluşturması gerekiyordu.

## shadcn/ui’nin görsel dilini beğeniyordum

Bu noktada karşıma çıkan en güçlü görsel referanslardan biri **shadcn/ui** oldu.

shadcn/ui’de sevdiğim şey yalnızca tek tek bileşenlerin görünümü değildi. Asıl etkileyici olan, bütün sistemin taşıdığı tasarım yaklaşımıydı:

- Sakin renk kullanımı
- Dengeli boşluklar
- Belirgin ama abartısız focus durumları
- Kompakt ve okunabilir formlar
- Net yüzey hiyerarşisi
- Modern uygulamalara uygun radius ve gölge kullanımı
- Gösterişten çok işlevi öne çıkaran bir görsel dil

Bu yaklaşım, Olympiad için hayal ettiğim arayüze oldukça yakındı.

Ancak shadcn/ui’nin uygulama modeli React ve Tailwind ekosistemi etrafında şekilleniyor. Odoo ise server-rendered QWeb şablonları, kendi asset pipeline’ı, portal yapısı ve Bootstrap tabanlı frontend davranışlarıyla farklı bir dünyada yaşıyor.

Elbette Odoo ile React’i bir araya getirmek teknik olarak mümkün. Fakat “mümkün” olması, doğru mimari tercih olduğu anlamına gelmiyor.

## React’i Odoo’ya bağlamak neden doğru gelmedi?

Olympiad’ın ihtiyaç duyduğu şey bağımsız bir SPA değildi. Uygulama zaten Odoo’nun model, güvenlik, route, controller, portal ve template katmanlarını kullanıyordu.

Bu yapının üzerine ayrı bir React uygulaması eklemek beraberinde yeni sorular getiriyordu:

- Odoo ile React arasında veri sözleşmeleri nasıl yönetilecek?
- Yetkilendirme iki tarafta nasıl tutarlı kalacak?
- Form doğrulama ve hata mesajları hangi katmanın sorumluluğunda olacak?
- Odoo route ve portal navigasyonu ile istemci tarafı routing nasıl birleşecek?
- Bootstrap ve Tailwind aynı sayfada nasıl izole edilecek?
- Modal, dropdown ve focus yönetiminin sahibi kim olacak?
- Aynı bileşenin server-rendered ve client-rendered iki farklı sürümü mü oluşacak?
- Odoo güncellemelerinde bu entegrasyon nasıl korunacak?
- Basit bir portal ekranı için ne kadar JavaScript taşınacak?

Bunların çözümleri var. Fakat her çözüm yeni bir katman, yeni bir bağımlılık ve yeni bir bakım sorumluluğu anlamına geliyordu.

Benim aradığım şey daha fazla teknoloji değildi. Daha az gürültüyle daha iyi bir kullanıcı arayüzüydü.

Odoo’nun doğal yapısından çıkmak istemedim. Server-rendered HTML’den, Bootstrap’ın davranış sözleşmelerinden ve platformun kendi güvenlik modelinden vazgeçmeden daha modern bir tasarım dili elde etmek istedim.

Moo UI fikri tam olarak bu noktada ortaya çıktı.

## Üçüncü bir yol mümkün müydü?

Kendime şu soruyu sordum:

> Bootstrap’ın sağlam HTML ve davranış sözleşmelerini koruyup, shadcn/ui’de sevdiğim görsel hissi server-rendered uygulamalara taşıyabilir miyim?

Bu soru zamanla Moo UI’nin temel cümlesine dönüştü:

> **Bootstrap markup. shadcn feel.**

Buradaki amaç shadcn/ui’yi Bootstrap’a port etmek değil.

Moo UI bir React bileşen kütüphanesi değil. Tailwind kullanmıyor ve shadcn bileşen kaynaklarını yeniden üretmeye çalışmıyor. shadcn/ui burada bir kaynak kodu veya piksel sözleşmesi değil; görsel bir yön ve ürün dili.

Bootstrap ise yalnızca birkaç class adını ödünç aldığımız bir katman değil. Moo UI’nin markup, Sass, davranış ve erişilebilirlik temeli.

Bu nedenle bir Dropdown hâlâ Bootstrap Dropdown. Bir Modal hâlâ Bootstrap Modal. Form kontrolleri Bootstrap’ın doğal HTML yapısını kullanıyor. Bootstrap’ın zaten çözdüğü davranışları Moo UI yeniden yazmıyor.

Moo UI’nin yaptığı şey, bu sağlam temele daha odaklı bir görsel dil kazandırmak.

## CSS-first, JavaScript gerektiği kadar

Moo UI’nin ana kullanım yolu hazır CSS dosyalarıdır.

Yeni bir uygulamada tam Bootstrap build’i içeren `moo-ui.css` kullanılabilir. Mevcut bir Bootstrap uygulamasına kademeli olarak eklenmek istendiğinde ise scoped bileşen katmanı tercih edilebilir.

JavaScript yalnızca Bootstrap’ın doğal olarak karşılamadığı doğrulanmış boşluklarda devreye giriyor. Örneğin Combobox ve Sidebar gibi bileşenler için isteğe bağlı ESM modülleri bulunuyor.

Bu modüller import edildikleri anda sayfayı tarayıp otomatik olarak her şeyi başlatmıyor. Instance sahipliği açık ve yaşam döngüsü kontrollü tutuluyor.

Yani hedef yeni bir frontend runtime oluşturmak değil. Server-rendered HTML’nin doğal kalmasını sağlarken ihtiyaç duyulan küçük davranış boşluklarını kapatmak.

## Görünüm kadar güven de önemli

Bir bileşenin katalogda güzel görünmesi, onun üretim kullanımı için hazır olduğu anlamına gelmiyor.

Bu nedenle Moo UI’de üç farklı durumu birbirinden ayırmaya karar verdim:

- **Ready:** Bileşen uygulanmış ve katalog içinde kullanılabilir.
- **Accepted:** Görsel ve davranışsal sonucu tarayıcı incelemesinden geçmiş.
- **Certified:** Belirli bir sürüm için risk seviyesine uygun kanıtları tamamlamış.

Sertifikasyon çalışması semantik HTML, klavye kullanımı, focus yönetimi, erişilebilirlik, light/dark tema, LTR/RTL, responsive davranış, lifecycle, tarayıcı konsolu ve gerçek paket çıktısı gibi alanları kapsıyor.

Moo UI `0.5.0` ile bu sürecin temelini ve ilk beş bileşenlik certification preview çalışmasını yayımlıyor. Henüz bütün bileşenlerin production certification süreci tamamlanmış değil. Ama hangi iddianın hangi kanıta dayandığını açıkça gösterecek altyapı artık mevcut.

Bu ayrım benim için önemli. Çünkü güven, “production-ready” yazan bir rozetle değil; tekrar üretilebilir kanıtlarla oluşuyor.

## Olympiad’dan başlayan yolculuk

Moo UI bugün bağımsız, MIT lisanslı bir Core projesi olarak gelişiyor. Odoo’ya özel bir tema veya yalnızca Olympiad içinde kullanılabilen kapalı bir stil katmanı değil.

Fakat çıkış noktası hâlâ aynı:

Gerçek bir uygulama ihtiyacı, güçlü fakat görsel olarak yetersiz kalan bir temel ve gereğinden fazla karmaşık görünen bir alternatif.

Olympiad bana problemi gösterdi. Odoo, korunması gereken platform-native yaklaşımı belirledi. Bootstrap dayanıklı HTML ve davranış temelini sundu. shadcn/ui ise ulaşmak istediğim görsel dili tarif etmeme yardımcı oldu.

Moo UI bu parçalar arasında daha sade bir yol bulma çabası olarak doğdu.

React’e veya Tailwind’e karşı olduğu için değil; her uygulamanın onlara ihtiyaç duymadığına inandığım için.

Bootstrap’ın eski olduğu düşüncesinden değil; sağlam temellerinin daha çağdaş bir ürün diliyle yeniden yorumlanabileceğini düşündüğüm için.

Ve en önemlisi, server-rendered uygulamaların modern görünmek için kendi doğal mimarisinden vazgeçmek zorunda olmadığına inandığım için.

> **Bootstrap markup. shadcn feel.**
>
> Modern, server-rendered arayüzler için daha az gürültülü bir yol.
