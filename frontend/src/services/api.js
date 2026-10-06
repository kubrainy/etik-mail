const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "/api" : "");

export async function predictMail(text) {
  const response = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const detail = typeof error.detail === "string" ? error.detail : null;
    throw new Error(
      detail ||
        (response.status === 422
          ? "Mail metni çok uzun veya geçersiz (en fazla 5000 karakter)."
          : "Model servisine ulaşılamadı."),
    );
  }

  return response.json();
}

export async function checkHealth() {
  const response = await fetch(`${API_BASE}/health`);
  return response.ok;
}
