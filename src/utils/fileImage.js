const FILE_API_BASE = "/api/v1/file";

export function resolveFileName(imagePath) {
  if (!imagePath) return null;

  const trimmed = String(imagePath).trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    const fromUrl = trimmed.split("/").pop()?.split("?")[0];
    return fromUrl || null;
  }

  return trimmed.split(/[/\\]/).pop() || null;
}

export function getFileApiUrl(imagePath) {
  const fileName = resolveFileName(imagePath);
  return fileName
    ? `${FILE_API_BASE}/${encodeURIComponent(fileName)}`
    : null;
}
