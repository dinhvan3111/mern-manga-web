import React from "react";
import { useSelector } from "react-redux";
import { ROLE } from "../../common/constants";

const BasicTag = ({ label, className, ...props }) => {
  return (
    <div
      className={`px-2 h-fit text-sm font-semibold bg-gray-50 rounded-md ${className}`}
      {...props}
    >
      {label}
    </div>
  );
};

export default BasicTag;
