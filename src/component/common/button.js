// path: @/component/common/button.js

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button as AntButton } from "antd";

export function Button({
  label,
  color = "primary",
  variant = "solid",
  ...props
}) {
  return (
    <AntButton {...props} color={color} variant={variant}>
      {label}
    </AntButton>
  );
}

export function DetailButton({ id, ...props }) {
  const pathname = usePathname();

  return (
    <Link href={`${pathname}/${id}`}>
      <Button {...props} />
    </Link>
  );
}
