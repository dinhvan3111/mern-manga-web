import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { PAGE_PATH } from "../../routes/page-path";
import BasicAppBar from "../BasicAppBar";
import { Box, Drawer, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import { AiOutlineClose } from "react-icons/ai";
import { ACCORDION_NAV_OPTION, ROLE } from "../../common/constants";
import { FiBookmark, FiHome } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux-toolkit/authSlice";

var drawerWidth = 250;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: drawerWidth,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  }),
}));

const accordionFollowingvOptions = [
  {
    value: ACCORDION_NAV_OPTION.FOLLOWING.UPDATE,
    title: "Updates",
    path: "/update",
  },
  {
    value: ACCORDION_NAV_OPTION.FOLLOWING.LIBRARY,
    title: "Library",
    path: PAGE_PATH.LIBRARY,
  },
];

const accordionAdminOptions = [
  {
    value: ACCORDION_NAV_OPTION.ADMIN.MANGA_MANGAEMENT,
    title: "Management",
    path: PAGE_PATH.MANGA_MANAGEMENT,
  },
];

const BasicLayout = ({ textColor, accordionIconColor, ...props }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectTab, setSelectTab] = useState(PAGE_PATH.HOME);
  const [open, setOpen] = React.useState(false);
  const onLogout = () => {
    dispatch(logout());
    navigate(PAGE_PATH.LOGIN);
  };
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        elevation={0}
        color="transparent"
        // sx={{ zIndex: "9999" }}
      >
        <BasicAppBar
          textColor={textColor}
          accordionIconColor={accordionIconColor}
          leftDrawerOpen={open}
          onOpenLeftDrawer={() => setOpen(true)}
        />
      </AppBar>
      <Main open={open}>
        <Outlet></Outlet>
      </Main>
      <Drawer
        position="fixed"
        sx={{
          // width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <BasicDrawer
          selectTab={selectTab}
          setSelectTab={setSelectTab}
          open={open}
          setOpen={setOpen}
        />
      </Drawer>
    </Box>
  );
};

const BasicDrawer = ({ open, setOpen, selectTab, setSelectTab }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  return (
    <div className="h-full">
      <div className="px-4 py-4 bg-gray-200 h-full">
        <div className="flex justify-between gap-4">
          <div
            className="text-2xl font-bold hover:cursor-pointer no-select"
            onClick={() => navigate(PAGE_PATH.HOME)}
          >
            VzManga
          </div>
          <IconButton onClick={() => setOpen(false)}>
            <AiOutlineClose />
          </IconButton>
        </div>
        <div className="w-full">
          <div className="mt-4">
            <div
              className={`no-select py-1 px-2 flex gap-2 rounded-md cursor-pointer ${
                selectTab === PAGE_PATH.HOME
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "hover:bg-gray-300"
              }`}
              onClick={() => {
                setSelectTab(PAGE_PATH.HOME);
                navigate(PAGE_PATH.HOME);
              }}
            >
              <FiHome size={20} />
              <span className="font-bold">Home</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="py-1 px-2 flex gap-2 no-select">
              <FiBookmark size={20} />
              <span className="font-bold">
                {user?.data?.role === ROLE.ADMIN ? "Admin" : "Following"}
              </span>
            </div>
            {user?.data?.role === ROLE.ADMIN
              ? accordionAdminOptions.map((item) => (
                  <DrawerTab
                    key={item.value}
                    item={item}
                    selectTab={selectTab}
                    setSelectTab={setSelectTab}
                  />
                ))
              : accordionFollowingvOptions.map((item) => (
                  <DrawerTab
                    item={item}
                    selectTab={selectTab}
                    setSelectTab={setSelectTab}
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DrawerTab = ({ item, selectTab, setSelectTab }) => {
  const navigate = useNavigate();
  return (
    <div
      key={item.value}
      className={`py-1 px-2 flex gap-1 justify-start items-center hover:bg-gray-300 cursor-pointer rounded-md no-select ${
        selectTab === item.path
          ? "bg-orange-500 hover:bg-orange-600 text-white"
          : "hover:bg-gray-300"
      }`}
      onClick={() => {
        setSelectTab(item.path);
        //set tab here
        navigate(item.path);
      }}
    >
      <span className="text-base">{item.title} </span>
    </div>
  );
};

export default BasicLayout;
