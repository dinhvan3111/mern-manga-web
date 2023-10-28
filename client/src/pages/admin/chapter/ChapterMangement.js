import React, { useEffect, useState } from "react";
import BasicButton from "../../../components/button/BasicButton";
import { useNavigate, useParams } from "react-router-dom";
import { AiFillFileAdd } from "react-icons/ai";
import { CircularProgress, IconButton } from "@mui/material";
import { BiArrowBack } from "react-icons/bi";
import chapterApi from "../../../api/chapterApi";
import usePopup from "../../../hooks/usePopup";
import ChapterAccordion from "./ChapterAccordion";
import AddChapterModal from "./AddChapterModal";
import { useQuery } from "react-query";
import QUERY_KEY from "../../../common/queryKey";

const ITEMS_PER_PAGE = 10;

const ChapterMangement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { open, handleOpenPopup, handleClosePopup } = usePopup();
  const [chaptersQueries, setChapterQueries] = useState({
    mangaId: id,
    currentPage: 1,
    pageSize: ITEMS_PER_PAGE,
  });
  const [totalPage, setTotalPage] = useState();
  const fetchChapters = async (id, page = 1, limit = ITEMS_PER_PAGE) => {
    const res = await chapterApi.getAllChapters(id, page, limit);
    if (res.success) {
      setTotalPage(res.data.totalPages);
      return res.data.docs;
    }
    return [];
  };
  const { data: chapters, isLoading } = useQuery({
    queryKey: [QUERY_KEY.CHAPTER_MANAGEMENT, chaptersQueries],
    queryFn: () =>
      fetchChapters(
        chaptersQueries.mangaId,
        chaptersQueries.currentPage,
        chaptersQueries.pageSize
      ),
  });
  useEffect(() => {
    setChapterQueries({ ...chaptersQueries, mangaId: id });
  }, [id]);
  return (
    <>
      <div className="page-wrapper">
        <div className="pb-10">
          <div className="flex justify-between">
            <div className="flex gap-4 items-center">
              <IconButton onClick={() => navigate(-1)}>
                <BiArrowBack></BiArrowBack>
              </IconButton>
              <h1 className="font-bold text-4xl">Chapter Mangement</h1>
            </div>
            <BasicButton
              className="!w-fit"
              onClick={handleOpenPopup}
              icon={<AiFillFileAdd />}
            >
              Add chapter
            </BasicButton>
          </div>
          <div className="mt-10">
            {isLoading ? (
              <div className="mb-10 flex justify-center items-center">
                <CircularProgress
                  style={{
                    color: "orange",
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-col w-full gap-2">
                {chapters?.length > 0 ? (
                  chapters.map((chapter) => (
                    <ChapterAccordion key={chapter._id} chapter={chapter} />
                  ))
                ) : (
                  <div className="flex w-full justify-center items-center text-2xl text-gray-500 font-semibold">
                    No chapters
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <AddChapterModal
        mangaId={id}
        open={open}
        handleClosePopup={handleClosePopup}
      />
    </>
  );
};

export default ChapterMangement;
