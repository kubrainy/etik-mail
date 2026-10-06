import logging
import time
from collections import defaultdict, deque
from contextlib import asynccontextmanager
from threading import Lock

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import model_service
from model_service import load_model, predict_mail

logger = logging.getLogger("etik-mail-api")


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


RATE_LIMIT_PER_IP = 20
RATE_LIMIT_GLOBAL = 300
RATE_WINDOW_SECONDS = 60

_hits_lock = Lock()
_ip_hits: dict[str, deque] = defaultdict(deque)
_global_hits: deque = deque()


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _prune(hits: deque, now: float) -> None:
    while hits and now - hits[0] > RATE_WINDOW_SECONDS:
        hits.popleft()


def rate_limit(request: Request) -> None:
    now = time.monotonic()
    ip = _client_ip(request)

    with _hits_lock:
        _prune(_global_hits, now)
        ip_hits = _ip_hits[ip]
        _prune(ip_hits, now)

        if len(_global_hits) >= RATE_LIMIT_GLOBAL or len(ip_hits) >= RATE_LIMIT_PER_IP:
            raise HTTPException(
                status_code=429,
                detail="Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin.",
            )

        _global_hits.append(now)
        ip_hits.append(now)

        if len(_ip_hits) > 10_000:
            for key in [k for k, v in _ip_hits.items() if not v]:
                del _ip_hits[key]


class PredictRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="Analiz edilecek e-posta metni",
    )


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


@app.post(
    "/predict",
    response_model=PredictResponse,
    dependencies=[Depends(rate_limit)],
)
def predict(request: PredictRequest):
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Metin boş olamaz.")

    try:
        return predict_mail(text)
    except Exception as exc:
        logger.exception("Tahmin sırasında hata oluştu")
        raise HTTPException(
            status_code=500,
            detail="Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.",
        ) from exc
