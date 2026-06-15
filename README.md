# Etik Mail

Türkçe e-posta metinlerinde toksik / uygunsuz dil tespiti yapan TÜBİTAK projesi.

## Proje yapısı

```
etik-mail/
├── backend/          # FastAPI + BERT modeli
│   ├── main.py
│   ├── model_service.py
│   └── model/final-toxic-mail-model/
└── frontend/         # React (sonraki adım)
```

## Backend kurulumu

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API dokümantasyonu: http://localhost:8000/docs

## Test

```powershell
curl -X POST http://localhost:8000/predict -H "Content-Type: application/json" -d "{\"text\": \"Merhaba, raporu birlikte gözden geçirebilir miyiz?\"}"
```
