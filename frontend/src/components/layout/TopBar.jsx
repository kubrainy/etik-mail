import Icon from "../common/Icon.jsx";
import "./AppShell.css";

export default function TopBar({
  title,
  user,
  onLogout,
  onToggleTheme,
  theme,
  onTopMenu,
}) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="icon-button"
          onClick={onTopMenu}
          aria-label="Menüyü aç"
        >
          <Icon name="menu" />
        </button>
        <h2>{title}</h2>
      </div>

      <div className="topbar-right">
        <button
          type="button"
          className="icon-button"
          onClick={onToggleTheme}
          aria-label="Tema değiştir"
        >
          <Icon name={theme === "light" ? "dark_mode" : "light_mode"} />
        </button>
        <div className="topbar-user">
          <div className="avatar" title={user.name}>
            {user.initials}
          </div>
          <strong className="topbar-user-name">{user.name}</strong>
        </div>
        <button type="button" className="ghost-button topbar-logout" onClick={onLogout}>
          Çıkış
        </button>
      </div>
    </header>
  );
}
