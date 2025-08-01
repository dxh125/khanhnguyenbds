import "../globals.css";
import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl"; 
import { getMessages } from "next-intl/server";     
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";

interface Props {
  children: ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout(props: Props) {
  // ✅ Giải cấu trúc rõ ràng trong hàm async
  const { children, params } = props;

  // ✅ Chỉ xử lý params sau khi có thể await
  const messages = await getMessages({ locale: params.locale }).catch(() => null);

  if (!messages) notFound();

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