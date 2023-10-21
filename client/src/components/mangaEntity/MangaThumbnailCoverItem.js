import React from "react";
import { PAGE_PATH } from "../../routes/page-path";
import { useNavigate } from "react-router-dom";

const MangaThumbnailCoverItem = ({ manga }) => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="h-80">
        <div
          className="group relative h-80 max-w-full rounded-md overflow-hidden cursor-pointer"
          onClick={() => navigate(PAGE_PATH.MANGA_DETAIL(manga._id))}
        >
          <img
            className="absolute inset-0 w-full h-full object-cover transition-all duration-100 group-hover:scale-105"
            src={manga.thumbUrl}
            alt="thumbnail"
          />
          <div className="mix-blend-normal absolute inset-0 transition-all duration-500 bg-gradient-to-t from-black/30 group-hover:from-black/80 to-transparent h-full w-full">
            <div className="mix-blend-normal absolute transition-all duration-100 bottom-0 group-hover:bottom-2 flex items-end p-2 ">
              <span className="text-white select-none">{manga.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaThumbnailCoverItem;
