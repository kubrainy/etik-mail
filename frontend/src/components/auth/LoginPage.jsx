import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import Icon from "../common/Icon.jsx";
import "./LoginPage.css";

export default function LoginPage() {
  const { login, error, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [smtpHint] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await login(formData.get("email"), formData.get("password"));
  };

  return (
    <div className="login-page">
      <button
        type="button"
        className="login-theme-toggle icon-button"
        onClick={toggleTheme}
        aria-label="Tema değiştir"
      >
        {theme === "light" ? <Icon name="dark_mode" /> : <Icon name="light_mode" />}
      </button>

      <div className="login-card">
        <div className="login-brand">
          <img src="/favicon.png" alt="Etik Mail" className="login-logo" />
          <div>
            <h1>Etik Mail</h1>
            <p>Giriş yap, etik analizden geçir, gerçek mail gönder</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            E-posta
            <input
              name="email"
              type="email"
              placeholder="ornek@gmail.com"
              defaultValue="sezi@example.com"
              required
            />
          </label>

          <label>
            Şifre
            <input
              name="password"
              type="password"
              placeholder="Şifreniz"
              defaultValue="etik2026"
              required
            />
          </label>

          {error ? <p className="login-error">{error}</p> : null}

          <button type="submit" className="primary-button login-submit" disabled={loading}>
            {loading ? "Giriş yapılıyor..." : "Giriş yap"}
          </button>
        </form>

        <div className="login-demo-users">
          <p>Varsayılan hesaplar (backend/.env ile değiştirilebilir)</p>
          <ul>
            <li>sezi@example.com / etik2026</li>
            <li>kubra@example.com / etik2026</li>
          </ul>
          {smtpHint ? (
            <p className="login-smtp-note">
              Gerçek mail gönderimi için backend/.env dosyasına Gmail veya SendGrid SMTP bilgilerini ekleyin.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
