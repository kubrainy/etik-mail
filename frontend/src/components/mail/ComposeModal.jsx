import { useEffect, useRef, useState } from "react";
import Icon from "../common/Icon.jsx";
import { formatFileSize, readFileAsAttachment } from "../../utils/attachments.js";
import "./ComposeModal.css";

const FORMAT_ACTIONS = [
  { command: "bold", icon: "format_bold", title: "Kalın" },
  { command: "italic", icon: "format_italic", title: "İtalik" },
  { command: "underline", icon: "format_underlined", title: "Altı çizili" },
  { command: "strikeThrough", icon: "format_strikethrough", title: "Üstü çizili" },
  { command: "insertUnorderedList", icon: "format_list_bulleted", title: "Madde işaretli liste" },
  { command: "insertOrderedList", icon: "format_list_numbered", title: "Numaralı liste" },
];

export default function ComposeModal({ open, initialMail, onClose, onSend }) {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [subject, setSubject] = useState("");
  const [attachments, setAttachments] = useState([]);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setTo(initialMail?.to || "");
    setCc(initialMail?.cc || "");
    setSubject(initialMail?.subject || "");
    setAttachments(initialMail?.attachments || []);
    if (editorRef.current) {
      editorRef.current.innerHTML = initialMail?.body || "";
    }
  }, [open, initialMail]);

  if (!open) return null;

  const applyFormat = (command) => {
    editorRef.current?.focus();
    document.execCommand(command, false);
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    try {
      const nextAttachments = await Promise.all(files.map(readFileAsAttachment));
      setAttachments((prev) => {
        const existing = new Set(prev.map((item) => item.id));
        const merged = [...prev];
        nextAttachments.forEach((item) => {
          if (!existing.has(item.id)) merged.push(item);
        });
        return merged;
      });
    } catch {
      alert("Dosya eklenirken bir hata oluştu.");
    }

    event.target.value = "";
  };

  const removeAttachment = (attachmentId) => {
    setAttachments((prev) => prev.filter((item) => item.id !== attachmentId));
  };

  const handleSend = () => {
    const body = editorRef.current?.innerHTML || "";
    const plain = editorRef.current?.innerText?.trim() || "";

    if (!to.trim() || !subject.trim() || !plain) {
      alert("Kime, konu ve mesaj alanlarını doldurun.");
      return;
    }

    onSend({ to, cc, subject, body, attachments });
  };

  return (
    <div className="compose-overlay">
      <div className="compose-modal">
        <div className="compose-header">
          <h3>Yeni İleti</h3>
          <div className="compose-header-actions">
            <button type="button" className="icon-button" onClick={onClose} aria-label="Kapat">
              <Icon name="close" />
            </button>
          </div>
        </div>

        <div className="compose-fields">
          <div className="compose-row">
            <label>Kime</label>
            <input
              value={to}
              onChange={(event) => setTo(event.target.value)}
              placeholder="kubra@example.com"
            />
            {!showCc ? (
              <button type="button" className="compose-inline-link" onClick={() => setShowCc(true)}>
                Cc / Bcc
              </button>
            ) : null}
          </div>

          {showCc ? (
            <div className="compose-row">
              <label>Cc</label>
              <input
                value={cc}
                onChange={(event) => setCc(event.target.value)}
                placeholder="cc@example.com"
              />
            </div>
          ) : null}

          <div className="compose-row">
            <label>Konu</label>
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Konu"
            />
          </div>
        </div>

        <div
          ref={editorRef}
          className="compose-editor"
          contentEditable
          suppressContentEditableWarning
          aria-label="Mesaj gövdesi"
        />

        {attachments.length > 0 ? (
          <div className="compose-attachments">
            {attachments.map((file) => (
              <div key={file.id} className="compose-attachment-chip">
                <Icon name="attach_file" size={16} />
                <span className="compose-attachment-name">{file.name}</span>
                <span className="compose-attachment-size">{formatFileSize(file.size)}</span>
                <button
                  type="button"
                  className="compose-attachment-remove"
                  onClick={() => removeAttachment(file.id)}
                  aria-label={`${file.name} dosyasını kaldır`}
                >
                  <Icon name="close" size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <div className="compose-footer">
          <div className="compose-toolbar">
            {FORMAT_ACTIONS.map((action) => (
              <button
                key={action.command}
                type="button"
                className="compose-tool-button"
                title={action.title}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => applyFormat(action.command)}
              >
                <Icon name={action.icon} size={18} />
              </button>
            ))}
            <button
              type="button"
              className="compose-tool-button"
              title="Dosya ekle"
              onClick={handleAttachClick}
            >
              <Icon name="attach_file" size={18} />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="compose-file-input"
            multiple
            onChange={handleFileChange}
          />

          <button type="button" className="compose-send-button" onClick={handleSend}>
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
}
