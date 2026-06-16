import { useCallback, useEffect, useRef, useState } from "react";
import { predictMail } from "../services/api.js";

const TOXIC_THRESHOLD = 0.6;

export const ANALYSIS_STEPS = [
  {
    id: 1,
    title: "Mail içeriği hazırlanıyor",
    description: "Konu ve gövde alanları kontrol ediliyor.",
  },
  {
    id: 2,
    title: "Metin birleştiriliyor",
    description: "Konu ve gövde tek metin haline getiriliyor.",
  },
  {
    id: 3,
    title: "Metin temizleniyor",
    description: "HTML etiketleri ve fazla boşluklar temizleniyor.",
  },
  {
    id: 4,
    title: "BERT tokenizer hazırlanıyor",
    description: "Metin token'lara ayrılıyor.",
  },
  {
    id: 5,
    title: "Yerel model servisine gönderiliyor",
    description: "FastAPI üzerinden BERT modeline istek atılıyor.",
  },
  {
    id: 6,
    title: "Model kararı yorumlanıyor",
    description: "Softmax skoru karara dönüştürülüyor.",
  },
];

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

function buildPayload(mail) {
  const subject = mail.subject?.trim() || "";
  const body = stripHtml(mail.body).trim();
  return subject ? `Konu: ${subject}\n\n${body}` : body;
}

function estimateTokens(text) {
  return Math.min(256, Math.ceil(text.length / 4));
}

export function useMailAnalysis() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [mailDraft, setMailDraft] = useState(null);
  const [stats, setStats] = useState(null);
  const timerRef = useRef(null);
  const startRef = useRef(0);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    startRef.current = Date.now();
    setElapsedMs(0);
    stopTimer();
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startRef.current);
    }, 100);
  }, [stopTimer]);

  useEffect(() => () => stopTimer(), [stopTimer]);

  const reset = useCallback(() => {
    stopTimer();
    setActiveStep(0);
    setCompletedSteps([]);
    setResult(null);
    setError("");
    setElapsedMs(0);
    setStats(null);
  }, [stopTimer]);

  const close = useCallback(() => {
    setIsOpen(false);
    reset();
    setMailDraft(null);
  }, [reset]);

  const runAnalysis = useCallback(
    async (mail) => {
      reset();
      setMailDraft(mail);
      setIsOpen(true);
      startTimer();

      const payload = buildPayload(mail);
      const bodyText = stripHtml(mail.body).trim();

      setStats({
        subjectLength: mail.subject?.trim().length || 0,
        bodyWords: bodyText ? bodyText.split(/\s+/).length : 0,
        tokens: estimateTokens(payload),
      });

      const markDone = async (stepId, delay = 450) => {
        setActiveStep(stepId);
        await new Promise((resolve) => setTimeout(resolve, delay));
        setCompletedSteps((prev) => [...new Set([...prev, stepId])]);
      };

      try {
        await markDone(1);
        await markDone(2);
        await markDone(3);
        await markDone(4);

        setActiveStep(5);
        const apiResult = await predictMail(payload);
        setCompletedSteps((prev) => [...new Set([...prev, 5])]);

        setActiveStep(6);
        await new Promise((resolve) => setTimeout(resolve, 350));

        const toxicPercent = Math.round(apiResult.toxic_score * 100);
        const isToxic = apiResult.toxic_score >= TOXIC_THRESHOLD;

        setResult({
          ...apiResult,
          toxicPercent,
          nonToxicPercent: Math.round(apiResult.non_toxic_score * 100),
          isToxic,
          label: isToxic ? "TOXIC" : "SAFE",
          decisionText: isToxic
            ? `%${toxicPercent} toxic — Gönderilemez`
            : `%${toxicPercent} toxic — Gönderilebilir`,
        });

        setCompletedSteps((prev) => [...new Set([...prev, 6])]);
      } catch (err) {
        setError(err.message || "Analiz sırasında hata oluştu.");
      } finally {
        stopTimer();
      }
    },
    [reset, startTimer, stopTimer]
  );

  return {
    isOpen,
    activeStep,
    completedSteps,
    result,
    error,
    elapsedMs,
    mailDraft,
    stats,
    runAnalysis,
    close,
  };
}
