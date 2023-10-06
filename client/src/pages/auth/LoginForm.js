import React, { useEffect, useState } from "react";
import BasicButton from "../../components/button/BasicButton";
import "./AuthPage.css";
import BasicTextFiled from "../../components/input/BasicTextField";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@mui/material";
import authApi from "../../api/authApi";
import { login } from "../../redux-toolkit/authSlice";
import { PAGE_PATH } from "../../routes/page-path";
import { toast } from "react-toastify";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    register,
    formState: { isSubmitting },
  } = useForm();
  const [errorMsg, setErrorMsg] = useState("");
  const onSubmit = async (data) => {
    try {
      const res = await authApi.login({
        username: data.username,
        password: data.password,
      });
      if (res.success) {
        dispatch(login(res.data));
        navigate(PAGE_PATH.HOME);
        toast.success("Login successful");
      } else {
        setErrorMsg(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // useEffect(() => {
  //   window.addEventListener('');
  // }, []);
  return (
    <>
      <div className="card mt-10 text-white px-10 py-5 flex flex-col gap-4 rounded-[4px] border-t-4 border-orange-400">
        <h1 className="text-center text-xl font-semibold">
          Sign in to your account
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <h3 className=" text-red-500">{errorMsg}</h3>
            <div className="flex flex-col items-start gap-2">
              <label htmlFor="username" className="font-semibold">
                Username or email
              </label>
              <BasicTextFiled
                name="username"
                control={control}
              ></BasicTextFiled>
            </div>
            <div className="flex flex-col items-start gap-2">
              <label htmlFor="password" className="font-semibold">
                Password
              </label>
              <BasicTextFiled
                type="password"
                name="password"
                control={control}
              ></BasicTextFiled>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="flex gap-1">
              <input
                control={control}
                type="checkbox"
                id="vehicle1"
                name="remember"
                value="remember"
                {...register("remember")}
              />
              <span className="text-sm">Remember me</span>
            </div>

            <span
              className="text-orange-400 hover:underline hover:cursor-pointer"
              // onClick={() => navigate("/")}
            >
              Forgot password
            </span>
          </div>
          <BasicButton
            type="submit"
            loading={isSubmitting}
            className="!mt-8 !mb-4 w-full"
          >
            Sign in
          </BasicButton>
        </form>
      </div>
      <div className="px-[35px] py-[15px] text-gray-300 bg-gray-700 flex justify-center gap-4">
        New user?
        <span
          className="text-orange-400 hover:underline hover:cursor-pointer"
          onClick={() => {
            navigate("/register");
          }}
        >
          Register
        </span>
      </div>
    </>
  );
};

export default LoginForm;
