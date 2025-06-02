"use client";

import { ProCard } from "@ant-design/pro-components";
import { PageContainer } from "@/component/common";

export default function Page() {
  return (
    <PageContainer items={[{ title: "Home", path: "/app" }]} title="Home Page">
      <ProCard split="vertical" boxShadow>
        <ProCard title="Left Card" colSpan="50%">
          This is the left card.
        </ProCard>
        <ProCard title="Right Card" colSpan="50%">
          This is the right card.
        </ProCard>
      </ProCard>
    </PageContainer>
  );
}
