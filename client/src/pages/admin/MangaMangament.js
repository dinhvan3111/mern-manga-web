import React, { useEffect, useState } from "react";
import mangaApi from "../../api/mangaApi";
import { useNavigate } from "react-router-dom";
import { PAGE_PATH } from "../../routes/page-path";
import { HiOutlineEye } from "react-icons/hi";
import { BiStar } from "react-icons/bi";
import BasicTag from "../../components/tag/BasicTag";
import { mangaStatusToString } from "../../util/stringHelper";
import { AiFillDelete, AiFillEdit, AiFillFileAdd } from "react-icons/ai";
import { GrChapterAdd } from "react-icons/gr";
import { CircularProgress, IconButton } from "@mui/material";
import BasicPagination from "../../components/pagination/Pagination";
import BasicButton from "../../components/button/BasicButton";
import { SUBMIT_STATUS } from "../../common/constants";
import usePopup from "../../hooks/usePopup";
import PopupMsg from "../../components/popup/PopupMessage";
import ConfirmPopup from "../../components/popup/ConfirmPopup";
import AsyncImage from "../../components/AsyncImage";
import { useQuery } from "react-query";
import QUERY_KEY from "../../common/queryKey";

const ITEMS_PER_PAGE = 10;

const MangaMangament = () => {
  const navigate = useNavigate();
  const [mangaQueries, setMangaQueries] = useState({
    currentPage: 1,
    pageSize: ITEMS_PER_PAGE,
  });
  const { data: mangaList, isLoading } = useQuery({
    queryKey: [QUERY_KEY.MANGA_MANAGEMENT, mangaQueries],
    queryFn: () =>
      fetchMangaList(mangaQueries.currentPage, mangaQueries.pageSize),
  });
  const [totalPage, setTotalPage] = useState();
  const fetchMangaList = async (page = 1) => {
    const res = await mangaApi.getAllMangas(page, ITEMS_PER_PAGE, {});
    if (res.success) {
      setTotalPage(res.data.totalPages);
      return res.data.docs;
    }
    return [];
  };
  const handlePageClick = async (event) => {
    const page = event.selected + 1;
    setMangaQueries({ ...mangaQueries, currentPage: page });
  };
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
          currentPage={mangaQueries.currentPage}
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
            mangaList.map((manga, index) => (
              <MangaManageItem key={index} manga={manga}></MangaManageItem>
            ))
          )}
        </BasicPagination>
      </div>
    </div>
  );
};

const MangaManageItem = ({ manga, onHasChangeMangaList = () => {} }) => {
  const [deleteStatus, setDeleteStatus] = useState();
  const [popupMsg, setPopupMsg] = useState("");
  const navigate = useNavigate();
  const {
    open: openConfirm,
    handleOpenPopup: handleOpenConfirmPopup,
    handleClosePopup: handleCloseConfirmPopup,
  } = usePopup();
  const {
    open: openStatus,
    handleOpenPopup: handleOpenStatusPopup,
    handleClosePopup: handleCloseStatusPopup,
  } = usePopup();
  const onDeleteManga = async () => {
    handleCloseConfirmPopup();
    setDeleteStatus(SUBMIT_STATUS.LOADING);
    handleOpenStatusPopup();
    const res = await mangaApi.deleteManga(manga?._id);
    if (res.success) {
      setDeleteStatus(SUBMIT_STATUS.SUCCESS);
      setPopupMsg("Delete manga successful");
      onHasChangeMangaList();
      return;
    }
    setDeleteStatus(SUBMIT_STATUS.FAILED);
    setPopupMsg("Delete manga successful");
  };
  return (
    <>
      <div className="flex gap-4 w-full h-fit bg-gray-100 p-2 rounded-md">
        <div
          className="max-w-[84px] min-w-[84px] h-full cursor-pointer"
          onClick={() => navigate(PAGE_PATH.MANGA_DETAIL(manga?._id))}
        >
          <AsyncImage src={manga?.thumbUrl} alt="img" />
        </div>
        <div className="flex justify-between gap-2 w-full">
          <div
            className="flex flex-col flex-1 gap-2 cursor-pointer"
            onClick={() => navigate(PAGE_PATH.MANGA_DETAIL(manga?._id))}
          >
            <div className="flex justify-between">
              <h4 className="text-lg break-all font-bold line-clamp-1 text-ellipsis">
                {manga?.name}
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
            <div className="flex flex-wrap gap-2">
              {manga?.genres.map((genre, index) => (
                <BasicTag
                  key={index}
                  className="!font-semibold text-gray-700 !bg-gray-200 text-base"
                  label={genre.name}
                ></BasicTag>
              ))}
            </div>
            <p className="text-base break-all line-clamp-2 text-ellipsis">
              {manga?.description}
            </p>
          </div>
          <div className="flex flex-1 items-center justify-end">
            <IconButton
              onClick={() => navigate(PAGE_PATH.EDIT_MANGA(manga._id))}
            >
              <AiFillEdit color="green" />
            </IconButton>
            <IconButton
              onClick={() => navigate(PAGE_PATH.CHAPTERS_MANAGEMENT(manga._id))}
            >
              <GrChapterAdd color="gray" />
            </IconButton>
            <IconButton onClick={handleOpenConfirmPopup}>
              <AiFillDelete color="red" />
            </IconButton>
            {/* <IconButton>
            <AiFillEdit color="green" />
          </IconButton> */}
          </div>
        </div>
      </div>
      <ConfirmPopup
        isOpen={openConfirm}
        handleConfirm={onDeleteManga}
        handleReject={handleCloseConfirmPopup}
      >
        <div>
          Do you want to delete
          <span className="font-semibold text-orange-500">
            {" "}
            {manga?.name}
          </span>{" "}
          ?
        </div>
      </ConfirmPopup>
      <PopupMsg
        isOpen={openStatus}
        handleClosePopup={handleCloseStatusPopup}
        status={deleteStatus}
        hasOk={true}
      >
        {popupMsg}
      </PopupMsg>
    </>
  );
};

export default MangaMangament;
