// app/[locale]/layout.tsx
import "../globals.css";
import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";

type LayoutParams = { locale: string };

interface Props {
  children: ReactNode;
  params: Promise<LayoutParams>; // 👈 Next 15: Promise
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params; // 👈 must await

  const messages = await getMessages({ locale }).catch(() => null);
  if (!messages) notFound();

  return (
    <html lang={locale}>
      <body className="min-h-screen flex flex-col bg-gray-100">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
