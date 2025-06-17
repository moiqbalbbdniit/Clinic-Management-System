// app/print/layout.tsx
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
// IMPORTANT: Remove or comment out the import for globals.css
// import "../globals.css"; // <-- This line should be removed or commented out

// Import your print-specific CSS file
import "./print.css";

const inter = Inter({ subsets: ["latin"] });

export default function PrintLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Add any print-specific meta tags if necessary */}
      </head>
      <body className={inter.className}>
        {/*
          The children prop will render the content from print/[id]/page.tsx.
          By using this dedicated layout and removing the global CSS import,
          you ensure that only the content intended for printing is present
          in the DOM when window.print() is called for this route.
        */}
        {children}
      </body>
    </html>
  );
}
