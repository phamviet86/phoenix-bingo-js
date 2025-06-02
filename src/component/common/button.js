// path: @/component/common/button.js

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
