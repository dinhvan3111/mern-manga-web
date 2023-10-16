import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BasicAppBar from "../../components/BasicAppBar";
import BasicTag from "../../components/tag/BasicTag";
import BasicButton, { BUTTON_TYPE } from "../../components/button/BasicButton";
import { BiBookOpen, BiStar, BiTimeFive } from "react-icons/bi";
import {
  HiOutlineSortAscending,
  HiOutlineSortDescending,
} from "react-icons/hi";
import mangaApi from "../../api/mangaApi";
import { CircularProgress, Skeleton, Typography } from "@mui/material";
import { mangaStatusToString } from "../../util/stringHelper";
import { MANGA_STATUS, SORT_CHAPTER } from "../../common/constants";
import AsyncImage from "../../components/AsyncImage";
import chapterApi from "../../api/chapterApi";
import { dateToTs, getDateDiff } from "../../util/timeHelper";
import { PAGE_PATH } from "../../routes/page-path";

const MangaDetailPage = () => {
  const { id } = useParams();
  const [manga, setManga] = useState();
  const [chapters, setChapters] = useState([]);
  const [isLoadingChapter, setIsLoadingChapter] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSortChapter, setCurrentSortChapter] = useState(
    SORT_CHAPTER.ASC
  );
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    console.log("useEffect");
    const fetchMangaDetail = async (id) => {
      setIsLoading(true);
      const res = await mangaApi.getMangaById(id);
      if (res.success) {
        setManga(res.data.manga);
      } else {
        console.log(res);
      }
      setIsLoading(false);
    };
    fetchMangaDetail(id);
  }, [id]);
  useEffect(() => {
    const fetchAllMangaChapter = async (id) => {
      setIsLoadingChapter(true);
      const res = await chapterApi.getAllChapters(
        id,
        1,
        10,
        currentSortChapter
      );
      if (res.success) {
        setChapters(res.data.docs);
      } else {
        console.log(res);
      }
      setIsLoadingChapter(false);
    };
    fetchAllMangaChapter(id);
  }, [currentSortChapter]);
  return isLoading ? (
    <MangaDetailContentSkeleton />
  ) : (
    <MangaDetailContent
      manga={manga}
      chapters={chapters}
      currentSortChapter={currentSortChapter}
      setCurrentSortChapter={setCurrentSortChapter}
      isLoadingChapter={isLoadingChapter}
    />
  );
};

