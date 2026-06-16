import Sidebar from "./Sidebar.jsx";
import TopBar from "./TopBar.jsx";
import MobileNav from "./MobileNav.jsx";
import "./AppShell.css";

export default function AppShell({
  children,
  title,
  sidebarCollapsed,
  onToggleSidebar,
  mobileMenuOpen,
  onToggleMobileMenu,
  onTopMenu,
  onCompose,
  user,
  onLogout,
  onToggleTheme,
  theme,
  activeFolder,
  onFolderChange,
}) {
  return (
    <div className="app-shell">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={onToggleSidebar}
        onCompose={onCompose}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={onToggleMobileMenu}
        activeFolder={activeFolder}
        onFolderChange={onFolderChange}
      />

      {mobileMenuOpen ? (
        <button
          type="button"
          className="mobile-overlay"
          aria-label="Menüyü kapat"
          onClick={onToggleMobileMenu}
        />
      ) : null}

      <div className="main-area">
        <TopBar
          title={title}
          user={user}
          onLogout={onLogout}
          onToggleTheme={onToggleTheme}
          theme={theme}
          onTopMenu={onTopMenu}
        />
        <div className="content-area">{children}</div>
        <MobileNav onCompose={onCompose} />
      </div>
    </div>
  );
}
