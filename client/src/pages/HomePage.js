import React, { useMemo } from "react";
import { RiGroupLine } from "react-icons/ri";
import BasicBannerCarousel, {
  BasicBannerCarouselItem,
} from "../components/carousel/BasicCarousel";

// function handleResize() {
//   var browserWidth =
//     window.innerWidth ||
//     document.documentElement.clientWidth ||
//     document.body.clientWidth;
//   drawerWidth = Math.floor(browserWidth * 0.3); //width 30%
//   // console.log(drawerWidth);
// }

// window.addEventListener("resize", handleResize);

// handleResize();
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
  return (
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
  );
};

const BasicMangaEntity = ({ manga, ...props }) => {
  return (
    <div className="flex gap-4 w-full" {...props}>
      <div className="max-w-[56px] min-w-[56px] h-20">
        <img className="w-full h-full" src={manga.imgUrl} alt="img" />
      </div>
      <div className="flex flex-col gap-2 grow w-full">
        <h4 className="text-base break-all font-bold line-clamp-1 text-ellipsis">
          {manga.name}
        </h4>
        <p className="text-base break-all line-clamp-1 text-ellipsis">
          Ch.3 - Drunken confession
          Drunkenconfessionfqwfqwmfqwkljfkwqkfjkqwjfkjwqklfjklqwjfklqwjklfjqw
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
