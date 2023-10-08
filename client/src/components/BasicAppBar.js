import { IconButton } from "@mui/material";
import { BiMenuAltLeft } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { PAGE_PATH } from "../routes/page-path";
import BasicSearch from "./search/BasicSearch";
import UserProfile from "./UserProfile";
import { useEffect, useState } from "react";

const BasicAppBar = ({
  leftDrawerOpen,
  textColor,
  accordionIconColor,
  onOpenLeftDrawer = () => {},
  ...props
}) => {
  const navigate = useNavigate();
  const [top, setTop] = useState(true);

  useEffect(() => {
    const scrollHandler = () => {
      window.scrollY > 10 ? setTop(false) : setTop(true);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);
  return (
    <div
      className={`transition-all sticky top-0 z-50 ${
        !top && `bg-white border-b-2 border-orange-500 shadow-md`
      }`}
    >
      <div className="px-16 py-4 flex justify-between items-center">
        <div className={`${leftDrawerOpen ? "invisible" : ""} flex gap-4`}>
          <IconButton onClick={() => onOpenLeftDrawer()}>
            <BiMenuAltLeft color={!top ? "" : accordionIconColor} />
          </IconButton>
          <div
            className={`text-2xl font-bold hover:cursor-pointer no-select ${
              !top ? "" : `${textColor}`
            } `}
            onClick={() => navigate(PAGE_PATH.HOME)}
          >
            VzManga
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <BasicSearch />
          <UserProfile />
        </div>
      </div>
    </div>
  );
};

export default BasicAppBar;
