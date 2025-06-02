import { AntdRegistry } from "@ant-design/nextjs-registry";
import "antd/dist/reset.css";

export const metadata = {
  title: "Bingo English",
  description: "Bingo learning management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
