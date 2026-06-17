from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import model_service
from model_service import load_model, predict_mail


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_model()
    yield


app = FastAPI(
    title="Etik Mail API",
    description="E-posta metinlerinde toksik / uygunsuz dil tespiti",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Analiz edilecek e-posta metni")


class PredictResponse(BaseModel):
    result: str
    toxic_score: float
    non_toxic_score: float
    reason: str


@app.get("/")
def root():
    return {
        "service": "etik-mail-api",
        "status": "ok",
        "health": "/health",
        "docs": "/docs",
        "predict": "/predict",
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "etik-mail-api",
        "model_loaded": model_service.model is not None
        and model_service.tokenizer is not None,
    }


@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Metin boş olamaz.")

    try:
        return predict_mail(text)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
