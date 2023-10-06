import React, { useState } from "react";
import BasicButton from "../../components/button/BasicButton";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import BasicTextFiled from "../../components/input/BasicTextField";
import { registerSchema } from "../../common/form-schema";
import { useDispatch } from "react-redux";
import { login } from "../../redux-toolkit/authSlice";
import { PAGE_PATH } from "../../routes/page-path";
import { toast } from "react-toastify";
import authApi from "../../api/authApi";

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });
  const onSubmit = async (data) => {
    try {
      const res = await authApi.register({
        username: data.username,
        password: data.password,
      });
      if (res.success) {
        navigate(PAGE_PATH.LOGIN);
        toast.success(
          "Register account successful. Please login to your account"
        );
      } else {
        setErrorMsg(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="card mt-10 text-white px-10 py-5 flex flex-col gap-4 rounded-[4px] border-t-4 border-orange-400">
        <h1 className="text-center text-xl font-semibold">Register</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <h3 className=" text-red-500">{errorMsg}</h3>
            <div className="flex flex-col items-start gap-2">
              <label htmlFor="username" className="font-semibold">
                Username <span className="text-orange-400">*</span>
              </label>
              <BasicTextFiled
                name="username"
                control={control}
                hasErrors={true}
                errMsg={errors.username ? errors.username.message : null}
              ></BasicTextFiled>
            </div>
            <div className="flex flex-col items-start gap-2">
              <label htmlFor="password" className="font-semibold">
                Password <span className="text-orange-400">*</span>
              </label>
              <BasicTextFiled
                type="password"
                name="password"
                control={control}
                hasErrors={true}
                errMsg={errors.password ? errors.password.message : null}
              ></BasicTextFiled>
            </div>
            <div className="flex flex-col items-start gap-2">
              <label htmlFor="confirmPassword" className="font-semibold">
                Confirm password <span className="text-orange-400">*</span>
              </label>
              <BasicTextFiled
                type="password"
                name="confirmPassword"
                control={control}
                hasErrors={true}
                errMsg={
                  errors.confirmPassword ? errors.confirmPassword.message : null
                }
              ></BasicTextFiled>
            </div>
            {/* <div className="flex flex-col items-start gap-2">
                <label htmlFor="password" className="font-semibold">
                  Email <span className="text-orange-400">*</span>
                </label>
                <BasicTextFiled
                  type="email"
                  name="email"
                  control={control}
                ></BasicTextFiled>
              </div> */}
          </div>
          <BasicButton
            type="submit"
            loading={isSubmitting}
            className="!mt-8 !mb-4 w-full"
          >
            Register
          </BasicButton>
        </form>
        <span
          className=" text-orange-400 hover:underline hover:cursor-pointer"
          onClick={() => navigate("/login")}
        >
          « Back to Login
        </span>
      </div>
    </>
  );
};

export default RegisterForm;
