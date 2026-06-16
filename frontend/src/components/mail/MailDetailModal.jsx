import Icon from "../common/Icon.jsx";
import { downloadAttachment, formatFileSize } from "../../utils/attachments.js";
import { getMailBodyHtml } from "../../utils/mail.js";
import "./MailDetailModal.css";

export default function MailDetailModal({ mail, folder = "inbox", open, onClose }) {
  if (!open || !mail) return null;

  const isSent = folder === "sent";
  const senderLabel = isSent ? "Kime" : "Kimden";
  const senderValue = isSent
    ? mail.toName || mail.to
    : mail.fromName || mail.from;
  const attachments = mail.attachments || [];

  return (
    <div className="mail-detail-overlay">
      <div className="mail-detail-modal" role="dialog" aria-modal="true" aria-label="Mail detayı">
        <div className="mail-detail-header">
          <button type="button" className="icon-button" onClick={onClose} aria-label="Geri">
            <Icon name="arrow_back" />
          </button>
          <h3 className="mail-detail-subject">{mail.subject}</h3>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Kapat">
            <Icon name="close" />
          </button>
        </div>

        <div className="mail-detail-meta">
          <div className="mail-detail-meta-row">
            <span className="mail-detail-label">{senderLabel}</span>
            <div className="mail-detail-person">
              <div className="mail-detail-avatar">{senderValue.charAt(0).toUpperCase()}</div>
              <div>
                <strong>{senderValue}</strong>
                <span>{isSent ? mail.to : mail.from}</span>
              </div>
            </div>
            <span className="mail-detail-date">{mail.date}</span>
          </div>

          {!isSent && mail.to ? (
            <div className="mail-detail-meta-row mail-detail-meta-secondary">
              <span className="mail-detail-label">Kime</span>
              <span>{mail.toName || mail.to}</span>
            </div>
          ) : null}
        </div>

        {attachments.length > 0 ? (
          <div className="mail-detail-attachments">
            <div className="mail-detail-attachments-title">
              <Icon name="attach_file" size={18} />
              <span>
                {attachments.length} ek
              </span>
            </div>
            <div className="mail-detail-attachment-list">
              {attachments.map((file) => (
                <button
                  key={file.id}
                  type="button"
                  className="mail-detail-attachment"
                  onClick={() => downloadAttachment(file)}
                >
                  <Icon name="description" size={20} />
                  <span className="mail-detail-attachment-name">{file.name}</span>
                  <span className="mail-detail-attachment-size">{formatFileSize(file.size)}</span>
                  <Icon name="download" size={18} />
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div
          className="mail-detail-body"
          dangerouslySetInnerHTML={{ __html: getMailBodyHtml(mail) }}
        />
      </div>
    </div>
  );
}
