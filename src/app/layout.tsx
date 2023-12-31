import clsx from "clsx";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "~/styles/globals.css";
import { Header } from "./_components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full w-full">
      <body
        className={clsx(
          inter.className,
          "flex w-full h-full flex-col bg-neutral-900 text-white",
        )}
      >
        <Header />
        <div className="flex-grow overflow-hidden w-full">{children}</div>
      </body>
    </html>
  );
}
