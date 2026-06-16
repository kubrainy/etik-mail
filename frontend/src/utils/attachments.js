export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function readFileAsAttachment(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        dataUrl: reader.result,
      });
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function downloadAttachment(file) {
  if (!file?.dataUrl) {
    alert("Bu ek dosyası indirilebilir biçimde kaydedilmemiş.");
    return;
  }

  const link = document.createElement("a");
  link.href = file.dataUrl;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
