---
title: "Safari'deki Hayalet: Üç Doğru Çözüm, Bir Yanlış Soru"
description: "Bir önizleme penceresi Safari'de kendi kendine kayıyordu. Üç mantıklı çözüm denedim, üçü de tutmadı. Sorunu asıl çözen şey daha iyi bir fikir değil, tahmin etmeyi bırakıp bakmaya başlamaktı."
pubDate: 2026-08-04
tags: [moo-ui, safari, debugging, hikaye]
category: Frontend
draft: false
---

Moo UI'nin katalog sayfasında her bileşenin canlı bir önizlemesi var. Kullanıcı "mobil", "tablet" ya da "masaüstü" seçiyor, biz de arka planda o bileşenin gerçek sayfasını küçültüp bir çerçevenin içine sığdırıyoruz — sayfanın kendisi hâlâ tam boyutunda render oluyor, sadece görsel olarak küçülüyor.

Aylardır sorunsuz çalışıyordu. Sonra bir gün bir ekran görüntüsü geldi: Data Table önizlemesinde "View" düğmesine basılınca, önizleme kutusunun neredeyse yarısı ekrandan kayboluyordu. Sanki pencere, tarayıcının sol kenarına doğru sürünüyordu.

Tek bir ayrıntı önemliydi: bu sadece Safari'de oluyordu. Ve sadece o küçültülmüş önizleme penceresinde — aynı sayfanın tam boyutlu hâlinde hiçbir sorun yoktu.

## "Bunu biliyorum" dedim

İlk bakışta tanıdık bir hataydı. Safari'nin küçültülmüş `iframe`'lerle arasının hiç iyi olmadığını biliyordum; yıllardır böyle küçük tuhaflıklarla karşılaşmıştım. Kafamda hazır bir teori vardı bile: Safari, pencere yeniden boyutlandığında iframe'in içindeki sayfanın eski ölçülerini unutmuyor, ve bir şeye odaklanınca (mesela bir dropdown açılınca) o eski, yanlış ölçüye göre kaydırma yapıyor.

Mantıklıydı. Düzeltmeyi yazdım: sayfa gerçekten taşmıyorsa, yatay kaydırmayı sıfıra sabitle.

Test sonucu geldi: "Hâlâ oluyor."

## İkinci teori, daha kesin bir dille

Tamam, dedim, o zaman kök daha derinde. Safari'nin, ölçeklendirilmiş (`transform: scale()`) bir iframe'i, içindeki bir şey yeniden çizildiğinde (bir dropdown açmak tam olarak budur) yanlış yere "yapıştırdığı" bilinen bir hatası var. Çözümü de biliniyordu: ölçeklendirmeyi `transform` yerine `zoom` ile yapmak. `zoom`, tarayıcının o özel, hataya açık katmanını hiç oluşturmuyor.

Kendi tarayıcımda test ettim, düzgün çalışıyordu. Kod tarafında da mantık tutarlıydı. Gönderdim.

Bu sefer gelen cevap daha da ilginçti: kayma durmuştu, ama şimdi tablonun sütunlarının yarısı kayboluyordu — sanki sayfa artık kendi genişliğinin ne kadar olduğunu bilmiyormuş gibi. Kendi tarayıcımda tekrar baktım, orada hâlâ doğruydu. Demek ki `zoom`, Safari'de iframe'lerle konuşurken farklı bir dil kullanıyordu — ben bir hatayı çözerken, göremediğim bir tarayıcıda yeni bir tane açmıştım.

## Üçüncü deneme, aynı sabır

Geri döndüm. `transform`'u koru, ama Safari'ye "bu elementi kendi başına bir katman olarak düşün" demenin standart yolunu ekle (`will-change: transform`). Bu, ilk iki denemenin en makulüydü: ölçeklendirme mantığına hiç dokunmuyordu, sadece Safari'ye erken bir ipucu veriyordu.

Cevap yine aynıydı: "Hâlâ devam ediyor."

