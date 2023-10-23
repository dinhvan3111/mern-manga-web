import React, { useEffect, useLayoutEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { PAGE_PATH } from "../../routes/page-path";
import BasicAppBar from "../BasicAppBar";
import { Box, Drawer, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import { AiOutlineClose } from "react-icons/ai";
import {
  ACCORDION_NAV_OPTION,
  DRAWER_TYPE,
  ROLE,
} from "../../common/constants";
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
  // {
  //   value: ACCORDION_NAV_OPTION.FOLLOWING.UPDATE,
  //   title: "Updates",
  //   path: "/update",
  // },
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

const MemoOutlet = React.memo(() => <Outlet></Outlet>);

const BasicLayout = ({ textColor, accordionIconColor, ...props }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const drawerType = React.useRef(DRAWER_TYPE.RESPONSIVE);
  const onLogout = () => {
    dispatch(logout());
    navigate(PAGE_PATH.LOGIN);
  };

  useLayoutEffect(() => {
    var browserWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    if (browserWidth < 1024) {
      drawerType.current = DRAWER_TYPE.TEMPORARY;
    } else {
      drawerType.current = DRAWER_TYPE.RESPONSIVE;
    }
  }, []);
  useEffect(() => {
    function handleResize() {
      var browserWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      if (browserWidth < 1024) {
        drawerType.current = DRAWER_TYPE.TEMPORARY;
      } else {
        drawerType.current = DRAWER_TYPE.RESPONSIVE;
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      <Box
        sx={() => {
          return drawerType.current === DRAWER_TYPE.RESPONSIVE
            ? { display: "flex" }
            : {};
        }}
      >
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
        <Main
          open={drawerType.current === DRAWER_TYPE.RESPONSIVE ? open : false}
        >
          <MemoOutlet />
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
          variant={
            drawerType.current === DRAWER_TYPE.RESPONSIVE
              ? "persistent"
              : "temporary"
          }
          anchor="left"
          open={open}
        >
          <BasicDrawer open={open} setOpen={setOpen} />
        </Drawer>
      </Box>
      {/* {drawerType.current === DRAWER_TYPE.TEMPORARY && (
        <>
          <BasicAppBar
            textColor={textColor}
            accordionIconColor={accordionIconColor}
            leftDrawerOpen={open}
            onOpenLeftDrawer={() => setOpen(true)}
          />
          <MemoOutlet />
          <Drawer
            anchor="left"
            open={open}
            onClose={setOpen}
            PaperProps={{
              sx: { width: "50%" },
            }}
          >
            <BasicDrawer open={open} setOpen={setOpen} />
          </Drawer>
        </>
      )} */}
    </>
  );
};

const activeNavLinkStyle = ({ isActive }) => ({
  padding: "4px 8px",
  color: isActive ? "white" : "black",
  background: isActive ? "rgb(249, 115, 22)" : "",
  borderRadius: "6px",
  width: "100%",
  display: "inline-block",
});

const BasicDrawer = ({ open, setOpen }) => {
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
            <NavLink to={PAGE_PATH.HOME} style={activeNavLinkStyle}>
              <div className="flex gap-2 items-center">
                <FiHome size={20} />
                <span className="font-bold">Home</span>
              </div>
            </NavLink>
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
                  <DrawerTab key={item.value} item={item} />
                ))
              : accordionFollowingvOptions.map((item) => (
                  <DrawerTab key={item.value} item={item} />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DrawerTab = ({ item }) => {
  return (
    <NavLink to={item.path} style={activeNavLinkStyle}>
      {item.title}
    </NavLink>
  );
};

export default BasicLayout;
