import { LoadingButton } from "@mui/lab";
import React from "react";

export const BUTTON_TYPE = {
  CLASSIC: 1,
  NO_COLOR: 2,
};

const BasicButton = ({
  children,
  variant = "contained",
  color = "bg-orange-500",
  icon,
  onClick,
  sx,
  disabled = false,
  className = "",
  disableStyle = "",
  loading = false,
  buttonType = BUTTON_TYPE.CLASSIC,
  ...props
}) => {
  const buttonStyle = (type) => {
    switch (type) {
      case BUTTON_TYPE.CLASSIC:
        return `text-white  !bg-orange-500 hover:!bg-orange-600`;
      case BUTTON_TYPE.NO_COLOR:
        return `basic-hover !shadow-none !bg-gray-100 !text-gray-600`;
      default:
        return ``;
    }
  };
  return (
    <LoadingButton
      disableRipple={buttonType !== BUTTON_TYPE.CLASSIC}
      variant={variant}
      startIcon={icon}
      onClick={onClick}
      sx={[...(Array.isArray(sx) ? sx : [sx])]}
      className={`!normal-case text-base !font-bold w-full ${
        !disabled && buttonStyle(buttonType)
      }  ${!disabled && color} ${className} ${disabled && disableStyle}`}
      disabled={disabled}
      loading={loading}
      {...props}
    >
      {!loading ? children : <div className="invisible">{children}</div>}
    </LoadingButton>
  );
};

export default BasicButton;