Üç deneme, üçü de kendi içinde tutarlı, üçü de gerçek ve bilinen hatalara dayanıyordu. Ve üçü de yanlıştı. O noktada fark ettim ki sorun benim çözümlerimde değildi — sorduğum soruda vardı. "Hangi bilinen Safari hatası bu?" diye soruyordum, oysa sormam gereken şey "burada gerçekte ne oluyor?" idi.

## Tahmin etmeyi bıraktım, ölçmeye başladım

Bir sonraki adımda teori üretmedim. Sadece şunu sordum: hata anında, tam o saniyede, elementlerin gerçek konumu ne?

İki dikdörtgenin ölçülerini istedim: önizlemenin dış çerçevesi ve içindeki iframe. Cevap geldiğinde bir şey hemen dikkatimi çekti. Dış çerçeve tam olması gerektiği yerdeydi. Ama iframe'in kendisi, sayfanın sol kenarının epey dışında, negatif bir konumda duruyordu.

Bu, beklediğim şey değildi. Bir ölçeklendirme hatası olsaydı, iframe'in *boyutu* yanlış olurdu. Ama boyut tamamen doğruydu — matematik tutuyordu, ölçek doğru uygulanmıştı. Yanlış olan konumdu. Ve `transform` bir elementin doğal konumunu değiştiremez, sadece onu büyütüp küçültür. Yani iframe, dönüşümden önce bile, zaten yanlış yerdeydi.

Üç denememin de bu noktaya hiç bakmadığını fark ettim. Hepsi iframe'in kendisine ya da onun *kendi içindeki* kaymaya odaklanmıştı. Ama asıl suçlu, iframe'in dışındaydı.

## Beklemediğim suçlu

İframe'i saran kutu, taşan içeriği gizlemek için var — kaydırma çubuğu bile göstermiyor, çünkü kaydırılması hiç beklenmiyor. Ama bir elementin kaydırma çubuğu olmaması, kaydırma *pozisyonu* olamayacağı anlamına gelmiyor.

Safari'nin, bir yere odaklanıldığında "bu elementi görünür kıl" diye bir refleksi var. Normalde zararsız bir davranış. Ama bu refleks, iframe'in sınırını hiç umursamıyor: içeride bir yere odaklanılınca, dışarıdaki, hiç kaydırılmaması gereken o sarmalayıcı kutuyu da kaydırıyor — sırf "belki görünmesi gerekiyordur" diye.

Dropdown açılınca odak iframe'in içine gitti. Safari, o odağı "görünür kılmak" için dışarıdaki kutuyu sessizce kaydırdı. Kutunun kendisi hiçbir zaman görsel olarak taşmadı, kaydırma çubuğu da hiç görünmedi — ama içindeki iframe, artık o görünmez kaymanın üzerinde duruyordu.

Üç ay boyunca aradığım "iframe hatası" diye bir şey yoktu. Sorun hiç iframe'de değildi.

## Çözüm, bulmaktan çok daha kolaydı

Bu kutunun tek bir doğru kaydırma pozisyonu var: sıfır. Başka hiçbir zaman, hiçbir sebeple kaymaması gerekiyor. Yani çözüm karmaşık bir mantık gerektirmiyordu — kutu her kaydığında, onu sessizce sıfıra geri almak yetiyordu.

Bu sefer cevap farklıydı: "sonunda düzeldi."

## Geriye kalan

Üç doğru çözüm, yanlış soruya cevap verdiği için işe yaramadı. Her biri "bu, bildiğim hangi kategoriye giriyor?" diye sordu. Oysa ilk sorulması gereken "burada, tam olarak, ne oluyor?" idi — ve bunun cevabı tahminle değil, bakarak geliyor.

En çok öğrettiği şey şuydu: bir tarayıcı, gözle görünmeyen bir şeyi (kaydırma çubuğu olmayan bir kutunun kaydırma pozisyonunu) çok uzaktaki bir olaya (bir dropdown'ın açılmasına) bağlayabiliyor, ve bu bağlantı sadece o tek tarayıcıda var olabiliyor. Kod doğru, mantık doğru, matematik doğru olabilir — ve sorun yine de tam olarak orada, göremediğiniz yerde durabilir.
