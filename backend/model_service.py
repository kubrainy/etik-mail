import os
from pathlib import Path

import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer

MODEL_DIR = Path(__file__).resolve().parent / "model" / "final-toxic-mail-model"
HF_MODEL_ID = os.getenv("HF_MODEL_ID", "kubrainy/etik-mail-toxic-model")
TOXIC_THRESHOLD = 0.6

tokenizer = None
model = None


def _get_model_source():
    if MODEL_DIR.exists():
        return str(MODEL_DIR)
    return HF_MODEL_ID


def load_model() -> None:
    global tokenizer, model

    source = _get_model_source()
    tokenizer = AutoTokenizer.from_pretrained(source)
    model = AutoModelForSequenceClassification.from_pretrained(source)
    model.eval()


def predict_mail(text: str) -> dict:
    if model is None or tokenizer is None:
        raise RuntimeError("Model henüz yüklenmedi.")

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=256,
    )

    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.softmax(outputs.logits, dim=1)[0]

    non_toxic_score = probs[0].item()
    toxic_score = probs[1].item()

    if toxic_score >= TOXIC_THRESHOLD:
        result = "Gönderilemez"
        reason = "Metin saldırgan, iğneleyici, tehditkâr veya etik açıdan uygunsuz olabilir."
    else:
        result = "Gönderilebilir"
        reason = "Metin genel olarak profesyonel ve uygun görünüyor."

    return {
        "result": result,
        "toxic_score": round(toxic_score, 4),
        "non_toxic_score": round(non_toxic_score, 4),
        "reason": reason,
    }