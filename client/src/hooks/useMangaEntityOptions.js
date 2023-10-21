import { AiOutlineUnorderedList } from "react-icons/ai";
import { MdOutlineWindow } from "react-icons/md";
import { MANGA_ENTITY_UI } from "../common/constants";
import { useState } from "react";
import SearchResultItem from "../components/mangaEntity/SearchResultItem";
import MangaThumbnailCoverItem from "../components/mangaEntity/MangaThumbnailCoverItem";

const mangaEntityUIType = [
  {
    value: MANGA_ENTITY_UI.LIST,
    icon: <AiOutlineUnorderedList size={25} />,
  },
  {
    value: MANGA_ENTITY_UI.THUMBNAIL_COVER,
    icon: <MdOutlineWindow size={25} />,
  },
];

const useMangaEntityOptions = () => {
  const [listManga, setListManga] = useState([]);
  const [selectedMangaEntityUI, setSelectedMangaEntityUI] = useState(
    MANGA_ENTITY_UI.LIST
  );
  const renderMangaEntityUI = (type) => {
    switch (type) {
      case MANGA_ENTITY_UI.LIST:
        return (
          <div className="flex flex-col gap-4">
            {listManga?.map((manga, index) => (
              <SearchResultItem key={index} manga={manga} />
            ))}
          </div>
        );
      case MANGA_ENTITY_UI.THUMBNAIL_COVER:
        return (
          <div className="grid grid-cols-6 gap-2">
            {listManga?.map((manga, index) => (
              <MangaThumbnailCoverItem key={index} manga={manga} />
            ))}
          </div>
        );
      default:
        return <></>;
    }
  };
  const renderMenuOptions = () => (
    <div className="flex bg-gray-200">
      {mangaEntityUIType.map((item) => (
        <div
          key={item.value}
          className={`p-2 cursor-pointer transition-all ${
            selectedMangaEntityUI === item.value ? "bg-black text-white" : ""
          }`}
          onClick={() => setSelectedMangaEntityUI(item.value)}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
  return {
    listManga,
    setListManga,
    selectedMangaEntityUI,
    setSelectedMangaEntityUI,
    renderMenuOptions,
    renderMangaEntityUI,
  };
};
export default useMangaEntityOptions;
