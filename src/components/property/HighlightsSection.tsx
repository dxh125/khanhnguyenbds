"use client";

import { useTranslations } from "next-intl";
import { CheckCircle } from "lucide-react";

interface HighlightsSectionProps {
  highlights?: string[];
}

export default function HighlightsSection({ highlights }: HighlightsSectionProps) {
  const t = useTranslations("Property");

  if (!highlights || highlights.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-4">{t("highlightsTitle")}</h2>
      <ul className="space-y-2">
        {highlights.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-gray-800 text-sm">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
