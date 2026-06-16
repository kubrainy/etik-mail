import Icon from "../common/Icon.jsx";
import "./MailList.css";

export default function MailListItem({
  mail,
  folder = "inbox",
  selected,
  onSelect,
  onOpen,
}) {
  const displayName =
    folder === "sent" ? mail.toName || mail.to : mail.fromName;

  const handleOpen = () => {
    onOpen?.(mail);
  };

  return (
    <article className={`mail-item ${selected ? "selected" : ""}`}>
      <input
        type="checkbox"
        aria-label={`${mail.subject} seç`}
        checked={selected}
        onChange={(event) => onSelect(event.target.checked)}
        onClick={(event) => event.stopPropagation()}
      />
      <button
        type="button"
        className={`mail-star ${mail.starred ? "active" : ""}`}
        aria-label="Yıldızla"
        onClick={(event) => event.stopPropagation()}
      >
        {mail.starred ? "★" : "☆"}
      </button>
      <div className="mail-item-avatar">{displayName.charAt(0).toUpperCase()}</div>
      <button
        type="button"
        className="mail-item-content"
        onClick={handleOpen}
      >
        <div className="mail-item-top">
          <strong>{folder === "sent" ? `Kime: ${displayName}` : displayName}</strong>
          <span className="mail-item-date">{mail.date}</span>
        </div>
        <div className="mail-item-subject">
          {mail.subject}
          {(mail.attachments || []).length > 0 ? (
            <span className="mail-item-attachment-badge" aria-label="Ek var">
              <Icon name="attach_file" size={14} />
            </span>
          ) : null}
        </div>
        <div className="mail-item-preview">{mail.preview}</div>
      </button>
    </article>
  );
}
