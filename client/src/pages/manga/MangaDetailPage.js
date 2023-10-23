import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BasicTag from "../../components/tag/BasicTag";
import BasicButton, { BUTTON_TYPE } from "../../components/button/BasicButton";
import { BiBookOpen, BiStar, BiTimeFive } from "react-icons/bi";
import { RiCheckLine } from "react-icons/ri";
import {
  HiOutlineSortAscending,
  HiOutlineSortDescending,
} from "react-icons/hi";
import mangaApi from "../../api/mangaApi";
import { CircularProgress, Skeleton, Typography } from "@mui/material";
import { mangaStatusToString } from "../../util/stringHelper";
import {
  DETAIL_MANGA_TAG,
  MANGA_STATUS,
  SORT_CHAPTER,
} from "../../common/constants";
import chapterApi from "../../api/chapterApi";
import { dateToTs, getDateDiff } from "../../util/timeHelper";
import { PAGE_PATH } from "../../routes/page-path";
import { toast } from "react-toastify";
import AsyncImage from "../../components/AsyncImage";
import { useSelector } from "react-redux";

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
      <div className="backdrop-blur-lg h-full bg-gradient-to-t from-white from-70% to-white/60 to-100% md:bg-gradient-to-r sm:from-black/70 sm:from-10% sm:to-white/20 sm:to-100% pt-52">
        <div className="mt-20">
          <div className="relative backdrop-blur-lg h-full bg-white/[100%]">
            <div className="page-wrapper">
              <div className="absolute -top-52 flex gap-4">
                <div className="w-32 sm:w-52 h-fit bg-white">
                  <div className="block sm:hidden">
                    <Skeleton
                      variant="rectangular"
                      width={128}
                      height={200}
                      animation="wave"
                    ></Skeleton>
                  </div>
                  <div className="hidden sm:block">
                    <Skeleton
                      variant="rectangular"
                      width={208}
                      height={300}
                      animation="wave"
                    ></Skeleton>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <div className="">
                    <div className="h-fit lg:h-[154px]">
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
                      <BasicButton
                        loading={true}
                        className="!w-fit lg:!w-60 !text-md lg:!text-lg"
                      >
                        Add To Library
                      </BasicButton>
                      <BasicButton
                        loading={true}
                        className="!w-fit lg:!w-60 !text-md lg:!text-lg !bg-gray-100"
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

