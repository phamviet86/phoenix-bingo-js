"use client";

import { ConfigProvider } from "@/component/common";

export default function ClientLayout({ children }) {
  return <ConfigProvider>{children}</ConfigProvider>;
}
