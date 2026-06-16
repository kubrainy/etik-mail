import { USERS } from "../data/users.js";

const STORAGE_KEY = "etik-mail-messages";

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function readMails() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeMails(mails) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mails));
}

export function getDisplayName(email) {
  const normalized = normalizeEmail(email);
  const user = USERS.find((item) => item.email === normalized);
  return user?.name || email;
}

export function getAllMails() {
  return readMails();
}

export function addMail(mail) {
  const mails = readMails();
  mails.unshift(mail);
  writeMails(mails);
  return mail;
}

export function getInboxMails(userEmail) {
  const normalized = normalizeEmail(userEmail);
  return readMails().filter((mail) => normalizeEmail(mail.to) === normalized);
}

export function getSentMails(userEmail) {
  const normalized = normalizeEmail(userEmail);
  return readMails().filter((mail) => normalizeEmail(mail.from) === normalized);
}
