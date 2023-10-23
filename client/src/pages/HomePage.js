import React, { useEffect, useMemo, useState } from "react";
import { RiGroupLine } from "react-icons/ri";
import BasicBannerCarousel, {
  BasicBannerCarouselItem,
} from "../components/carousel/BasicCarousel";
import { useQuery } from "react-query";
import { reactQueryKey } from "../common/constants";
import mangaApi from "../api/mangaApi";
import { Skeleton } from "@mui/material";
import { dateToTs, getDateDiff } from "../util/timeHelper";
import { useNavigate } from "react-router-dom";
import { PAGE_PATH } from "../routes/page-path";
import AsyncImage from "../components/AsyncImage";

const RECENT_MANGA_ITEMS_PER_PAGE = 18;
const RECENT_MANGA_ITEMS_PER_COL = 6;
const MAX_COL = 3;
const POPULAR_ITEMS_PER_PAGE = 5;

const HomePage = () => {
  const [recentUpdateMangas, setRecentUpdateMangas] = useState([]);
  const renderRecentManga = (data) => {
    const recentMangaContainers = [];
    const cols =
      data.length % 6 === 0
        ? data.length / RECENT_MANGA_ITEMS_PER_COL
        : Math.floor(data.length / RECENT_MANGA_ITEMS_PER_COL) + 1;
    var startIndex = 0;
    var endIndex = RECENT_MANGA_ITEMS_PER_COL;
    for (let i = 0; i < cols; i++) {
      const subItems = data.slice(startIndex, endIndex);
      recentMangaContainers.push([...subItems]);
      startIndex += RECENT_MANGA_ITEMS_PER_COL;
      endIndex += RECENT_MANGA_ITEMS_PER_COL;
    }
    setRecentUpdateMangas(recentMangaContainers);
    // return recentMangaContainers;
  };
  const {
    data: popularManga,
    isLoading: isLoadingPopularManga,
    isFetched: isFetchedPopularManga,
  } = useQuery(reactQueryKey.POPULAR_MANGA, async () => {
    const res = await mangaApi.getAllMangas(1, POPULAR_ITEMS_PER_PAGE, {
      sortByViews: -1,
    });
    console.log(res);
    if (res.success) {
      return res.data.docs;
    } else {
      return [];
    }
  });
  const {
    data: mangaList,
    isLoading,
    isFetched,
  } = useQuery(reactQueryKey.ALL_MANGA, async () => {
    const res = await mangaApi.getAllMangas(1, RECENT_MANGA_ITEMS_PER_PAGE, {
      sortByLatestUpdate: -1,
    });
    if (res.success) {
      return res.data.docs;
    } else {
      return [];
    }
  });
  useEffect(() => {
    window.scrollTo(0, 0);
    function handleResize() {
      var browserWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      const secondCol = document.getElementById("recent-update-1");
      const lastCol = document.getElementById("recent-update-2");
      if (browserWidth < 1024) {
        lastCol?.classList.add("hidden");
      } else {
        lastCol?.classList.remove("hidden");
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (mangaList) {
      renderRecentManga(mangaList);
    }
  }, [mangaList, isFetched, isLoading]);
  return (
    <div className="page-wrapper">
      <div className="">
        <h1 className="text-3xl">Popular New Titles</h1>
        <BasicBannerCarousel
          isLoading={isLoadingPopularManga}
          data={popularManga}
          itemComponent={(item, index) => (
            <BasicBannerCarouselItem
              key={index}
              item={item}
              index={index + 1}
            />
          )}
        />
      </div>
      <div className="text-2xl pb-16">
        <h2>Latest Updates</h2>
        <div className="mt-4 grid gap-x-6 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
          {isLoading
            ? Array(MAX_COL)
                .fill(0)
                .map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 rounded-sm flex flex-col gap-4 p-4 "
                  >
                    {Array(RECENT_MANGA_ITEMS_PER_COL)
                      .fill(0)
                      .map((item, index) => (
                        <BasicMangaEntitySekelton key={index} />
                      ))}
                  </div>
                ))
            : recentUpdateMangas.map((item, index) => (
                <div
                  id={`recent-update-${index}`}
                  key={index}
                  className="bg-gray-100 rounded-sm flex flex-col gap-4 p-4 "
                >
                  {item.map((manga, mangaIndex) => (
                    <BasicMangaEntity key={mangaIndex} manga={manga} />
                  ))}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

const BasicMangaEntitySekelton = ({ ...props }) => {
  return (
    <div className="flex gap-4 w-full" {...props}>
      <div className="max-w-[56px] min-w-[56px] h-20">
        <Skeleton variant="rounded" className="!h-full"></Skeleton>
      </div>
      <div className="flex flex-col gap-2 grow w-full">
        <h4 className="text-base break-all font-bold line-clamp-1 text-ellipsis">
          <Skeleton variant="text"></Skeleton>
        </h4>
        <Skeleton variant="text"></Skeleton>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <h4 className=" text-sm line-clamp-1 text-ellipsis basic-hover">
              <Skeleton variant="text" width={50}></Skeleton>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

const BasicMangaEntity = ({ manga, ...props }) => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-4 w-full" {...props}>
      <div
        className="max-w-[56px] min-w-[56px] h-20 cursor-pointer"
        onClick={() => navigate(PAGE_PATH.MANGA_DETAIL(manga?._id))}
      >
        <AsyncImage
          alt="img"
          skeletonHeight={80}
          src={
            manga.thumbUrl !== ""
              ? manga.thumbUrl
              : "/images/no_manga_thumb.png"
          }
        ></AsyncImage>
      </div>
      <div className="flex flex-col gap-2 grow w-full">
        <div
          className="flex flex-col gap-2 cursor-pointer"
          onClick={() => navigate(PAGE_PATH.MANGA_DETAIL(manga?._id))}
        >
          <h4 className="text-base break-all font-bold line-clamp-1 text-ellipsis">
            {manga.name}
          </h4>
          <p className="text-base break-all line-clamp-1 text-ellipsis">
            {manga.chapters.length > 0
              ? manga.chapters[0].title
              : "No chapters yet"}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <RiGroupLine size={15} />
            <h4 className="p-1 text-sm line-clamp-1 text-ellipsis basic-hover">
              {manga.authors.length > 0 ? manga.authors.join(",") : "Unknown"}
            </h4>
          </div>
          <h4 className="text-sm">
            {getDateDiff(dateToTs(manga.latestUpdate))}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
