import React from "react";
import { useParams } from "react-router-dom";
import BasicAppBar from "../../components/BasicAppBar";
import BasicTag from "../../components/tag/BasicTag";
import BasicButton, { BUTTON_TYPE } from "../../components/button/BasicButton";
import { BiBookOpen, BiStar, BiTimeFive } from "react-icons/bi";
import {
  HiOutlineSortAscending,
  HiOutlineSortDescending,
} from "react-icons/hi";

const MangaDetailPage = () => {
  const { id } = useParams();
  return (
    <div
      style={{
        // height: "100vh",
        "--image-url": `url(${"https://upload.wikimedia.org/wikipedia/vi/5/5a/Boku_no_Hero_Academia_Volume_1.png"})`,
      }}
      className={`bg-[image:var(--image-url)] bg-fixed bg-no-repeat bg-cover bg-center  `}
    >
      <div className="backdrop-blur-lg h-full bg-black/20 pt-52">
        <div className="mt-20">
          {/* <BasicAppBar textColor="text-white" accordionIconColor="white" /> */}
          <div className="relative backdrop-blur-lg h-full bg-white/[100%]">
            <MangaDetailContent></MangaDetailContent>
          </div>
        </div>
      </div>
    </div>
  );
};

const MangaDetailContent = () => {
  return (
    <div className="page-wrapper">
      <div className="absolute -top-52 flex gap-4">
        <img
          className="w-52 object-contain cursor-pointer"
          src="https://upload.wikimedia.org/wikipedia/vi/5/5a/Boku_no_Hero_Academia_Volume_1.png"
          alt="thumb"
        ></img>
        <div className="flex flex-col justify-between">
          <div>
            <h3
              className="font-bold text-white text-7xl cursor-pointer line-clamp-2 drop-shadow-lg"
              //   onClick={() => navigate(`${PAGE_PATH.MANGA_DETAIL(1)}`)}
            >
              Chainsaw Man - Digital Colored Comics
            </h3>
            <h4 className="mt-4 text-white text-lg font-semibold">Kasshimo</h4>
          </div>
          <div className="pt-10">
            <div className="flex h-14 gap-4 w-fit">
              <BasicButton className="!w-60 !text-lg">
                Add To Library
              </BasicButton>
              <BasicButton
                className="!w-60 !text-lg !bg-gray-100"
                buttonType={BUTTON_TYPE.NO_COLOR}
                icon={<BiBookOpen size={30} />}
              >
                Start Reading
              </BasicButton>
            </div>
            <div className="mt-2 flex gap-1">
              {/* {item.genres.map((genre) => ( */}
              <BasicTag className="bg-gray100" label={"Suggestive"}></BasicTag>
              <BasicTag className="bg-gray100" label={"Suggestive"}></BasicTag>
              <BasicTag className="bg-gray100" label={"Suggestive"}></BasicTag>
              {/* ))} */}
            </div>
            <div className="mt-2">
              <div className="flex gap-2 items-center">
                <BiStar size={20} color="orange" />
                <span className="text-lg text-orange-500">5.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16">
        <p className="leading-7 w-[70%]">
          My Hero Academia is a Japanese superhero manga series written and
          illustrated by Kōhei Horikoshi. It has been serialized in Shueisha's
          shōnen manga magazine Weekly Shōnen Jump since July 2014, with its
          chapters additionally collected into 38 tankōbon volumes as of June
          2023.
        </p>
        <div>
          <div className="flex gap-10">
            <div className="flex gap-4">
              <div>
                <h4 className="font-bold text-lg">Author</h4>
                {/* <div className="py-1 text-center bg-gray-100 rounded-md text-sm text-gray-700">
                Kudu
              </div> */}

                <div className="flex gap-2">
                  <BasicTag
                    className="mt-2 w-fit py-1 text-center !bg-gray-100 font-normal text-sm text-gray-700"
                    label={"Kudu"}
                  ></BasicTag>
                  <BasicTag
                    className="mt-2 w-fit py-1 text-center !bg-gray-100 font-normal text-sm text-gray-700"
                    label={"Kudu"}
                  ></BasicTag>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-lg">Artist</h4>
                {/* <div className="py-1 text-center bg-gray-100 rounded-md text-sm text-gray-700">
                Kudu
              </div> */}

                <div className="flex gap-2">
                  <BasicTag
                    className="mt-2 w-fit py-1 text-center !bg-gray-100 font-normal text-sm text-gray-700"
                    label={"Kudu"}
                  ></BasicTag>
                  <BasicTag
                    className="mt-2 w-fit py-1 text-center !bg-gray-100 font-normal text-sm text-gray-700"
                    label={"Kudu"}
                  ></BasicTag>
                  <BasicTag
                    className="mt-2 w-fit py-1 text-center !bg-gray-100 font-normal text-sm text-gray-700"
                    label={"Kudu"}
                  ></BasicTag>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-lg">Genres</h4>
                {/* <div className="py-1 text-center bg-gray-100 rounded-md text-sm text-gray-700">
                Kudu
              </div> */}

                <div className="flex gap-2">
                  <BasicTag
                    className="mt-2 w-fit py-1 text-center !bg-gray-100 font-normal text-sm text-gray-700"
                    label={"Kudu"}
                  ></BasicTag>
                  <BasicTag
                    className="mt-2 w-fit py-1 text-center !bg-gray-100 font-normal text-sm text-gray-700"
                    label={"Kudu"}
                  ></BasicTag>
                  <BasicTag
                    className="mt-2 w-fit py-1 text-center !bg-gray-100 font-normal text-sm text-gray-700"
                    label={"Kudu"}
                  ></BasicTag>
                </div>
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold">Chapters</span>
                </div>
                <div className="flex gap-2">
                  <BasicButton
                    className="w-fit !bg-gray-100"
                    buttonType={BUTTON_TYPE.NO_COLOR}
                    icon={<HiOutlineSortAscending />}
                  >
                    Ascending
                  </BasicButton>
                  <BasicButton
                    className="w-fit !bg-gray-100"
                    buttonType={BUTTON_TYPE.NO_COLOR}
                    icon={<HiOutlineSortDescending />}
                  >
                    Descending
                  </BasicButton>
                </div>
              </div>
              <div className="mt-4">
                <Chapter />
                <Chapter />
                <Chapter />
                <Chapter />
                <Chapter />
                <Chapter />
                <Chapter />
                <Chapter />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Chapter = ({ chapter, ...props }) => {
  return (
    <div className="mt-2 flex px-4 py-2 justify-between bg-gray-100 rounded-sm hover:bg-gray-200 cursor-pointer">
      <span className="font-semibold">Chap 56 - END</span>
      <div className="flex gap-2 justify-center items-center">
        <BiTimeFive size={20} />
        <span>5 days ago</span>
      </div>
    </div>
  );
};

export default MangaDetailPage;