const detailMangaTag = (manga) => [
  {
    value: DETAIL_MANGA_TAG.AUTHORS,
    label: "Authors",
    data: manga?.authors,
  },
  {
    value: DETAIL_MANGA_TAG.ARTISTS,
    label: "Artists",
    data: manga?.artists,
  },
  {
    value: DETAIL_MANGA_TAG.GENRES,
    label: "Genres",
    data: manga?.genres,
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
  const { user } = useSelector((state) => state.auth);
  const [addLibLoading, setAddLibLoading] = useState(false);
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
  const addToLib = async () => {
    if (!user.data) {
      navigate(PAGE_PATH.LOGIN);
      return;
    }
    setAddLibLoading(true);
    const res = await mangaApi.addMangaToLibrary(manga?._id);
    if (res.success) {
      manga.isInFavourite = true;
      toast.success("Manga has been added to library");
    }
    setAddLibLoading(false);
  };
  const removeFromLib = async () => {
    setAddLibLoading(true);
    const res = await mangaApi.removeMangaFromLibrary(manga?._id);
    if (res.success) {
      manga.isInFavourite = false;
      toast.success("Removed manga from library");
    }
    setAddLibLoading(false);
  };
  return (
    <div
      style={{
        // height: "100vh",
        "--image-url": `url(${manga?.thumbUrl})`,
      }}
      className={`bg-[image:var(--image-url)] bg-fixed bg-no-repeat bg-cover bg-center  `}
    >
      <div className="backdrop-blur-lg h-full bg-gradient-to-t from-white from-70% to-white/60 to-100% md:bg-gradient-to-r sm:from-black/70 sm:from-10% sm:to-white/20 sm:to-100% pt-52">
        <div className="mt-20">
          <div className="relative backdrop-blur-lg h-full bg-white/[100%]">
            <div className="page-wrapper">
              <div className="absolute -top-52 w-fit flex gap-4">
                <div className="basis-1/6">
                  <div className="bg-white rounded-md w-32 sm:w-52 h-fit drop-shadow-xl">
                    <AsyncImage
                      imgClassName="object-fit"
                      src={manga.thumbUrl}
                      skeletonHeight={300}
                      alt="img"
                    />
                  </div>
                </div>
                <div className="basis-5/6">
                  <div className="flex flex-col w-full justify-between">
                    <div className="">
                      <h3
                        className="h-fit lg:h-[154px] font-bold text-black sm:text-white text-2xl md:text-4xl lg:text-7xl  cursor-pointer line-clamp-2 drop-shadow-lg"
                        //   onClick={() => navigate(`${PAGE_PATH.MANGA_DETAIL(1)}`)}
                      >
                        {manga?.name}
                      </h3>
                      <h4 className="mt-4 text-black sm:text-white text-md sm:text-lg font-semibold">
                        {manga?.authors.join(", ")}
                      </h4>
                    </div>
                    <div className="block lg:hidden">
                      <div className="mt-2 flex flex-wrap gap-1">
                        {manga?.genres.map((genre) => (
                          <BasicTag
                            key={genre._id}
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
                    </div>
                    <div className="mt-2 block lg:hidden">
                      <div className="flex gap-2 items-center">
                        <BiStar size={20} color="orange" />
                        <span className="text-lg text-orange-500">
                          {parseFloat(manga?.rating).toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="pt-10">
                      <div className="flex h-14 gap-4 w-fit">
                        {manga.isInFavourite ? (
                          <BasicButton
                            loading={addLibLoading}
                            className="!w-fit lg:!w-60 !text-md lg:!text-lg"
                            icon={<RiCheckLine size={40} />}
                            onClick={removeFromLib}
                          >
                            In library
                          </BasicButton>
                        ) : (
                          <BasicButton
                            loading={addLibLoading}
                            className="!w-fit lg:!w-60 !text-md lg:!text-lg"
                            onClick={addToLib}
                          >
                            Add To Library
                          </BasicButton>
                        )}
                        <BasicButton
                          disabled={chapters?.length === 0}
                          onClick={handleStartReading}
                          className="!w-fit lg:!w-60 !text-md lg:!text-lg !bg-gray-100"
                          buttonType={BUTTON_TYPE.NO_COLOR}
                          icon={<BiBookOpen size={30} />}
                        >
                          Start Reading
                        </BasicButton>
                      </div>
                      {/* ===================Responsive genres and rating (Max width lg)======================== */}
                      <div className="hidden lg:block">
                        <div className="mt-2 flex gap-1">
                          {manga?.genres.map((genre) => (
                            <BasicTag
                              key={genre._id}
                              className="!font-bold text-gray-700 p-1"
                              label={genre.name}
                            ></BasicTag>
                          ))}
                          <BasicTag
                            showStatusDot={true}
                            statusDotColor={renderMangaStatusColor(
                              manga?.status
                            )}
                            className="!font-bold text-gray-700 p-1"
                            label={mangaStatusToString(manga?.status)}
                          ></BasicTag>
                        </div>
                      </div>
                      <div className="mt-2 hidden lg:block">
                        <div className="flex gap-2 items-center">
                          <BiStar size={20} color="orange" />
                          <span className="text-lg text-orange-500">
                            {parseFloat(manga?.rating).toFixed(1)}
                          </span>
                        </div>
                      </div>
                      {/* ===================Responsive genres and rating (Max width lg)======================== */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-20">
                <p className="leading-7 w-fit">{manga?.description}</p>
                <div className="mt-8">
                  <div className="block md:flex gap-5">
                    <div className="flex-1 flex gap-8 h-fit flex-wrap">
                      {detailMangaTag(manga).map((detailTag) => (
                        <div key={detailTag.value}>
                          <h4 className="font-bold text-lg">Author</h4>
                          <div className="flex gap-2">
                            {detailTag.data?.length > 0
                              ? detailTag.data.map((item, index) => (
                                  <BasicTag
                                    key={index}
                                    className="mt-2 w-fit py-1 text-center !bg-gray-100 font-normal text-sm text-gray-700"
                                    label={
                                      detailTag.value ===
                                      DETAIL_MANGA_TAG.GENRES
                                        ? item.name
                                        : item
                                    }
                                  ></BasicTag>
                                ))
                              : "Unknown"}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex-2 mt-10 md:mt-0 flex-grow">
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
