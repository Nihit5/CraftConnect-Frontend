import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getFileApiUrl } from "../utils/fileImage";

function AuthenticatedImage({
  imagePath,
  alt = "",
  className = "",
  fallback = null,
}) {
  const { token } = useAuth();
  const [src, setSrc] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fileUrl = getFileApiUrl(imagePath);
    if (!fileUrl) {
      setSrc(null);
      setHasError(true);
      return undefined;
    }

    let objectUrl;
    let cancelled = false;

    (async () => {
      try {
        setHasError(false);
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await fetch(fileUrl, { headers });

        if (!response.ok) {
          throw new Error(`Image fetch failed (${response.status})`);
        }

        const blob = await response.blob();
        if (cancelled) return;

        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      } catch {
        if (!cancelled) {
          setSrc(null);
          setHasError(true);
        }
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imagePath, token]);

  if (hasError || !src) {
    return fallback;
  }

  return <img src={src} alt={alt} className={className} />;
}

export default AuthenticatedImage;
