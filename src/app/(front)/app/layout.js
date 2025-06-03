"use client";

import dynamic from "next/dynamic";
import { LoadingSpin } from "@/component/common";
import { MENU_CONFIG } from "@/component/config";

const ProLayout = dynamic(
  () => import("@/component/common/pro-layout").then((mod) => mod.ProLayout),
  {
    loading: () => <LoadingSpin />,
    ssr: false,
  }
);

export default function Layout({ children }) {
  return <ProLayout menu={MENU_CONFIG}>{children}</ProLayout>;
}
