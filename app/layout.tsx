import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zolomon Prints — Fine Art Flower Prints",
  description:
    "Archival fine art prints of original flower scans by Zoey Solomon. Printed and shipped on demand."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container">
            <Link href="/" className="wordmark">
              zolomon prints<span className="dot">.</span>
            </Link>
            <span className="header-tag">archival flower prints, made to order</span>
            <nav className="header-nav">
              <Link href="/">shop</Link>
              <a href="https://zolomon.studio/wedding-flower-preservation.html" className="header-commissions">
                bouquet commissions
              </a>
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="container">
            <span>© {new Date().getFullYear()} Zolomon Prints</span>
            <span>
              <a href="https://zolomon.studio/wedding-flower-preservation.html">
                preserve your wedding bouquet →
              </a>
            </span>
            <span>printed &amp; shipped by Artelo</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
