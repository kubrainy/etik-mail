# Etik Mail

Türkçe e-posta metinlerinde toksik ve uygunsuz dil tespiti yapan **TÜBİTAK** projesi. Gmail benzeri web arayüzü, FastAPI backend ve fine-tune edilmiş BERT modeli ile çalışır.

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.2+-EE4C2C?logo=pytorch&logoColor=white)](https://pytorch.org/)

---

## İçindekiler

- [Özellikler](#özellikler)
- [Teknolojiler](#teknolojiler)
- [Proje yapısı](#proje-yapısı)
- [Gereksinimler](#gereksinimler)
- [Kurulum](#kurulum)
- [Demo hesaplar](#demo-hesaplar)
- [Kullanım](#kullanım)
- [API](#api)
- [Model kararı](#model-kararı)
- [Üretim build](#üretim-build)
- [Bilinen sınırlamalar](#bilinen-sınırlamalar)

---

## Özellikler

- Gmail benzeri responsive arayüz (masaüstü + mobil)
- Giriş ekranı, açılır/kapanır sidebar ve koyu/açık tema
- Mail yazma: biçimlendirme araç çubuğu, dosya ekleme
- Gönderim öncesi **6 adımlı etik analiz** modalı ve canlı süre göstergesi
- Toksik içerik tespitinde **Gönderilemez** kararı; güvenli içerikte simüle gönderim
- Kullanıcılar arası mail (localStorage), gelen kutusu / gönderilen / çöp kutusu
- Mail detay görünümü ve ek dosya indirme
- Arama, yenileme ve çoklu seçim ile silme

---

## Teknolojiler

| Katman | Stack |
|--------|--------|
| **Frontend** | React 19, Vite 8, CSS (Gmail tarzı tasarım) |
| **Backend** | FastAPI, Uvicorn, Pydantic |
| **Model** | `dbmdz/bert-base-turkish-cased` üzerine fine-tune, Hugging Face Transformers, PyTorch |

---

## Proje yapısı

```
etik-mail/
├── backend/
│   ├── main.py                 # FastAPI uygulaması
│   ├── model_service.py        # Model yükleme ve tahmin
│   ├── requirements.txt
│   ├── start.ps1               # Windows: venv + uvicorn
│   ├── restore-model.ps1       # Model zip'ini çıkarma (Windows)
│   └── model/
│       └── final-toxic-mail-model/   # Git'e dahil değil (~422 MB)
├── frontend/
│   ├── src/
│   │   ├── components/         # UI bileşenleri
│   │   ├── pages/              # InboxPage
│   │   ├── services/           # API, mail store
│   │   └── hooks/              # useMailAnalysis
│   ├── public/favicon.png
│   ├── package.json
│   └── vite.config.js          # /api → backend proxy
└── README.md
```

---

## Gereksinimler

- **Python** 3.10 veya üzeri
- **Node.js** 18 veya üzeri (npm ile)
- **Model dosyası:** `final-toxic-mail-model` (repo dışında sağlanır)
- Windows için PowerShell; Linux/macOS için eşdeğer terminal komutları

---

## Kurulum

### 1. Repoyu klonlayın

```bash
git clone https://github.com/KULLANICI/etik-mail.git
cd etik-mail
```

> `KULLANICI` kısmını kendi GitHub kullanıcı adınızla değiştirin.

### 2. Model dosyasını ekleyin

Model boyutu nedeniyle Git'e **eklenmez**. Aşağıdaki yollardan biriyle `backend/model/final-toxic-mail-model/` klasörünü oluşturun:

**Seçenek A — Manuel**

`final-toxic-mail-model.zip` dosyasını açıp içeriği şu konuma kopyalayın:

```
backend/model/final-toxic-mail-model/
```

Klasörde en az şu dosyalar bulunmalıdır:

- `config.json`
- `model.safetensors`
- `tokenizer.json` (ve ilgili tokenizer dosyaları)

**Seçenek B — PowerShell script (Windows)**

Zip dosyasını bilgisayarınıza indirdikten sonra `backend/restore-model.ps1` içindeki `$zip` yolunu güncelleyin ve çalıştırın:

```powershell
cd backend
.\restore-model.ps1
```

### 3. Backend

**Windows (PowerShell)**

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Veya tek komutla:

```powershell
cd backend
.\start.ps1
```

**Linux / macOS**

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

- API dokümantasyonu: http://localhost:8000/docs
- Health check: http://localhost:8000/health

### 4. Frontend

Yeni bir terminal açın:

```bash
cd frontend
npm install
npm run dev
```

- Uygulama: http://localhost:5173
- Geliştirme modunda `/api` istekleri otomatik olarak `http://127.0.0.1:8000` adresine proxy edilir.

### Port çakışması (Windows)

```powershell
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

---

## Demo hesaplar

| E-posta | Şifre | Ad |
|---------|--------|-----|
| `sezi@example.com` | `etik2026` | Sezi Yılmaz |
| `kubra@example.com` | `etik2026` | Kübra Çetinkaya |

---

## Kullanım

1. Login ekranından demo hesaplardan biriyle giriş yapın.
2. **Mail Yaz** veya **Oluştur** ile yeni ileti açın.
3. Alıcı, konu ve mesajı yazın; isteğe bağlı dosya ekleyin.
4. **Gönder**'e basın — etik model analiz ekranı açılır.
5. Analiz adımları tamamlanır; karar ve skor özeti gösterilir.
6. İçerik toksikse **Düzenle** ile compose ekranına dönün; güvenliyse **Tamam** ile gönderimi tamamlayın.
7. Gelen kutusunda bir maile tıklayarak tam metni okuyun; ekleri indirebilirsiniz.

---

## API

### `GET /health`

Servis durumunu döner.

```json
{ "status": "ok", "service": "etik-mail-api" }
```

### `POST /predict`

E-posta metnini analiz eder.

**İstek**

```json
{ "text": "Analiz edilecek e-posta metni" }
```

**Yanıt**

```json
{
  "result": "TOXIC",
  "toxic_score": 0.91,
  "non_toxic_score": 0.09,
  "reason": "Metin toksik dil içeriyor."
}
```

| Alan | Açıklama |
|------|----------|
| `result` | `TOXIC` veya `SAFE` |
| `toxic_score` | Toksik sınıf olasılığı (0–1) |
| `non_toxic_score` | Güvenli sınıf olasılığı (0–1) |
| `reason` | Kısa açıklama |

---

## Model kararı

- **Eşik:** `0.6` (`backend/model_service.py`)
- `toxic_score >= 0.6` → **Gönderilemez** (`TOXIC`)
- `toxic_score < 0.6` → **Gönderilebilir** (`SAFE`)
- Örnek: `%91 toxic — Gönderilemez`

---

## Üretim build

```bash
cd frontend
npm run build
npm run preview
```

Backend için production ortamında reverse proxy (nginx vb.) ile `uvicorn` veya `gunicorn` kullanılabilir.

---

## Bilinen sınırlamalar

- Mail gönderimi **simüledir**; gerçek SMTP entegrasyonu yoktur.
- Mailler ve ekler tarayıcı **localStorage**'ında tutulur; kalıcı sunucu tarafı depolama yoktur.
- Model dosyası repoda bulunmaz; clone sonrası manuel eklenmelidir.
- Backend kapalıysa analiz ekranında bağlantı hatası görünür.
- `uvicorn` ve sanal ortam komutlarını **`backend`** klasöründen çalıştırın, proje kökünden değil.

---

## Lisans

Bu proje TÜBİTAK kapsamında geliştirilmiştir. Lisans bilgisi eklenecektir.
