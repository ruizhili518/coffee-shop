import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@radix-ui/themes/styles.css';
import {Theme} from "@radix-ui/themes";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eunnikoo Coffee | The unique coffee.",
  description: "Welcome to Eunnikoo Coffee Shop, we are the unique one.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Theme accentColor="brown" grayColor="gray" radius="large">{children}</Theme>
      </body>
    </html>
  );
}
