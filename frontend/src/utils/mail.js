import { getDisplayName } from "../services/mailStore.js";

const FOLDER_TITLES = {
  inbox: "Gelen Kutusu",
  sent: "Gönderilen",
  trash: "Çöp Kutusu",
};

export function getFolderTitle(folderId) {
  return FOLDER_TITLES[folderId] || "Gelen Kutusu";
}

export function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || div.innerText || "").trim();
}

export function getMailBodyHtml(mail) {
  const body = mail.body || mail.preview || "";
  if (!body) return "<p></p>";
  if (/<[a-z][\s\S]*>/i.test(body)) return body;
  const escaped = body
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<p>${escaped.replace(/\n/g, "<br>")}</p>`;
}

export function formatMailDate(date = new Date()) {
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

export function createSentMail(draft, user) {
  const plainBody = stripHtml(draft.body).trim();
  const toEmail = draft.to.trim();
  const attachments = draft.attachments || [];
  const attachmentNote =
    attachments.length > 0
      ? ` [${attachments.length} ek: ${attachments.map((file) => file.name).join(", ")}]`
      : "";

  return {
    id: Date.now(),
    from: user.email.toLowerCase(),
    fromName: user.name,
    to: toEmail.toLowerCase(),
    toName: getDisplayName(toEmail),
    subject: draft.subject,
    preview:
      (plainBody.length > 100 ? `${plainBody.slice(0, 100)}...` : plainBody) +
      attachmentNote,
    body: draft.body,
    attachments,
    date: formatMailDate(),
    starred: false,
  };
}

export function filterMails(mails, query) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return mails;

  return mails.filter((mail) =>
    [
      mail.subject,
      mail.preview,
      mail.body,
      mail.fromName,
      mail.from,
      mail.to,
      mail.toName,
      ...(mail.attachments || []).map((file) => file.name),
    ]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(trimmed))
  );
}
