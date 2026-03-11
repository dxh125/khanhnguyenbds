// src/app/[locale]/account/saved-searches/page.tsx
import SavedSearchList from "@/components/search/SavedSearchList";

export default function Page({ params }: { params: { locale: string } }) {
  return <SavedSearchList locale={params.locale} />;
}
