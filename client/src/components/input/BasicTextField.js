import { TextField } from "@mui/material";
import { useController } from "react-hook-form";

const BasicTextFiled = ({
  className = "",
  name = "",
  variant = "outlined",
  defaultValue = "",
  size = "small",
  control,
  helperText = "",
  errMsg = false,
  hasErrors = false,
  wrapperClass = "w-full",
  ...props
}) => {
  const { field } = useController({
    control,
    name,
    defaultValue,
  });

  return (
    <div className={wrapperClass}>
      <TextField
        className={`${className} !border-red-500`}
        variant={variant}
        size={size}
        sx={{
          input: { color: "white" },
          width: "100%",
          "& label.Mui-focused": {
            color: "orange",
          },
          "& .MuiInputBase-root": {
            background: "#3d414a",
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

export default BasicTextFiled;
