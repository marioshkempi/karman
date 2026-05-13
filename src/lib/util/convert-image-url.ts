export const convertImageUrl = (url: string) => {
  if (!url) return url;

  // Extract key after the S3 domain
  const match = url.match(/amazonaws\.com\/(.+)$/);

  if (!match || !match[1]) {
    return url; // fallback
  }

  return `/api/media/${match[1]}`;
};
