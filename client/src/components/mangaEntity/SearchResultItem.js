import { useNavigate } from "react-router-dom";
import { PAGE_PATH } from "../../routes/page-path";
import { HiOutlineEye } from "react-icons/hi";
import { BiStar } from "react-icons/bi";
import BasicTag from "../tag/BasicTag";
import { mangaStatusToString } from "../../util/stringHelper";
import AsyncImage from "../AsyncImage";

const SearchResultItem = ({ manga }) => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-4 w-full bg-gray-100 p-2 rounded-md">
      <div
        className="max-w-[84px] min-w-[84px] h-full cursor-pointer"
        onClick={() => navigate(PAGE_PATH.MANGA_DETAIL(manga?._id))}
      >
        <AsyncImage src={manga.thumbUrl} alt="img" />
      </div>
      <div className="flex flex-col gap-2 grow w-full">
        <div
          className="flex flex-col gap-2 cursor-pointer"
          onClick={() => navigate(PAGE_PATH.MANGA_DETAIL(manga?._id))}
        >
          <div className="flex justify-between">
            <h4 className="text-lg break-all font-bold line-clamp-1 text-ellipsis">
              {manga.name}
            </h4>
            <div className="flex items-center gap-4">
              <div className="flex gap-1 items-center">
                <BiStar />
                <span className="text-base ">
                  {parseFloat(manga?.rating).toFixed(1)}
                </span>
              </div>
              <div className="flex gap-1 items-center">
                <HiOutlineEye />
                <span className="text-base">{manga?.views}</span>
              </div>
              <BasicTag
                className="w-fit !bg-gray-200 font-medium"
                showStatusDot={true}
                mangaStatus={manga?.status}
                label={mangaStatusToString(manga?.status)}
              ></BasicTag>
            </div>
          </div>
          <div className="flex gap-2">
            {manga?.genres.map((genre, index) => (
              <BasicTag
                key={index}
                className="!font-semibold text-gray-700 !bg-gray-200 text-base"
                label={genre.name}
              ></BasicTag>
            ))}
          </div>
          <p className="text-base break-all line-clamp-2 text-ellipsis">
            {manga.description}
          </p>
        </div>
        {/* <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <RiGroupLine size={15} />
        <h4 className="p-1 text-sm line-clamp-1 text-ellipsis basic-hover">
          {manga.authors.length > 0
            ? manga.authors.join(",")
            : "Unknown"}
        </h4>
      </div>
      <h4 className="text-sm">
        {getDateDiff(dateToTs(manga.latestUpdate))}
      </h4>
    </div> */}
      </div>
    </div>
  );
};

export default SearchResultItem;
