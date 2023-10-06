import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux-toolkit/authSlice";
import { RiGroupLine } from "react-icons/ri";
import { FiBookmark, FiHome } from "react-icons/fi";
import { BsBookmark } from "react-icons/bs";
import { PAGE_PATH } from "../routes/page-path";
import BasicBannerCarousel, {
  BasicBannerCarouselItem,
} from "../components/carousel/BasicCarousel";
import BasicAppBar from "../components/BasicAppBar";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Typography,
} from "@mui/material";
import { BiExpand } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import BasicButton from "../components/button/BasicButton";
import { IoHome } from "react-icons/io5";
import { ACCORDION_NAV_OPTION } from "../common/constants";

var drawerWidth = 300;

function handleResize() {
  var browserWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  drawerWidth = Math.floor(browserWidth * 0.3); //width 30%
  // console.log(drawerWidth);
}
const mangaList = [
  {
    name: "Boku no hero academia",
    description: `My Hero Academia is a Japanese superhero manga series written and
    illustrated by Kōhei Horikoshi. It has been serialized in
    Shueisha's shōnen manga magazine Weekly Shōnen Jump since July
    2014, with its chapters additionally collected into 38 tankōbon
    volumes as of June 2023.`,
    genres: ["Shounen", "Ahegao", "NTR"],
    imgUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Boku_no_Hero_Academia_Volume_1.png/220px-Boku_no_Hero_Academia_Volume_1.png",
    author: "Kagami Kurege",
  },
  {
    name: "Boku no hero academia",
    description: `My Hero Academia is a Japanese superhero manga series written and
    illustrated by Kōhei Horikoshi. It has been serialized in
    Shueisha's shōnen manga magazine Weekly Shōnen Jump since July
    2014, with its chapters additionally collected into 38 tankōbon
    volumes as of June 2023.`,
    genres: ["Shounen", "Ahegao", "NTR"],
    imgUrl:
      "https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg",
    author: "Kagami Kurege",
  },
  {
    name: "Boku no hero academia",
    description: `My Hero Academia is a Japanese superhero manga series written and
    illustrated by Kōhei Horikoshi. It has been serialized in
    Shueisha's shōnen manga magazine Weekly Shōnen Jump since July
    2014, with its chapters additionally collected into 38 tankōbon
    volumes as of June 2023.`,
    genres: ["Shounen", "Ahegao", "NTR"],
    imgUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Boku_no_Hero_Academia_Volume_1.png/220px-Boku_no_Hero_Academia_Volume_1.png",
    author: "Kagami Kurege",
  },
  {
    name: "Boku no hero academia",
    description: `My Hero Academia is a Japanese superhero manga series written and
    illustrated by Kōhei Horikoshi. It has been serialized in
    Shueisha's shōnen manga magazine Weekly Shōnen Jump since July
    2014, with its chapters additionally collected into 38 tankōbon
    volumes as of June 2023.`,
    genres: ["Shounen", "Ahegao", "NTR"],
    imgUrl:
      "https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg",
    author: "Kagami Kurege",
  },
  {
    name: "Boku no hero academia",
    description: `My Hero Academia is a Japanese superhero manga series written and
    illustrated by Kōhei Horikoshi. It has been serialized in
    Shueisha's shōnen manga magazine Weekly Shōnen Jump since July
    2014, with its chapters additionally collected into 38 tankōbon
    volumes as of June 2023.`,
    genres: ["Shounen", "Ahegao", "NTR"],
    imgUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Boku_no_Hero_Academia_Volume_1.png/220px-Boku_no_Hero_Academia_Volume_1.png",
    author: "Kagami Kurege",
  },
  {
    name: "Boku no hero academia",
    description: `My Hero Academia is a Japanese superhero manga series written and
    illustrated by Kōhei Horikoshi. It has been serialized in
    Shueisha's shōnen manga magazine Weekly Shōnen Jump since July
    2014, with its chapters additionally collected into 38 tankōbon
    volumes as of June 2023.`,
    genres: ["Shounen", "Ahegao", "NTR"],
    imgUrl:
      "https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg",
    author: "Kagami Kurege",
  },
  {
    name: "Boku no hero academia",
    description: `My Hero Academia is a Japanese superhero manga series written and
    illustrated by Kōhei Horikoshi. It has been serialized in
    Shueisha's shōnen manga magazine Weekly Shōnen Jump since July
    2014, with its chapters additionally collected into 38 tankōbon
    volumes as of June 2023.`,
    genres: ["Shounen", "Ahegao", "NTR"],
    imgUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Boku_no_Hero_Academia_Volume_1.png/220px-Boku_no_Hero_Academia_Volume_1.png",
    author: "Kagami Kurege",
  },
  {
    name: "Boku no hero academia",
    description: `My Hero Academia is a Japanese superhero manga series written and
    illustrated by Kōhei Horikoshi. It has been serialized in
    Shueisha's shōnen manga magazine Weekly Shōnen Jump since July
    2014, with its chapters additionally collected into 38 tankōbon
    volumes as of June 2023.`,
    genres: ["Shounen", "Ahegao", "NTR"],
    imgUrl:
      "https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg",
    author: "Kagami Kurege",
  },
  {
    name: "Boku no hero academia",
    description: `My Hero Academia is a Japanese superhero manga series written and
    illustrated by Kōhei Horikoshi. It has been serialized in
    Shueisha's shōnen manga magazine Weekly Shōnen Jump since July
    2014, with its chapters additionally collected into 38 tankōbon
    volumes as of June 2023.`,
    genres: ["Shounen", "Ahegao", "NTR"],
    imgUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Boku_no_Hero_Academia_Volume_1.png/220px-Boku_no_Hero_Academia_Volume_1.png",
    author: "Kagami Kurege",
  },
  {
    name: "Boku no hero academia",
    description: `My Hero Academia is a Japanese superhero manga series written and
    illustrated by Kōhei Horikoshi. It has been serialized in
    Shueisha's shōnen manga magazine Weekly Shōnen Jump since July
    2014, with its chapters additionally collected into 38 tankōbon
    volumes as of June 2023.`,
    genres: ["Shounen", "Ahegao", "NTR"],
    imgUrl:
      "https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg",
    author: "Kagami Kurege",
  },
  {
    name: "Boku no hero academia",
    description: `My Hero Academia is a Japanese superhero manga series written and
    illustrated by Kōhei Horikoshi. It has been serialized in
    Shueisha's shōnen manga magazine Weekly Shōnen Jump since July
    2014, with its chapters additionally collected into 38 tankōbon
    volumes as of June 2023.`,
    genres: ["Shounen", "Ahegao", "NTR"],
    imgUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Boku_no_Hero_Academia_Volume_1.png/220px-Boku_no_Hero_Academia_Volume_1.png",
    author: "Kagami Kurege",
  },
  {
    name: "Boku no hero academia",
    description: `My Hero Academia is a Japanese superhero manga series written and
    illustrated by Kōhei Horikoshi. It has been serialized in
    Shueisha's shōnen manga magazine Weekly Shōnen Jump since July
    2014, with its chapters additionally collected into 38 tankōbon
    volumes as of June 2023.`,
    genres: ["Shounen", "Ahegao", "NTR"],
    imgUrl:
      "https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg",
    author: "Kagami Kurege",
  },
  {
    name: "Boku no hero academia",
    description: `My Hero Academia is a Japanese superhero manga series written and
    illustrated by Kōhei Horikoshi. It has been serialized in
    Shueisha's shōnen manga magazine Weekly Shōnen Jump since July
    2014, with its chapters additionally collected into 38 tankōbon
    volumes as of June 2023.`,
    genres: ["Shounen", "Ahegao", "NTR"],
    imgUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Boku_no_Hero_Academia_Volume_1.png/220px-Boku_no_Hero_Academia_Volume_1.png",
    author: "Kagami Kurege",
  },
  {
    name: "Boku no hero academia",
    description: `My Hero Academia is a Japanese superhero manga series written and
    illustrated by Kōhei Horikoshi. It has been serialized in
    Shueisha's shōnen manga magazine Weekly Shōnen Jump since July
    2014, with its chapters additionally collected into 38 tankōbon
    volumes as of June 2023.`,
    genres: ["Shounen", "Ahegao", "NTR"],
    imgUrl:
      "https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg",
    author: "Kagami Kurege",
  },
];

