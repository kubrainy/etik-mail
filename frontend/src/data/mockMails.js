const DEMO_REPORT = `Haftalık Rapor — Örnek Ek

Bu dosya, gelen kutusunda ek indirmeyi denemek için eklenmiş örnek bir rapordur.

Özet:
- Tamamlanan görevler: 12
- Devam eden işler: 4
- Sonraki hafta odak: sunum ve testler
`;

const demoReportDataUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(DEMO_REPORT)}`;

export const MOCK_MAILS = [
  {
    id: 1,
    from: "ali@example.com",
    fromName: "Ali Demir",
    subject: "Proje sunumu",
    preview: "Yarınki sunum için son kontrolleri yapalım mı?",
    body: "Merhaba,\n\nYarınki sunum için son kontrolleri yapalım mı? Slaytların son halini paylaşırsan birlikte gözden geçirebiliriz.\n\nTeşekkürler,\nAli",
    date: "16 Haz",
    starred: false,
  },
  {
    id: 2,
    from: "ayse@example.com",
    fromName: "Ayşe Kaya",
    subject: "Haftalık rapor",
    preview: "Rapor ektedir, inceleyip geri bildirim verir misiniz?",
    body: "Merhaba,\n\nHaftalık raporu ekte paylaşıyorum. İnceleyip geri bildirim verir misiniz?\n\nİyi çalışmalar,\nAyşe",
    attachments: [
      {
        id: "demo-haftalik-rapor",
        name: "haftalik-rapor.txt",
        size: DEMO_REPORT.length,
        type: "text/plain",
        dataUrl: demoReportDataUrl,
      },
    ],
    date: "15 Haz",
    starred: true,
  },
  {
    id: 3,
    from: "mehmet@example.com",
    fromName: "Mehmet Yıldız",
    subject: "Toplantı notları",
    preview: "Dünkü toplantı notlarını paylaşıyorum.",
    body: "Selam,\n\nDünkü toplantı notlarını aşağıda özetledim:\n\n1. Model entegrasyonu tamamlandı.\n2. Arayüz testleri devam ediyor.\n3. Cuma günü demo planlandı.\n\nMehmet",
    date: "14 Haz",
    starred: false,
  },
  {
    id: 4,
    from: "zeynep@example.com",
    fromName: "Zeynep Arslan",
    subject: "Tasarım onayı",
    preview: "Yeni arayüz tasarımı için onayınızı bekliyorum.",
    body: "Merhaba,\n\nYeni arayüz tasarımı için onayınızı bekliyorum. Bağlantıyı daha önce paylaşmıştım; geri dönüşünüzü rica ederim.\n\nZeynep",
    date: "13 Haz",
    starred: false,
  },
  {
    id: 5,
    from: "can@example.com",
    fromName: "Can Öztürk",
    subject: "Sunucu bakımı",
    preview: "Cumartesi gece bakım planı hakkında bilgilendirme.",
    body: "Merhaba,\n\nCumartesi gece 02:00–04:00 arası planlı sunucu bakımı yapılacaktır. Bu sürede kısa süreli kesinti yaşanabilir.\n\nBilginize,\nCan",
    date: "12 Haz",
    starred: true,
  },
];
