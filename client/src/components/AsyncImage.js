import { Skeleton } from "@mui/material";
import React, { useState } from "react";

const AsyncImage = ({
  src,
  width,
  height,
  skeletonWidth = "100%",
  skeletonHeight = "100%",
  size,
  alt,
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
        }}
        onLoad={(e) => {
          setLoading(false);
        }}
        alt="img"
      ></img>
      {loading && (
        <Skeleton
          style={{
            width: skeletonWidth ? skeletonWidth : "100%",
            height: skeletonHeight ? skeletonHeight : "100%",
          }}
        ></Skeleton>
      )}
    </div>
  );
};

export default AsyncImage;
