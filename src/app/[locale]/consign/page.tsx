"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ConsignEntry() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "vi";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const isAuthed = !!storedUser;
    const target = `/${locale}/admin/post-property`;

    if (isAuthed) {
      router.replace(target);
    } else {
      router.replace(`/${locale}/login?redirect=${encodeURIComponent(target)}`);
    }
  }, [router, locale]);

  return (
    <div className="max-w-2xl mx-auto p-6 text-sm text-gray-600">
      Đang kiểm tra tài khoản...
    </div>
  );
}
