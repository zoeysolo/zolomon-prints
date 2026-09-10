// ---------------------------------------------------------------------------
// Custom next/image loader for the Google Drive-hosted scans.
//
// Points the generated srcset straight at Google's image CDN (lh3), which
// already serves WebP/AVIF via content negotiation and resizes on the =w
// parameter. This gives right-sized, modern-format images and a responsive
// srcset WITHOUT invoking Vercel's image optimizer — so no added Vercel
// image-optimization cost. Accepts either a full galleryImage() URL or a bare
// Drive file id as `src`.
// ---------------------------------------------------------------------------
interface DriveLoaderArgs {
  src: string;
  width: number;
  quality?: number;
}

export default function driveLoader({ src, width }: DriveLoaderArgs): string {
  const match = src.match(/\/d\/([^=/?]+)/);
  if (match) {
    return `https://lh3.googleusercontent.com/d/${match[1]}=w${width}`;
  }
  // Unrecognised absolute URL: leave it untouched.
  if (src.startsWith("http")) return src;
  // Otherwise treat src as a bare Drive file id.
  return `https://lh3.googleusercontent.com/d/${src}=w${width}`;
}
