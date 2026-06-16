import Icon from "../common/Icon.jsx";
import "./AppShell.css";

export default function MobileNav({ onCompose }) {
  return (
    <nav className="mobile-nav mobile-only">
      <button type="button" className="mobile-nav-item active">
        <Icon name="mail" />
        <span>Mail</span>
      </button>
      <button type="button" className="mobile-compose-fab" onClick={onCompose}>
        <Icon name="edit" size={18} />
        Oluştur
      </button>
    </nav>
  );
}
