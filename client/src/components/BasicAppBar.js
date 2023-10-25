import { IconButton } from "@mui/material";
import { BiMenuAltLeft, BiStar } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { PAGE_PATH } from "../routes/page-path";
import BasicSearch from "./search/BasicSearch";
import UserProfile from "./UserProfile";
import { useEffect, useRef, useState } from "react";
import mangaApi from "../api/mangaApi";
import BasicTag from "./tag/BasicTag";
import { mangaStatusToString } from "../util/stringHelper";
import { HiOutlineEye } from "react-icons/hi";
import AsyncImage from "./AsyncImage";

const BasicAppBar = ({
  leftDrawerOpen,
  textColor,
  accordionIconColor,
  onOpenLeftDrawer = () => {},
  ...props
}) => {
  const navigate = useNavigate();
  const [top, setTop] = useState(true);
  const searchRef = useRef(null);
  const [isLoadingSearchRes, setIsLoadingSearchRes] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResult, setSearchResult] = useState();
  const onSearchCourse = async (value) => {
    setIsLoadingSearchRes(true);
    setSearchKeyword(value);
    const res = await mangaApi.searchMangaByKey(value);
    if (res.success) {
      setSearchResult(res.data.docs);
    }
    console.log(res);
    setIsLoadingSearchRes(false);
  };
  const handleKeyDownSearch = (event) => {
    if (event.key === "Enter") {
      // 👇️ your logic here
      searchRef.current.blur();
      navigate(`${PAGE_PATH.SEARCH_MANGA(encodeURIComponent(searchKeyword))}`);
    }
  };
  const onSearchItemClick = (item) => {
    if (!item) return;
    navigate(`/manga/${item?._id}`);
  };
  const handleOnClickSearchWithKeyItem = () => {
    searchRef.current.blur();
    navigate(`${PAGE_PATH.SEARCH_MANGA(encodeURIComponent(searchKeyword))}`);
  };

  const dropdownSearchItemBuilder = (item) => {
    return (
      <div
        className="px-4 py-2 flex gap-4 justify-start items-center cursor-pointer bg-gray-100 hover:bg-gray-200"
        onClick={() => onSearchItemClick(item)}
      >
        <div className="shadow-lg w-16 h-full">
          <AsyncImage src={item?.thumbUrl} alt="courseThumb" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-bold">{item.name}</span>
          <div className="flex gap-4 items-center">
            <div className="flex gap-1 items-center">
              <BiStar size={17} color="orange" />
              <span className=" text-sm text-orange-500">
                {parseFloat(item?.rating).toFixed(1)}
              </span>
            </div>
            <div className="flex gap-1 items-center">
              <HiOutlineEye size={17} />
              <span className="text-sm">{item?.views}</span>
            </div>
          </div>
          <BasicTag
            className="w-fit"
            showStatusDot={true}
            mangaStatus={item?.status}
            label={mangaStatusToString(item?.status)}
          ></BasicTag>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const scrollHandler = () => {
      window.scrollY > 10 ? setTop(false) : setTop(true);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);
  return (
    <div
      className={`transition-all sticky top-0 z-50 ${
        !top && `bg-white border-b-2 border-orange-500 shadow-md`
      }`}
    >
      <div className="appbar-wrapper flex justify-between items-center">
        <div className={`${leftDrawerOpen ? "invisible" : ""} flex gap-4`}>
          <IconButton onClick={() => onOpenLeftDrawer()}>
            <BiMenuAltLeft color={!top ? "" : accordionIconColor} />
          </IconButton>
          <div
            className={`text-2xl font-bold hover:cursor-pointer no-select ${
              !top ? "" : `text-black sm:${textColor}`
            } `}
            onClick={() => navigate(PAGE_PATH.HOME)}
          >
            VzManga
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <BasicSearch
            searchRef={searchRef}
            onChange={onSearchCourse}
            title="Search"
            showResultDropdown={true}
            itemBuilder={dropdownSearchItemBuilder}
            keyword={searchKeyword}
            setKeyWord={setSearchKeyword}
            handleOnClickSearchResultItem={handleOnClickSearchWithKeyItem}
            handleKeyDown={handleKeyDownSearch}
            isLoading={isLoadingSearchRes}
            dropdownData={searchResult}
          />
          <UserProfile />
        </div>
      </div>
    </div>
  );
};

export default BasicAppBar;
