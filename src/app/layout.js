import { Inter } from "next/font/google";
import "./globals.css";
import SparklesIcon from "@/components/SparklesIcon";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Captionator",
  description: "AI-powered caption generator.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-gradient-to-b from-purple-700 to-blue-500 min-h-screen text-white"}>
        <main className="p-4 max-w-3xl mx-auto">
          <header className="my-8">
            <a href="/" className="flex gap-1">
              <SparklesIcon />
              Captionator
            </a>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
