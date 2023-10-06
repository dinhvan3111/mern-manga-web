import React, { useRef, useState } from "react";
import { ROLE, USER_MENU } from "../common/constants";
import { PiSignOutBold } from "react-icons/pi";
import { PAGE_PATH } from "../routes/page-path";
import { logout } from "../redux-toolkit/authSlice";
import { BiUser } from "react-icons/bi";
import BasicTag from "./tag/BasicTag";
import { Divider } from "@mui/material";
import BasicButton, { BUTTON_TYPE } from "./button/BasicButton";
import { IoWaterOutline } from "react-icons/io5";
import { AiOutlineSetting } from "react-icons/ai";
import useClickOutside from "../hooks/useClickOutSide";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { show, setShow, nodeRef: hoverRef } = useClickOutside();
  const [coords, setCoords] = useState();
  const ref = useRef(null);
  const showModal = () => {
    console.log(ref.current.getBoundingClientRect());
    setCoords(ref.current.getBoundingClientRect());
    setShow(!show);
  };
  const preferences = [
    {
      value: USER_MENU.PREFERENCES.SETTING,
      title: "Setting",
      icon: <AiOutlineSetting size={30} />,
    },
    {
      value: USER_MENU.PREFERENCES.THEME,
      title: "Theme",
      icon: <IoWaterOutline size={30} />,
    },
  ];

  const authGuestOptions = [
    {
      value: USER_MENU.AUTH_OPTIONS.SIGN_IN,
      title: "Sign in",
      onClick: () => {
        navigate(PAGE_PATH.LOGIN);
      },
    },
    {
      value: USER_MENU.AUTH_OPTIONS.REGISTER,
      title: "Register",
      onClick: () => {
        navigate(PAGE_PATH.REGISTER);
      },
    },
  ];

  const authLoggedInOptions = [
    {
      value: USER_MENU.AUTH_OPTIONS.SIGN_OUT,
      title: "Sign out",
      icon: <PiSignOutBold size={30} />,
      onClick: () => {
        dispatch(logout());
        navigate(PAGE_PATH.LOGIN);
      },
    },
  ];
  const userTagText = (role) => {
    console.log(role === ROLE.USER);
    switch (role) {
      case ROLE.ADMIN:
        return "Admin";
      case ROLE.USER:
        return "User";
      default:
        console.log("default");
        return "";
    }
  };
  return (
    <div ref={hoverRef} className="relative">
      <div
        ref={ref}
        className="p-2 bg-gray-100 rounded-full hover:cursor-pointer"
        onClick={() => showModal()}
      >
        <BiUser size={30} />
      </div>
      {show && (
        <div
          className="absolute bg-gray-100 rounded-md border border-gray-300 "
          style={{
            top: coords.height + 4,
            right: "0px",
          }}
        >
          <div className="px-4 py-2 rounded-md ">
            <div className="flex flex-col px-4 py-4 mb-2 gap-2 justify-center items-center basic-hover no-select">
              {user?.data ? (
                <>
                  <BiUser size={50} />
                  <h3 className="font-bold text-2xl">{user.data.username}</h3>
                  <BasicTag label={userTagText(user?.role)} />
                </>
              ) : (
                <>
                  <BiUser size={50} />
                  <h3 className="font-bold text-2xl">Guest</h3>
                </>
              )}
            </div>
            <Divider></Divider>
            <div className="mt-4 mb-4 flex gap-2">
              {preferences.map((item) => (
                <div
                  key={item.value}
                  className="py-1 px-2 flex gap-1 justify-center items-center basic-hover no-select"
                  onClick={item.onClick}
                >
                  {item.icon}
                  <span className="text-lg font-semibold">{item.title} </span>
                </div>
              ))}
            </div>
            <Divider></Divider>
            <div className="mt-4 mb-2 flex flex-col gap-2">
              {user?.data
                ? authLoggedInOptions.map((item) => (
                    <div
                      key={item.value}
                      className="py-1 px-2 flex gap-1 justify-start items-center basic-hover no-select"
                      onClick={item.onClick}
                    >
                      {item.icon}
                      <span className="text-lg font-semibold">
                        {item.title}{" "}
                      </span>
                    </div>
                  ))
                : authGuestOptions.map((item) => (
                    <BasicButton
                      className="!text-lg"
                      buttonType={
                        item.value === USER_MENU.AUTH_OPTIONS.SIGN_IN
                          ? BUTTON_TYPE.CLASSIC
                          : BUTTON_TYPE.NO_COLOR
                      }
                      onClick={item.onClick}
                    >
                      {item.title}
                    </BasicButton>
                  ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
