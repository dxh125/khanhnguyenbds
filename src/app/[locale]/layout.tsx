import "../globals.css";
import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl"; // ✅ từ next-intl gốc
import { getMessages } from "next-intl/server";     // ✅ từ next-intl/server
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";


export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages({ locale: params.locale }).catch(() => null);

  if (!messages) {
    notFound();
  }

  return (
    <html lang={params.locale}>
      <body className="min-h-screen flex flex-col bg-gray-100">
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
