import { CircularProgress, IconButton } from "@mui/material";
import { BiArrowBack, BiStar } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import BasicSearch from "../../components/search/BasicSearch";
import { useNavigate, useSearchParams } from "react-router-dom";
import mangaApi from "../../api/mangaApi";
import { PAGE_PATH } from "../../routes/page-path";
import { RiGroupLine } from "react-icons/ri";
import { dateToTs, getDateDiff } from "../../util/timeHelper";
import { HiOutlineEye } from "react-icons/hi";
import BasicTag from "../../components/tag/BasicTag";
import { mangaStatusToString } from "../../util/stringHelper";
import BasicPagination from "../../components/pagination/Pagination";

const ITEMS_PER_PAGE = 2;

const SearchMangaPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const key = searchParams.get("key");
  const [searchKeyword, setSearchKeyword] = useState(key ?? "");
  const [isLoadingSearchRes, setIsLoadingSearchRes] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const onSearchCourse = async (value, page = 1) => {
    setIsLoadingSearchRes(true);
    setSearchKeyword(value);
    const res = await mangaApi.searchMangaByKey(value, page, ITEMS_PER_PAGE);
    if (res.success) {
      console.log(res);
      setSearchResult(res.data.docs);
      setCurrentPage(res.data.page);
      setTotalPage(res.data.totalPages);
    }
    searchParams.set("key", value);
    setSearchParams(searchParams);
    setIsLoadingSearchRes(false);
  };

  const onFirstSearchCourse = async (value, page = 1) => {
    setIsLoadingSearchRes(true);
    setSearchKeyword(value);
    const res = await mangaApi.searchMangaByKey(value, page, ITEMS_PER_PAGE);
    if (res.success) {
      console.log(res);
      setSearchResult(res.data.docs);
      setCurrentPage(res.data.page);
      setTotalPage(res.data.totalPages);
    }
    setIsLoadingSearchRes(false);
  };
  const handlePageClick = async (event) => {
    const page = event.selected + 1;
    await onSearchCourse(key, page);
  };
  useEffect(() => {
    // If user search by passing key in params
    if (key !== undefined) {
      onFirstSearchCourse(key);
    }
    // onSearchCourse(key);
  }, []);
  return (
    <div className="page-wrapper">
      <div className="flex items-center gap-8">
        <IconButton>
          <BiArrowBack></BiArrowBack>
        </IconButton>
        <h1 className="font-semibold text-3xl">Search </h1>
      </div>
      <div className="mt-8">
        <BasicSearch
          className="!p-2 !bg-gray-100"
          hasAnimation={false}
          showResultDropdown={false}
          keyword={searchKeyword}
          setKeyWord={setSearchKeyword}
          onChange={onSearchCourse}
        ></BasicSearch>
      </div>
      <div className="mt-10 flex flex-col gap-4 pb-9">
        {isLoadingSearchRes ? (
          <div className="flex justify-center">
            <CircularProgress
              style={{
                color: "orange",
              }}
            />
          </div>
        ) : searchResult?.length === 0 ? (
          <div className="bg-gray-100 rounded-full p-2 text-center font-semibold text-gray-500">
            No result found.
          </div>
        ) : (
          <BasicPagination
            handlePageClick={handlePageClick}
            pageCount={totalPage}
            currentPage={currentPage}
          >
            {searchResult.map((manga, index) => (
              <SearchResultItem key={index} manga={manga} />
            ))}
          </BasicPagination>
        )}
      </div>
    </div>
  );
};

const SearchResultItem = ({ manga }) => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-4 w-full bg-gray-100 p-2 rounded-md">
      <div
        className="max-w-[84px] min-w-[84px] h-full cursor-pointer"
        onClick={() => navigate(PAGE_PATH.MANGA_DETAIL(manga?._id))}
      >
        <img className="w-full h-full" src={manga.thumbUrl} alt="img" />
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

export default SearchMangaPage;
