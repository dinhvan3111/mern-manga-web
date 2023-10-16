import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import chapterApi from "../../api/chapterApi";
import { CircularProgress, IconButton, Skeleton } from "@mui/material";
import { PAGE_PATH } from "../../routes/page-path";
import { BiArrowBack } from "react-icons/bi";
import { GrNext, GrPrevious } from "react-icons/gr";

const ReadChapter = () => {
  const { id, page } = useParams();
  const pageNum = Number.parseInt(page);
  const navigate = useNavigate();
  const [chapter, setChapter] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [listImgLoading, setListImgLoading] = useState(true);
  const onLoadedImage = (index) => {
    if (index + 1 === chapter?.listImgUrl.length - 1) {
      setListImgLoading(false);
    }
  };
  useEffect(() => {
    const fetchAllImgsFromChapter = async (chapterId) => {
      setListImgLoading(true);
      setIsLoading(true);
      const res = await chapterApi.getAllImgsOfChapter(chapterId);
      if (res.success) {
        console.log(res);
        setChapter(res.data);
      }
      setIsLoading(false);
    };
    fetchAllImgsFromChapter(id);
  }, [id]);
  const nextChapter = () => {
    const currentChapterIndex = chapter?.mangaId.chapters.indexOf(chapter?._id);

    if (currentChapterIndex === chapter?.mangaId.chapters.length - 1) {
      navigate(PAGE_PATH.MANGA_DETAIL(chapter?.mangaId._id));
      return;
    }
    const nextChapterId = chapter.mangaId.chapters[currentChapterIndex + 1];
    navigate(PAGE_PATH.READ_CHAPTER(nextChapterId));
  };
  const previousChapter = () => {
    const currentChapterIndex = chapter?.mangaId.chapters.indexOf(chapter?._id);
    if (currentChapterIndex === 0) {
      navigate(PAGE_PATH.MANGA_DETAIL(chapter?.mangaId._id));
      return;
    }
    const previousChapterId = chapter.mangaId.chapters[currentChapterIndex - 1];
    navigate(PAGE_PATH.READ_CHAPTER(previousChapterId));
  };
  const nextPage = () => {
    if (pageNum === chapter.listImgUrl.length) {
      nextChapter();
    } else navigate(PAGE_PATH.READ_CHAPTER(id, pageNum + 1));
  };
  const previousPage = () => {
    if (pageNum - 1 === 0) {
      previousChapter();
    } else navigate(PAGE_PATH.READ_CHAPTER(id, pageNum - 1));
  };
  useEffect(() => {
    const readingSection = document.getElementById("reading-section");
    window.scrollTo({
      top: readingSection.offsetTop,
      behavior: "smooth",
    });
  });
  return (
    <div className="relative">
      {!isLoading && <NavigationPageBar chapter={chapter} currentPage={page} />}
      <div className="page-wrapper">
        {isLoading ? (
          <ChapterInfoSkeleton />
        ) : (
          <>
            <div className="flex items-center gap-4">
              <IconButton
                onClick={() =>
                  navigate(PAGE_PATH.MANGA_DETAIL(chapter?.mangaId._id))
                }
              >
                <BiArrowBack color="orange" />
              </IconButton>
              <span className="text-xl font-semibold text-orange-400">
                {chapter?.mangaId.name}
              </span>
            </div>
            <div className="mt-10 flex gap-4 text-center">
              <div
                className="basis-1/3 p-2 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer flex gap-2 items-center justify-center"
                onClick={previousChapter}
              >
                <GrPrevious />
                Previous chapter
              </div>
              <div className="basis-1/3 p-2 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer">
                {chapter?.title}
              </div>
              <div
                className="basis-1/3 p-2 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer flex gap-2 items-center justify-center"
                onClick={nextChapter}
              >
                Next chapter
                <GrNext />
              </div>
            </div>
          </>
        )}
        {listImgLoading && (
          <div className="mt-52 flex w-full justify-center items-center">
            <CircularProgress style={{ color: "orange" }} />
          </div>
        )}
        <div
          id="reading-section"
          className={`${
            listImgLoading ? "hidden" : "block"
          } mt-14 flex justify-between pb-4 h-[700px] none`}
        >
          <div
            className="basis-1/3 cursor-pointer"
            onClick={previousPage}
          ></div>
          <div className=" flex">
            {chapter?.listImgUrl.map((item, index) => (
              <img
                src={item}
                alt="img"
                style={{
                  display:
                    listImgLoading || pageNum - 1 !== index ? "none" : "block",
                  animation: "fadeIn 0.5s",
                  width: "100%",
                  //   height: "100%",
                  objectFit: "contain",
                }}
                onLoad={() => onLoadedImage(index)}
              ></img>
            ))}
          </div>
          <div className="basis-1/3 cursor-pointer" onClick={nextPage}></div>
        </div>
      </div>
    </div>
  );
};

const NavigationPageBar = ({ chapter, currentPage }) => {
  const navigate = useNavigate();
  console.log(currentPage);
  return (
    <div className="flex items-center justify-center fixed bottom-0 transition-all h-10 hover:h-20 bg-transparent w-full">
      <div className="px-4 flex gap-1 w-full">
        {chapter?.listImgUrl.map((item, index) => (
          <div
            className={`${index === 0 ? "rounded-l-full" : ""} ${
              index === chapter?.listImgUrl.length - 1 ? "rounded-r-full" : ""
            } ${
              currentPage - 1 === index
                ? "bg-orange-500 opacity-50"
                : "bg-gray-400 opacity-20"
            } w-full transition-all h-3 cursor-pointer`}
            onClick={() =>
              navigate(PAGE_PATH.READ_CHAPTER(chapter._id, index + 1))
            }
          ></div>
        ))}
      </div>
    </div>
  );
};

const ChapterInfoSkeleton = () => {
  return (
    <div>
      <div className="w-fit">
        <Skeleton height={70} width={200}></Skeleton>
      </div>
      <div className="flex gap-4">
        <div className="basis-1/3">
          <Skeleton height={70}></Skeleton>
        </div>
        <div className="basis-1/3">
          <Skeleton height={70}></Skeleton>
        </div>
        <div className="basis-1/3">
          <Skeleton height={70}></Skeleton>
        </div>
      </div>
    </div>
  );
};

export default ReadChapter;
