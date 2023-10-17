import { CircularProgress, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import mangaApi from "../../api/mangaApi";
import SearchResultItem from "../../components/mangaEntity/SearchResultItem";
import BasicPagination from "../../components/pagination/Pagination";

const LibraryPage = () => {
  const [listManga, setListManga] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [totalItems, setTotalItems] = useState();
  const fetchListMangaInLib = async (page, limit) => {
    setIsLoading(true);
    const res = await mangaApi.getListMangaInLib(page, limit);
    console.log(res);
    if (res.success) {
      setListManga(res.data.docs);
      setCurrentPage(res.data.page);
      setTotalPage(res.data.totalPages);
      setTotalItems(res.data.totalDocs);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchListMangaInLib(1, 10);
  }, []);
  const handlePageClick = async (event) => {
    const page = event.selected + 1;
    await fetchListMangaInLib(page);
  };
  return (
    <div className="page-wrapper">
      <div className="flex gap-4 items-center">
        <IconButton>
          <IoArrowBack />
        </IconButton>
        <span className="font-semibold text-2xl">Library</span>
      </div>
      {isLoading ? (
        <div className="mt-20 w-full flex items-center justify-center">
          <CircularProgress style={{ color: "black" }}></CircularProgress>
        </div>
      ) : (
        <div className="mt-4 pb-20">
          <span className="text-lg">
            {totalItems > 0
              ? `${totalItems} ${totalItems > 1 ? "titles" : "title"}`
              : "No titles"}
          </span>
          <div className="mt-4 w-full">
            {listManga?.length > 0 ? (
              <BasicPagination
                handlePageClick={handlePageClick}
                pageCount={totalPage}
                currentPage={currentPage}
              >
                <div className="flex flex-col gap-4">
                  {listManga?.map((favourite, index) => (
                    <SearchResultItem key={index} manga={favourite.manga} />
                  ))}
                </div>
              </BasicPagination>
            ) : (
              <div className="bg-gray-100 py-8 text-lg w-full flex justify-center items-center rounded-md">
                No titles
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
