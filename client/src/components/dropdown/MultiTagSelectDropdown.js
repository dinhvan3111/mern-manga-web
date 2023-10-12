import {
  Checkbox,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import React from "react";
import { useController } from "react-hook-form";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      // width: 250,
    },
  },
};

const MultiTagSelectDropdown = ({
  name,
  defaultValue,
  control,
  items,
  selectedItems,
  handleChange,
  renderValue = () => {},
  menuItem,
}) => {
  const { field } = useController({
    control,
    name,
    defaultValue,
  });
  return (
    <Select
      className="w-full"
      multiple
      value={selectedItems}
      onChange={handleChange}
      input={<OutlinedInput />}
      sx={{
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "orange",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "orange",
        },
      }}
      renderValue={renderValue}
      MenuProps={MenuProps}
    >
      {items.map((item) => menuItem(item))}
    </Select>
  );
};

export default MultiTagSelectDropdown;
