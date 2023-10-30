import React, { useEffect, useRef, useState } from "react";

import { Checkbox } from "@mui/material";
import { MdDoneAll, MdRemoveDone, MdDeleteOutline } from "react-icons/md";
import { GrAdd, GrEdit } from "react-icons/gr";
const label = { inputProps: { "aria-label": "Checkbox demo" } };
const MultipleImageBox = ({
  name = "upload",
  setSelectedImage = () => {},
  selectedImage = [],
  setPathName = () => {},
  label = null,
  haveLabel = false,
  btnTitle = "Add image",
  ...props
}) => {
  const [checked, setChecked] = useState([]);
  const files = Array.from(selectedImage);
  const onDelete = () => {
    const filter = files.filter((item) => !checked.includes(item));
    setSelectedImage(filter);
    setChecked([]);
  };
  const selectAll = () => {
    if (checked.length < files.length) {
      const filenames = files.map((item) => item);
      setChecked(filenames);
    } else setChecked([]);
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="font-medium text-sm mb-1">
          {checked.length === 0 ? label : `Selected ${checked.length}`}
        </label>
        <div className="flex items-center gap-2">
          {checked.length > 0 && (
            <button
              className="text-white bg-red-500 hover:bg-red-600 text-sm rounded-md px-2 py-1 flex items-center gap-2"
              type="button"
              onClick={onDelete}
            >
              <MdDeleteOutline className="w-5 h-5" /> Delete all
            </button>
          )}
          {files.length > 0 && (
            <button
              type="button"
              className={`text-white ${
                checked.length !== files.length
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-orange-500 hover:bg-orange-600"
              }  text-sm rounded-md px-2 py-1 flex items-center gap-2`}
              onClick={selectAll}
            >
              {checked.length === files.length ? (
                <>
                  <MdRemoveDone className="w-5 h-5" />
                  Unselect all
                </>
              ) : (
                <>
                  <MdDoneAll className="w-5 h-5" />
                  Select all
                </>
              )}
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {files?.length > 0 &&
          files?.map((item, index) => (
            <ImageItem
              key={index}
              item={item}
              index={index}
              checked={checked}
              setChecked={setChecked}
            />
          ))}
        <label
          htmlFor={name}
          className={`w-28 h-28 ${
            files.length > 0 && "ml-10"
          } flex items-center gap-2 justify-center flex-col bg-white rounded-lg border border-dashed border-neutral-400 text-neutral-400 text-sm cursor-pointer`}
        >
          <>
            <GrAdd size={15} /> Add
          </>
        </label>
      </div>
      <input
        id={name}
        className="hidden"
        type="file"
        name={name}
        multiple
        accept="image/*"
        onChange={(event) => {
          const filenames = files.map((item) => item.name);
          const newFiles = Array.from(event.target.files)?.filter(
            (item) => !filenames.includes(item.name)
          );
          setSelectedImage([...selectedImage, ...newFiles]);
          event.target.value = null;
        }}
      />
    </div>
  );
};

const ImageItem = ({ item, index, checked = [], setChecked = () => {} }) => {
  const isFile = File.prototype.isPrototypeOf(item);
  const isChecked = checked.includes(item);
  const handleChange = (e) => {
    if (isChecked) {
      const newArr = checked.filter((img) => img !== item);
      setChecked(newArr);
    } else {
      const newArr = [...checked, item];
      setChecked(newArr);
    }
  };
  const src = isFile ? URL?.createObjectURL(item) : item;
  return (
    <div className="flex items-center gap-2">
      <span className="basis-1/6">{index + 1}.</span>
      <div className="basis-4/6">
        <div className="relative w-28 h-28 bg-white rounded-lg border-2 border-dashed order-neutral-400 p-1">
          <Checkbox
            className="!absolute -top-3 -right-3"
            {...label}
            checked={isChecked}
            onChange={handleChange}
          />
          <img
            alt="not found"
            className="object-contain w-full h-full rounded-lg"
            src={src}
          />
        </div>
      </div>
    </div>
  );
};

export default MultipleImageBox;
