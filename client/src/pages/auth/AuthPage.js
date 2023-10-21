import React from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./AuthPage.css";
import { useNavigate } from "react-router-dom";
import { PAGE_PATH } from "../../routes/page-path";

const AuthPage = ({ authRoute }) => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        // height: "100vh",
        backgroundImage: `url(${"/images/auth_page_background.png"})`,
      }}
      className="container auth-bg flex justify-center items-center"
    >
      <div className="w-[500px]">
        <div
          className="text-center text-white text-3xl font-semibold cursor-pointer no-select"
          onClick={() => navigate(PAGE_PATH.HOME)}
        >
          VzManga
        </div>
        {authRoute === "login" ? (
          <LoginForm></LoginForm>
        ) : (
          <RegisterForm></RegisterForm>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