const MangaDetailContentSkeleton = () => {
  return (
    <div className={`bg-gradient-to-r from-gray-800 to-gray-300`}>
      <div className="backdrop-blur-lg h-full bg-black/20 pt-52">
        <div className="mt-20">
          <div className="relative backdrop-blur-lg h-full bg-white/[100%]">
            <div className="page-wrapper">
              <div className="absolute -top-52 flex gap-4">
                <div className="w-52 bg-white">
                  <Skeleton
                    variant="rectangular"
                    width={208}
                    height={300}
                    animation="wave"
                  ></Skeleton>
                </div>
                <div className="flex flex-col justify-between">
                  <div className="">
                    <div className="h-[154px]">
                      <Typography variant="h2">
                        <Skeleton variant="text" className="w-full bg-white" />
                      </Typography>
                    </div>

                    <Typography variant="h3">
                      <Skeleton
                        variant="text"
                        width="50%"
                        className=" bg-white"
                      />
                    </Typography>
                  </div>
                  <div className="pt-10">
                    <div className="flex h-14 gap-4 w-fit">
                      <BasicButton loading={true} className="!w-60 !text-lg">
                        Add To Library
                      </BasicButton>
                      <BasicButton
                        loading={true}
                        className="!w-60 !text-lg !bg-gray-100"
                        buttonType={BUTTON_TYPE.NO_COLOR}
                      >
                        Start Reading
                      </BasicButton>
                    </div>
                    <div className="mt-2 flex gap-1"></div>
                    <div className="mt-2">
                      <div className="flex gap-2 items-center">
                        <Skeleton
                          variant="rounded"
                          width="20%"
                          animation="wave"
                        ></Skeleton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-20 text-center">
                <CircularProgress
                  style={{
                    color: "gray",
                  }}
                ></CircularProgress>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const sortChapterOptions = [
  {
    value: SORT_CHAPTER.ASC,
    label: "Ascending",
    icon: <HiOutlineSortAscending />,
  },
  {
    value: SORT_CHAPTER.DESC,
    label: "Descending",
    icon: <HiOutlineSortDescending />,
  },
];

const MangaDetailContent = ({
  manga,
  chapters,
  isLoadingChapter,
  currentSortChapter,
  setCurrentSortChapter,
  ...props
}) => {
  const navigate = useNavigate();
  const renderMangaStatusColor = (status) => {
    switch (status) {
      case MANGA_STATUS.ON_GOING:
        return "bg-green-500";
      case MANGA_STATUS.ABANDONED:
        return "bg-yellow-500";
      case MANGA_STATUS.COMPLETED:
        return "bg-blue-500";
      default:
        return "";
    }
  };
  const handleStartReading = () => {
    navigate(PAGE_PATH.READ_CHAPTER(chapters[0]?._id));
  };
  const handleSortChapter = (value) => {
    setCurrentSortChapter(value);
  };
  return (
    <div
      style={{
        // height: "100vh",
        "--image-url": `url(${manga?.thumbUrl})`,
      }}
      className={`bg-[image:var(--image-url)] bg-fixed bg-no-repeat bg-cover bg-center  `}
    >
      <div className="backdrop-blur-lg h-full bg-black/20 pt-52">
        <div className="mt-20">
          <div className="relative backdrop-blur-lg h-full bg-white/[100%]">
            <div className="page-wrapper">
              <div className="absolute -top-52 flex gap-4">
                <img
                  className="w-52 h-full object-contain cursor-pointer"
                  src={manga?.thumbUrl}
                  alt="thumb"
                ></img>
                {/* <AsyncImage
                  className="!w-52 h-full object-contain cursor-pointer"
                  src={manga.thumbUrl}
                  alt="img"
                /> */}
                <div className="flex flex-col justify-between">
                  <div className="">
                    <h3
                      className="h-[154px] font-bold text-white text-7xl cursor-pointer line-clamp-2 drop-shadow-lg"
                      //   onClick={() => navigate(`${PAGE_PATH.MANGA_DETAIL(1)}`)}
                    >
                      {manga?.name}
                    </h3>
                    <h4 className="mt-4 text-white text-lg font-semibold">
                      {manga?.authors.join(", ")}
                    </h4>
                  </div>
                  <div className="pt-10">
                    <div className="flex h-14 gap-4 w-fit">
                      <BasicButton className="!w-60 !text-lg">
                        Add To Library
                      </BasicButton>
                      <BasicButton
                        disabled={chapters?.length === 0}
                        onClick={handleStartReading}
                        className="!w-60 !text-lg !bg-gray-100"
                        buttonType={BUTTON_TYPE.NO_COLOR}
                        icon={<BiBookOpen size={30} />}
                      >
                        Start Reading
                      </BasicButton>
                    </div>
                    <div className="mt-2 flex gap-1">
                      {manga?.genres.map((genre) => (
                        <BasicTag
                          className="!font-bold text-gray-700 p-1"
                          label={genre.name}
                        ></BasicTag>
                      ))}
                      <BasicTag
                        showStatusDot={true}
                        statusDotColor={renderMangaStatusColor(manga?.status)}
                        className="!font-bold text-gray-700 p-1"
                        label={mangaStatusToString(manga?.status)}
                      ></BasicTag>
                    </div>
                    <div className="mt-2">
                      <div className="flex gap-2 items-center">
                        <BiStar size={20} color="orange" />
                        <span className="text-lg text-orange-500">
                          {parseFloat(manga?.rating).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-20">
                <p className="leading-7 w-full">{manga?.description}</p>
                <div className="mt-8">
                  <div className="flex gap-5">
                    <div className="flex-1 flex gap-8 h-fit flex-wrap">
                      <div>
                        <h4 className="font-bold text-lg">Author</h4>
                        <div className="flex gap-2">
                          {manga?.authors.length > 0
                            ? manga?.authors.map((item, index) => (
                                <BasicTag
                                  key={index}
                                  className="mt-2 w-fit py-1 text-center !bg-gray-100 font-normal text-sm text-gray-700"
                                  label={item}
                                ></BasicTag>
                              ))
                            : "Unknown"}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Artist</h4>
                        <div className="flex gap-2">
                          {manga?.artists.length > 0
                            ? manga?.artists.map((item, index) => (
                                <BasicTag
                                  key={index}
                                  className="mt-2 w-fit py-1 text-center !bg-gray-100 font-normal text-sm text-gray-700"
                                  label={item}
                                ></BasicTag>
                              ))
                            : "Unknown"}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Genres</h4>
                        <div className="flex gap-2">
                          {manga?.genres.length > 0
                            ? manga?.genres.map((item) => (
                                <BasicTag
                                  key={item._id}
                                  className="mt-2 w-fit py-1 text-center !bg-gray-100 font-normal text-sm text-gray-700"
                                  label={item.name}
                                ></BasicTag>
                              ))
                            : "Unknown"}
                        </div>
                      </div>
                    </div>
                    <div className="flex-2 flex-grow">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-bold">Chapters</span>
                        </div>
                        <div className="flex gap-2">
                          {sortChapterOptions.map((item) => (
                            <BasicButton
                              disabled={isLoadingChapter}
                              key={item.value}
                              onClick={() => handleSortChapter(item.value)}
                              className={`w-fit  ${
                                currentSortChapter === item.value
                                  ? "!bg-gray-200 hover:!bg-gray-300"
                                  : "!bg-gray-100"
                              }`}
                              buttonType={BUTTON_TYPE.NO_COLOR}
                              icon={item.icon}
                            >
                              {item.label}
                            </BasicButton>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4">
                        {isLoadingChapter ? (
                          <div className="flex items-center justify-center">
                            <CircularProgress
                              style={{ color: "black" }}
                            ></CircularProgress>
                          </div>
                        ) : chapters.length > 0 ? (
                          chapters.map((chapter, index) => (
                            <Chapter key={index} chapter={chapter} />
                          ))
                        ) : (
                          <div className="flex items-center justify-center mt-10 p-4">
                            <span className="font-semibold text-gray-500 text-xl">
                              This manga doesn't have any chapters yet
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Chapter = ({ chapter, ...props }) => {
  const navigate = useNavigate();
  const readChapter = () => {
    navigate(PAGE_PATH.READ_CHAPTER(chapter?._id), 1);
  };
  return (
    <div
      className="mt-2 flex px-4 py-2 justify-between bg-gray-100 rounded-sm hover:bg-gray-200 cursor-pointer"
      onClick={readChapter}
    >
      <span className="font-semibold">{chapter?.title}</span>
      <div className="flex gap-2 justify-center items-center">
        <BiTimeFive size={20} />
        <span>{getDateDiff(dateToTs(chapter?.publishDate))}</span>
      </div>
    </div>
  );
};

export default MangaDetailPage;
