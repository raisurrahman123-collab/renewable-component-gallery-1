import type { Metadata } from "next";
import Link from "next/link";
import { site } from "./site";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: site.title, template: `%s | ${site.title}` },
  description: `UI components built by ${site.owner}.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&display=swap"
        />
      </head>
      <body className="font-sans text-[1.0625rem] leading-relaxed antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-paper">
          Skip to content
        </a>
        <header className="mx-auto flex max-w-6xl items-baseline justify-between gap-4 px-5 py-5 sm:px-8">
          <Link href="/" className="font-extrabold no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leaf">
            {site.owner}
          </Link>
          <a href={site.github} className="text-[0.95rem] text-muted underline-offset-4 hover:text-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leaf">
            Source on GitHub
          </a>
        </header>
        <main id="main" className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">{children}</main>
      </body>
    </html>
  );
}