const accordionFollowingvOptions = [
  {
    value: ACCORDION_NAV_OPTION.FOLLOWING.UPDATE,
    title: "Updates",
    path: "/update",
  },
  {
    value: ACCORDION_NAV_OPTION.FOLLOWING.LIBRARY,
    title: "Library",
    path: "/library",
  },
];

const ITEMS_PER_COL = 6;
const MAX_COL = 3;
const HomePage = () => {
  const renderRecentManga = (data) => {
    const recentMangaContainers = [];
    const cols = Math.round(data.length / ITEMS_PER_COL) + 1;
    console.log(cols);
    var startIndex = 0;
    var endIndex = ITEMS_PER_COL;
    for (let i = 0; i < cols; i++) {
      const subItems = data.slice(startIndex, endIndex);
      recentMangaContainers.push([...subItems]);
      startIndex += ITEMS_PER_COL;
      endIndex += ITEMS_PER_COL;
    }
    return recentMangaContainers;
  };
  const recentMangaContainer = useMemo(
    () => renderRecentManga(mangaList),
    [mangaList]
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectTab, setSelectTab] = useState();
  const onLogout = () => {
    dispatch(logout());
    navigate(PAGE_PATH.LOGIN);
  };
  return (
    <div className="flex">
      {/* <Accordion>
        <AccordionSummary
          expandIcon={<BiExpand />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Accordion 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion> */}
      <div className="">
        {/* <div className="px-4 py-4 bg-gray-200 h-full">
          <div className="flex gap-4">
            <div
              className="text-2xl font-bold hover:cursor-pointer no-select"
              onClick={() => navigate(PAGE_PATH.HOME)}
            >
              VzManga
            </div>
            <IconButton>
              <AiOutlineClose />
            </IconButton>
          </div>
          <div className="w-full">
            <div className="mt-4">
              <div
                className={`no-select py-1 px-2 flex gap-2 rounded-md cursor-pointer ${
                  selectTab === ACCORDION_NAV_OPTION.HOME
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "hover:bg-gray-300"
                }`}
                onClick={() => setSelectTab(ACCORDION_NAV_OPTION.HOME)}
              >
                <FiHome size={20} />
                <span className="font-bold">Home</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="py-1 px-2 flex gap-2 no-select">
                <FiBookmark size={20} />
                <span className="font-bold">Following</span>
              </div>
              {accordionFollowingvOptions.map((item) => (
                <div
                  key={item.value}
                  className={`py-1 px-2 flex gap-1 justify-start items-center hover:bg-gray-300 cursor-pointer rounded-md no-select ${
                    selectTab === item.value
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "hover:bg-gray-300"
                  }`}
                  onClick={() => {
                    setSelectTab(item.value);
                    //set tab here
                  }}
                >
                  <span className="text-base">{item.title} </span>
                </div>
              ))}
            </div>
          </div>
        </div> */}
      </div>
      <div>
        <BasicAppBar />
        <div className="page-wrapper">
          <div className="">
            <h1 className="text-3xl">Popular New Titles</h1>
            <BasicBannerCarousel
              data={mangaList}
              itemComponent={(item, index) => (
                <BasicBannerCarouselItem key={index} item={item} />
              )}
            />
          </div>
          <div className="text-2xl pb-16">
            <h2>Latest Updates</h2>
            <div className="mt-4 grid gap-x-6 3xl:grid-cols-4 2xl:grid-cols-3 lg:grid-cols-2 grid-cols-1">
              {recentMangaContainer.map((item, index) => (
                <div
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
      </div>
    </div>
  );
};

const BasicMangaEntity = ({ manga, ...props }) => {
  return (
    <div className="flex gap-4" {...props}>
      <div className="max-w-[56px] min-w-[56px] h-20">
        <img className="w-full h-full" src={manga.imgUrl} alt="img" />
      </div>
      <div className="flex flex-col gap-2 grow">
        <h4 className="text-base font-bold line-clamp-1 text-ellipsis">
          {manga.name}
        </h4>
        <p className="text-base line-clamp-1 text-ellipsis">
          Ch.3 - Drunken confession fqwfwqfqw fqw fqw
          fwqfqwhfqwkhfkhqwkfkqwhfhqwhfhwqhl
        </p>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <RiGroupLine size={15} />
            <h4 className="p-1 text-sm line-clamp-1 text-ellipsis basic-hover">
              {manga.author}
            </h4>
          </div>
          <h4 className="text-sm">55 minutes ago</h4>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
