import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/layout/AppShell.jsx";
import MailList from "../components/mail/MailList.jsx";
import ComposeModal from "../components/mail/ComposeModal.jsx";
import MailDetailModal from "../components/mail/MailDetailModal.jsx";
import AnalysisModal from "../components/analysis/AnalysisModal.jsx";
import { MOCK_MAILS } from "../data/mockMails.js";
import { useMailAnalysis } from "../hooks/useMailAnalysis.js";
import {
  addMail,
  getInboxMails,
  getSentMails,
} from "../services/mailStore.js";
import {
  filterTrashedMails,
  getTrashMails,
  moveToTrash,
} from "../services/trashStore.js";
import { createSentMail, filterMails, getFolderTitle } from "../utils/mail.js";

const EMPTY_MESSAGES = {
  inbox: "Gelen kutunuz boş.",
  sent: "Henüz gönderilmiş mail yok. Mail yazıp etik analizden geçirin.",
  trash: "Çöp kutusu boş.",
};

export default function InboxPage({ user, onLogout, theme, onToggleTheme }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeDraft, setComposeDraft] = useState(null);
  const [toast, setToast] = useState("");
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [openedMail, setOpenedMail] = useState(null);
  const [mailboxVersion, setMailboxVersion] = useState(0);

  const analysis = useMailAnalysis();

  const refreshMailbox = () => setMailboxVersion((value) => value + 1);

  useEffect(() => {
    refreshMailbox();
    setSelectedIds([]);
  }, [user.email]);

  useEffect(() => {
    setSelectedIds([]);
    setOpenedMail(null);
  }, [activeFolder]);

  const folderMails = useMemo(() => {
    void mailboxVersion;

    if (activeFolder === "sent") {
      return filterTrashedMails(user.email, getSentMails(user.email), "sent");
    }

    if (activeFolder === "trash") {
      return getTrashMails(user.email);
    }

    const received = filterTrashedMails(
      user.email,
      getInboxMails(user.email),
      "inbox"
    );
    const inboxMocks = filterTrashedMails(user.email, MOCK_MAILS, "inbox");
    return [...received, ...inboxMocks];
  }, [activeFolder, user.email, mailboxVersion]);

  const visibleMails = useMemo(
    () => filterMails(folderMails, searchQuery),
    [folderMails, searchQuery]
  );

  const emptyMessage = searchQuery.trim()
    ? "Aramanızla eşleşen mail bulunamadı."
    : EMPTY_MESSAGES[activeFolder];

  const openCompose = (draft = null) => {
    setComposeDraft(draft);
    setComposeOpen(true);
  };

  const handleSend = async (mail) => {
    setComposeOpen(false);
    await analysis.runAnalysis(mail);
  };

  const handleAnalysisClose = () => {
    if (analysis.result && !analysis.result.isToxic && analysis.mailDraft) {
      const newMail = createSentMail(analysis.mailDraft, user);
      addMail(newMail);
      refreshMailbox();
      setActiveFolder("sent");
      setToast(`${newMail.toName} adresine mail gönderildi.`);
      setTimeout(() => setToast(""), 3500);
    }
    analysis.close();
  };

  const handleEdit = () => {
    const draft = analysis.mailDraft;
    analysis.close();
    openCompose(draft);
  };

  const handleFolderChange = (folderId) => {
    setActiveFolder(folderId);
    setSearchQuery("");
    setMobileMenuOpen(false);
  };

  const handleTopMenu = () => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      setMobileMenuOpen((value) => !value);
      return;
    }
    setSidebarCollapsed((value) => !value);
  };

  const handleSelectMail = (mailId, checked) => {
    setSelectedIds((prev) =>
      checked ? [...new Set([...prev, mailId])] : prev.filter((id) => id !== mailId)
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? visibleMails.map((mail) => mail.id) : []);
  };

  const handleMoveToTrash = () => {
    if (selectedIds.length === 0) return;

    const sourceFolder = activeFolder === "trash" ? null : activeFolder;
    if (!sourceFolder) return;

    const selectedMails = visibleMails.filter((mail) =>
      selectedIds.includes(mail.id)
    );

    selectedMails.forEach((mail) => moveToTrash(user.email, mail, sourceFolder));

    refreshMailbox();
    setSelectedIds([]);
    setToast(`${selectedMails.length} mail çöp kutusuna taşındı.`);
    setTimeout(() => setToast(""), 3000);
  };

  const handleRefresh = () => {
    refreshMailbox();
    setToast("Liste yenilendi.");
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <>
      <AppShell
        title={getFolderTitle(activeFolder)}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((value) => !value)}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((value) => !value)}
        onTopMenu={handleTopMenu}
        onCompose={() => openCompose()}
        user={user}
        onLogout={onLogout}
        onToggleTheme={onToggleTheme}
        theme={theme}
        activeFolder={activeFolder}
        onFolderChange={handleFolderChange}
      >
        <MailList
          mails={visibleMails}
          folder={activeFolder}
          emptyMessage={emptyMessage}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedIds={selectedIds}
          onSelectMail={handleSelectMail}
          onSelectAll={handleSelectAll}
          onRefresh={handleRefresh}
          onMoveToTrash={handleMoveToTrash}
          onOpenMail={setOpenedMail}
        />
      </AppShell>

      <MailDetailModal
        mail={openedMail}
        folder={activeFolder}
        open={Boolean(openedMail)}
        onClose={() => setOpenedMail(null)}
      />

      <ComposeModal
        open={composeOpen}
        initialMail={composeDraft}
        onClose={() => setComposeOpen(false)}
        onSend={handleSend}
      />

      <AnalysisModal
        open={analysis.isOpen}
        activeStep={analysis.activeStep}
        completedSteps={analysis.completedSteps}
        result={analysis.result}
        error={analysis.error}
        elapsedMs={analysis.elapsedMs}
        stats={analysis.stats}
        onClose={handleAnalysisClose}
        onEdit={handleEdit}
      />

      {toast ? <div className="toast">{toast}</div> : null}
    </>
  );
}
