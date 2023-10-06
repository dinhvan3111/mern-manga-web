import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { PAGE_PATH } from "../../routes/page-path";
const ProtectedRoute = ({
  path,
  element,
  stopWhenLoggedIn = false,
  pageRole = [],
  ...props
}) => {
  const { user } = useSelector((state) => state.auth);
  const isLoggedIn = user?.token ? true : false;
  if (!isLoggedIn && !stopWhenLoggedIn) {
    console.log("run redirect login");
    return <Navigate to={PAGE_PATH.LOGIN} replace />;
  }

  if (isLoggedIn && stopWhenLoggedIn) {
    console.log("run redirect home");
    return <Navigate to={PAGE_PATH.HOME} replace />;
  }

  if (isLoggedIn && !pageRole.includes(user?.data?.role)) {
    return <Navigate to={PAGE_PATH.NOT_FOUND} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
