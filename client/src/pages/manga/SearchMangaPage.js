import { CircularProgress, IconButton } from "@mui/material";
import { BiArrowBack, BiStar } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import BasicSearch from "../../components/search/BasicSearch";
import { useSearchParams } from "react-router-dom";
import mangaApi from "../../api/mangaApi";
import BasicPagination from "../../components/pagination/Pagination";
import SearchResultItem from "../../components/mangaEntity/SearchResultItem";
import useMangaEntityOptions from "../../hooks/useMangaEntityOptions";

const ITEMS_PER_PAGE = 10;

const SearchMangaPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const key = searchParams.get("key");
  const [searchKeyword, setSearchKeyword] = useState(key ?? "");
  const [isLoadingSearchRes, setIsLoadingSearchRes] = useState(false);
  const {
    listManga: searchResult,
    setListManga: setSearchResult,
    selectedMangaEntityUI,
    setSelectedMangaEntityUI,
    renderMangaEntityUI,
    renderMenuOptions,
  } = useMangaEntityOptions();
  // const [searchResult, setSearchResult] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const onSearchCourse = async (value, page = 1) => {
    setIsLoadingSearchRes(true);
    setSearchKeyword(value);
    const res = await mangaApi.searchMangaByKey(value, page, ITEMS_PER_PAGE);
    if (res.success) {
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
      <div className="flex justify-between">
        <div className="flex items-center gap-8">
          <IconButton>
            <BiArrowBack></BiArrowBack>
          </IconButton>
          <h1 className="font-semibold text-3xl">Search </h1>
        </div>
        {renderMenuOptions()}
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
            {renderMangaEntityUI(selectedMangaEntityUI)}
          </BasicPagination>
        )}
      </div>
    </div>
  );
};

export default SearchMangaPage;
