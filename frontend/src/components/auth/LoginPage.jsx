import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import Icon from "../common/Icon.jsx";
import "./LoginPage.css";

export default function LoginPage() {
  const { login, error } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    login(formData.get("email"), formData.get("password"));
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
            <p>E-posta göndermeden önce etik kontrol</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            E-posta
            <input
              name="email"
              type="email"
              placeholder="ornek@example.com"
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

          <button type="submit" className="primary-button login-submit">
            Giriş yap
          </button>
        </form>

        <div className="login-demo-users">
          <p>Demo kullanıcılar</p>
          <ul>
            <li>sezi@example.com / etik2026</li>
            <li>kubra@example.com / etik2026</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
