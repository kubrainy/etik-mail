import Icon from "../common/Icon.jsx";
import "./AppShell.css";

const FOLDERS = [
  { id: "inbox", label: "Gelen Kutusu", icon: "inbox" },
  { id: "sent", label: "Gönderilen", icon: "send" },
  { id: "trash", label: "Çöp Kutusu", icon: "delete" },
];

export default function Sidebar({
  collapsed,
  onToggle,
  onCompose,
  mobileOpen,
  onCloseMobile,
  activeFolder,
  onFolderChange,
}) {
  return (
    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""} ${
        mobileOpen ? "mobile-open" : ""
      }`}
    >
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <img src="/favicon.png" alt="" className="sidebar-logo" />
          {!collapsed ? <span>Etik Mail</span> : null}
        </div>
        <button
          type="button"
          className="icon-button sidebar-toggle desktop-only"
          onClick={onToggle}
          aria-label="Kenar çubuğunu daralt"
        >
          <Icon name={collapsed ? "chevron_right" : "chevron_left"} />
        </button>
        <button
          type="button"
          className="icon-button mobile-only"
          onClick={onCloseMobile}
          aria-label="Menüyü kapat"
        >
          <Icon name="close" />
        </button>
      </div>

      <button
        type="button"
        className={`compose-sidebar-button ${collapsed ? "compact" : ""}`}
        onClick={() => {
          onCompose();
          onCloseMobile?.();
        }}
      >
        <Icon name="edit" />
        {!collapsed ? <span>Mail Yaz</span> : null}
      </button>

      <nav className="sidebar-nav">
        {FOLDERS.map((folder) => (
          <button
            key={folder.id}
            type="button"
            className={`sidebar-link ${folder.id === activeFolder ? "active" : ""}`}
            title={folder.label}
            onClick={() => onFolderChange(folder.id)}
          >
            <span className="sidebar-link-icon">
              <Icon name={folder.icon} />
            </span>
            {!collapsed ? <span>{folder.label}</span> : null}
          </button>
        ))}
      </nav>
    </aside>
  );
}
