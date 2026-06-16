# Etik Mail

Türkçe e-posta metinlerinde toksik / uygunsuz dil tespiti yapan TÜBİTAK projesi. Gmail benzeri arayüz, FastAPI backend ve fine-tune edilmiş BERT modeli kullanır.

## Proje yapısı

```
etik-mail/
├── backend/                 # FastAPI + BERT modeli
│   ├── main.py
│   ├── model_service.py
│   ├── requirements.txt
│   └── model/final-toxic-mail-model/
├── frontend/                # React + Vite arayüz
│   ├── src/
│   └── public/favicon.png
└── README.md
```

## Demo kullanıcılar

| E-posta | Şifre | Ad |
|---------|--------|-----|
| `sezi@example.com` | `etik2026` | Sezi Yılmaz |
| `kubra@example.com` | `etik2026` | Kübra Çetinkaya |

## Backend kurulumu

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

- API: http://localhost:8000/docs
- Health: http://localhost:8000/health
- Predict: `POST /predict` → `{ "text": "..." }`

Port meşgulse:

```powershell
netstat -ano | findstr :8000
taskkill /PID <numara> /F
```

## Frontend kurulumu

```powershell
cd frontend
npm install
npm run dev
```

- Uygulama: http://localhost:5173
- Geliştirme modunda `/api` istekleri otomatik olarak backend'e proxy edilir.

## Kullanım akışı

1. Login ekranından giriş yapın.
2. **Mail Yaz** / **Oluştur** ile yeni ileti açın.
3. Kime, konu ve mesajı yazın (kalın, italik, liste vb. formatlama desteklenir).
4. **Gönder**'e basın → etik model analiz ekranı açılır.
5. Adımlar sırayla tamamlanır, ardından karar ve model özeti gösterilir.
6. Toxic ise **Düzenle** ile compose ekranına dönülür; değilse **Tamam** ile kapanır.

## Model kararı

- Eşik: `0.6` (backend ile aynı)
- `toxic_score >= 0.6` → **Gönderilemez** / `TOXIC`
- `toxic_score < 0.6` → **Gönderilebilir** / `SAFE`
- Yüzde örneği: `%91 toxic — Gönderilemez`

## Özellikler

- Gmail benzeri responsive tasarım (web + mobil)
- Açılır/kapanır sidebar (web)
- Dark / light mode
- Canlı analiz adımları ve geçen süre göstergesi (🕒)
- FastAPI + `dbmdz/bert-base-turkish-cased` fine-tune modeli

## Üretim build

```powershell
cd frontend
npm run build
npm run preview
```

## Model dosyası (önemli)

Model Git'e eklenmez (~422 MB). Klasör silindiyse Masaüstü'ndeki zip'ten geri yükleyin:

```powershell
cd backend
.\restore-model.ps1
```

Zip yolu: `C:\Users\kubra\OneDrive\Desktop\final-toxic-mail-model.zip`

Hedef klasör: `backend/model/final-toxic-mail-model/`  
İçinde `model.safetensors` olmalıdır.

## Notlar

- Mail gönderimi simüledir; gerçek SMTP entegrasyonu yoktur.
- Backend kapalıysa analiz ekranında hata mesajı görünür.
- `uvicorn` ve `venv` komutlarını `backend` klasöründen çalıştırın, proje kökünden değil.
