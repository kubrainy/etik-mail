import { ANALYSIS_STEPS } from "../../hooks/useMailAnalysis.js";
import "./AnalysisModal.css";

function formatElapsed(ms) {
  return `${(ms / 1000).toFixed(1)} sn`;
}

export default function AnalysisModal({
  open,
  activeStep,
  completedSteps,
  result,
  error,
  elapsedMs,
  stats,
  onClose,
  onEdit,
}) {
  if (!open) return null;

  const isDone = Boolean(result || error);

  return (
    <div className="analysis-overlay">
      <div className="analysis-modal">
        <div className="analysis-header">
          <div>
            <p className="analysis-kicker">LOCAL FASTAPI + BERT</p>
            <h3>Etik Model Kontrolü</h3>
            <p className="analysis-subtitle">
              {result?.isToxic
                ? "Gönderim durduruldu"
                : result
                  ? "Gönderim onaylandı"
                  : error
                    ? "Analiz başarısız"
                    : "Analiz devam ediyor"}
            </p>
          </div>

          <div className="analysis-header-meta">
            {result ? (
              <span className={`badge ${result.isToxic ? "toxic" : "safe"}`}>
                {result.label}
              </span>
            ) : null}
            <span className="analysis-timer" aria-label="Geçen süre">
              🕒 {formatElapsed(elapsedMs)}
            </span>
          </div>
        </div>

        <div className="analysis-body">
          <section className="analysis-steps-panel">
            <h4>Analiz süreci</h4>
            <div className="analysis-steps">
              {ANALYSIS_STEPS.map((step) => {
                const done = completedSteps.includes(step.id);
                const active = activeStep === step.id && !done;

                return (
                  <article
                    key={step.id}
                    className={`analysis-step ${done ? "done" : ""} ${
                      active ? "active" : ""
                    }`}
                  >
                    <div className="analysis-step-icon">{done ? "✓" : active ? "…" : "○"}</div>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.description}</p>
                    </div>
                    <span className="analysis-step-status">
                      {done ? "Tamamlandı" : active ? "Çalışıyor" : "Bekliyor"}
                    </span>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="analysis-result-panel">
            {error ? (
              <div className="analysis-card error-card">
                <h4>Analiz hatası</h4>
                <p>{error}</p>
                <p className="analysis-hint">
                  Sunucuya bağlanılamadı. Lütfen backend servisinin çalıştığından emin olun ve tekrar deneyin.
                </p>
              </div>
            ) : result ? (
              <>
                <div
                  className={`analysis-card decision-card ${
                    result.isToxic ? "toxic" : "safe"
                  }`}
                >
                  <h4>
                    Model kararı: {result.result}
                  </h4>
                  <p className="analysis-decision-percent">{result.decisionText}</p>
                  <p>{result.reason}</p>
                  <div className="analysis-metrics">
                    <span>ETİKET: {result.label}</span>
                    <span className="analysis-timer-inline">
                      🕒 {formatElapsed(elapsedMs)}
                    </span>
                  </div>
                </div>

                <div className="analysis-card summary-card">
                  <h4>Model özeti</h4>
                  <ul>
                    <li>
                      <strong>MODEL:</strong> dbmdz/bert-base-turkish-cased fine-tune
                    </li>
                    <li>
                      <strong>ENDPOINT:</strong> 127.0.0.1:8000/predict
                    </li>
                    <li>
                      <strong>KARAR:</strong> {result.label}
                    </li>
                    <li>
                      <strong>TOKSİK SKOR:</strong> %{result.toxicPercent}
                    </li>
                    <li>
                      <strong>ETİK SKOR:</strong> %{result.nonToxicPercent}
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="analysis-card loading-card">
                <h4>Model çalışıyor</h4>
                <p>Adımlar tamamlandıkça sonuç burada görünecek.</p>
              </div>
            )}
          </section>
        </div>

        {stats ? (
          <div className="analysis-stats">
            <span className="badge">Konu: {stats.subjectLength} karakter</span>
            <span className="badge">Gövde: {stats.bodyWords} kelime</span>
            <span className="badge">
              Token: {stats.tokens} / 256
            </span>
            <span className="badge">127.0.0.1:8000/predict</span>
          </div>
        ) : null}

        <div className="analysis-actions">
          {result?.isToxic ? (
            <button type="button" className="ghost-button" onClick={onEdit}>
              Düzenle
            </button>
          ) : null}
          <button
            type="button"
            className="primary-button"
            onClick={onClose}
            disabled={!isDone}
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
}
