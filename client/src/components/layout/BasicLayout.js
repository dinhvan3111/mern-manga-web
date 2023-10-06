import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { PAGE_PATH } from "../../routes/page-path";

const BasicLayout = (props) => {
  return (
    <>
      <div></div>
      <Outlet></Outlet>
    </>
  );
};

export default BasicLayout;
