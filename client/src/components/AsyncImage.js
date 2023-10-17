import { Skeleton } from "@mui/material";
import React, { useState } from "react";

const AsyncImage = ({
  src,
  width,
  height,
  skeletonWidth = "100%",
  skeletonHeight = 110,
  size,
  alt,
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
