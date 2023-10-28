import { TextField } from "@mui/material";
import { useController } from "react-hook-form";

export const TextFieldType = {
  DARK: 1,
  LIGHT: 2,
};

const BasicTextField = ({
  className = "",
  name = "",
  variant = "outlined",
  defaultValue = "",
  size = "small",
  control = null,
  helperText = "",
  errMsg = false,
  hasErrors = false,
  wrapperClass = "w-full",
  textfieldType = TextFieldType.LIGHT,
  ...props
}) => {
  const { field } = useController(
    control
      ? {
          control,
          name,
          defaultValue,
        }
      : {}
  );

  return (
    <div className={wrapperClass}>
      <TextField
        className={`${className} !border-red-500`}
        variant={variant}
        size={size}
        minRows={props.multiline ? 3 : null}
        maxRows={props.multiline ? 10 : null}
        sx={{
          input: {
            color: textfieldType === TextFieldType.DARK ? "white" : "black",
          },
          width: "100%",
          "& label.Mui-focused": {
            color: "orange",
          },
          "& .MuiInputBase-root": {
            background: textfieldType === TextFieldType.DARK ? "#3d414a" : "",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "",
            },
            "&:hover fieldset": {
              borderColor: "orange",
            },
            "&.Mui-focused fieldset": {
              borderColor: "orange",
            },
          },
        }}
        id={name}
        helperText={helperText}
        error={!!errMsg}
        {...props}
        {...field}
      />
      {hasErrors && errMsg && (
        <p className="mt-2 text-red-500 text-sm font-medium">{errMsg}</p>
      )}
    </div>
  );
};

export default BasicTextField;
