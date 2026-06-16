const TRASH_KEY = "etik-mail-trash";

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function readTrash() {
  try {
    const raw = localStorage.getItem(TRASH_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeTrash(items) {
  localStorage.setItem(TRASH_KEY, JSON.stringify(items));
}

export function moveToTrash(userEmail, mail, sourceFolder) {
  const normalized = normalizeEmail(userEmail);
  const items = readTrash();

  const exists = items.some(
    (item) =>
      item.userEmail === normalized &&
      item.mailId === mail.id &&
      item.sourceFolder === sourceFolder
  );

  if (exists) return;

  items.unshift({
    id: `trash-${Date.now()}-${mail.id}`,
    userEmail: normalized,
    mailId: mail.id,
    sourceFolder,
    mail: { ...mail },
    trashedAt: Date.now(),
  });

  writeTrash(items);
}

export function getTrashMails(userEmail) {
  const normalized = normalizeEmail(userEmail);
  return readTrash()
    .filter((item) => item.userEmail === normalized)
    .map((item) => item.mail);
}

export function isMailTrashed(userEmail, mailId, sourceFolder) {
  const normalized = normalizeEmail(userEmail);
  return readTrash().some(
    (item) =>
      item.userEmail === normalized &&
      item.mailId === mailId &&
      item.sourceFolder === sourceFolder
  );
}

export function filterTrashedMails(userEmail, mails, sourceFolder) {
  return mails.filter(
    (mail) => !isMailTrashed(userEmail, mail.id, sourceFolder)
  );
}

export function deleteFromTrash(userEmail, mailId) {
  const normalized = normalizeEmail(userEmail);
  const items = readTrash().filter(
    (item) => !(item.userEmail === normalized && item.mailId === mailId)
  );
  writeTrash(items);
}
