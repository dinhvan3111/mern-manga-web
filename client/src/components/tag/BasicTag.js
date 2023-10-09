import React from "react";
import { useSelector } from "react-redux";
import { MANGA_STATUS, ROLE } from "../../common/constants";

const renderMangaStatusColor = (status) => {
  switch (status) {
    case MANGA_STATUS.ON_GOING:
      return "bg-green-500";
    case MANGA_STATUS.ABANDONED:
      return "bg-yellow-500";
    case MANGA_STATUS.COMPLETED:
      return "bg-blue-500";
    default:
      return "";
  }
};
const BasicTag = ({
  label,
  className,
  showStatusDot = false,
  statusDotColor = "bg-green-500",
  mangaStatus,
  ...props
}) => {
  return (
    <div
      className={`flex items-center gap-2 px-2 h-fit text-sm font-semibold bg-gray-50 rounded-md ${className}`}
      {...props}
    >
      {showStatusDot && (
        <div
          className={`w-2 h-2 rounded-full ${renderMangaStatusColor(
            mangaStatus
          )} ${statusDotColor}`}
        ></div>
      )}
      <div>{label}</div>
    </div>
  );
};

export default BasicTag;
