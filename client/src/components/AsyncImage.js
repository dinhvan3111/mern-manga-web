import { Skeleton } from "@mui/material";
import React, { useState } from "react";

const AsyncImage = ({
  src = "/images/no_image/no_manga_thumb.png",
  width,
  height,
  skeletonWidth = "100%",
  skeletonHeight = 110,
  size,
  alt,
  imgClassName,
  borderRadius = "4px",
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  return (
    <div
      style={{
        width: width ? width : "100%",
        height: height ? height : "100%",
      }}
      {...props}
    >
      <img
        src={src}
        style={{
          display: loading ? "none" : "block",
          width: "100%",
          animation: "fadeIn 0.5s",
          height: "100%",
          borderRadius: borderRadius,
        }}
        onLoad={(e) => {
          setLoading(false);
        }}
        className={imgClassName}
        alt="img"
      ></img>
      {loading && (
        <Skeleton
          variant="rectangular"
          style={{
            width: skeletonWidth ? skeletonWidth : "100%",
            borderRadius: borderRadius,
          }}
          height={skeletonHeight}
        ></Skeleton>
      )}
    </div>
  );
};

export default AsyncImage;
