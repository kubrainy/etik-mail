import MailListItem from "./MailListItem.jsx";
import Icon from "../common/Icon.jsx";
import "./MailList.css";

export default function MailList({
  mails,
  folder = "inbox",
  emptyMessage,
  searchQuery,
  onSearchChange,
  selectedIds,
  onSelectMail,
  onSelectAll,
  onRefresh,
  onMoveToTrash,
  onOpenMail,
}) {
  const allSelected = mails.length > 0 && selectedIds.length === mails.length;
  const showTrashAction = folder !== "trash" && selectedIds.length > 0;

  return (
    <div className="mail-list">
      <div className="mail-list-header">
        <div className="mail-search">
          <Icon name="search" size={20} />
          <input
            type="search"
            placeholder="E-postalarda arama yapın"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <div className="mail-list-actions">
          <input
            type="checkbox"
            aria-label="Tümünü seç"
            checked={allSelected}
            onChange={(event) => onSelectAll(event.target.checked)}
          />
          <button
            type="button"
            className="icon-button"
            aria-label="Yenile"
            onClick={onRefresh}
          >
            <Icon name="refresh" />
          </button>
          {showTrashAction ? (
            <button
              type="button"
              className="icon-button"
              aria-label="Çöp kutusuna taşı"
              onClick={onMoveToTrash}
            >
              <Icon name="delete" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="mail-list-items">
        {mails.length === 0 ? (
          <p className="mail-list-empty">{emptyMessage}</p>
        ) : (
          mails.map((mail) => (
            <MailListItem
              key={mail.id}
              mail={mail}
              folder={folder}
              selected={selectedIds.includes(mail.id)}
              onSelect={(checked) => onSelectMail(mail.id, checked)}
              onOpen={onOpenMail}
            />
          ))
        )}
      </div>
    </div>
  );
}
