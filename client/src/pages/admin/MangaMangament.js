import React, { useEffect, useState } from "react";
import mangaApi from "../../api/mangaApi";
import { useNavigate } from "react-router-dom";
import { PAGE_PATH } from "../../routes/page-path";
import { HiOutlineEye } from "react-icons/hi";
import { BiStar } from "react-icons/bi";
import BasicTag from "../../components/tag/BasicTag";
import { mangaStatusToString } from "../../util/stringHelper";
import { AiFillDelete, AiFillEdit, AiFillFileAdd } from "react-icons/ai";
import { CircularProgress, IconButton } from "@mui/material";
import BasicPagination from "../../components/pagination/Pagination";
import BasicButton from "../../components/button/BasicButton";

const ITEMS_PER_PAGE = 2;

const MangaMangament = () => {
  const navigate = useNavigate();
  const [mangaList, setMangaList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const fetchMangaList = async (page = 1) => {
    setIsLoading(true);
    const res = await mangaApi.getAllMangas(page, ITEMS_PER_PAGE);
    if (res.success) {
      console.log(res.data.docs);
      setMangaList(res.data.docs);
      setCurrentPage(res.data.page);
      setTotalPage(res.data.totalPages);
    }
    setIsLoading(false);
  };
  const handlePageClick = async (event) => {
    const page = event.selected + 1;
    await fetchMangaList(page);
  };
  useEffect(() => {
    fetchMangaList(1);
  }, []);
  return (
    <div className="page-wrapper">
      <div className="flex justify-between">
        <h1 className="font-bold text-4xl">Manga Mangament</h1>
        <BasicButton
          className="!w-fit"
          onClick={() => navigate(PAGE_PATH.ADD_MANGA)}
          icon={<AiFillFileAdd />}
        >
          Add manga
        </BasicButton>
      </div>
      <div className="mt-10 flex flex-col  gap-4 pb-10">
        <BasicPagination
          handlePageClick={handlePageClick}
          pageCount={totalPage}
          currentPage={currentPage}
        >
          {isLoading ? (
            <div className="mb-10 flex justify-center items-center">
              <CircularProgress
                style={{
                  color: "orange",
                }}
              />
            </div>
          ) : (
            mangaList.map((manga) => (
              <MangaManageItem manga={manga}></MangaManageItem>
            ))
          )}
        </BasicPagination>
      </div>
    </div>
  );
};

const MangaManageItem = ({ manga }) => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-4 w-full bg-gray-100 p-2 rounded-md">
      <div
        className="max-w-[84px] min-w-[84px] h-full cursor-pointer"
        onClick={() => navigate(PAGE_PATH.MANGA_DETAIL(manga?._id))}
      >
        <img className="w-full h-full" src={manga.thumbUrl} alt="img" />
      </div>
      <div className="flex justify-between gap-2 w-full">
        <div
          className="flex flex-col flex-1 gap-2 cursor-pointer"
          onClick={() => navigate(PAGE_PATH.MANGA_DETAIL(manga?._id))}
        >
          <div className="flex justify-between">
            <h4 className="text-lg break-all font-bold line-clamp-1 text-ellipsis">
              {manga.name}
            </h4>
          </div>
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
        <div className="flex flex-1 items-center justify-end">
          <IconButton>
            <AiFillEdit color="green" />
          </IconButton>
          <IconButton>
            <AiFillDelete color="red" />
          </IconButton>
          {/* <IconButton>
            <AiFillEdit color="green" />
          </IconButton> */}
        </div>
      </div>
    </div>
  );
};

export default MangaMangament;
