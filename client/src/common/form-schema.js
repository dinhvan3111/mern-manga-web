import * as yup from "yup";
import { CONFIRM_PASSWORD_ERROR_MSG, PASSWORD_ERR_MSG } from "./error-message";

// ========= Obj =========
// const emailObj = yup
//   .string()
//   .email("Email không hợp lệ")
//   .required("Vui lòng nhập email");

const pwdObj = yup
  .string()
  .trim()
  .required(PASSWORD_ERR_MSG.REQIRED)
  .trim()
  .min(8, PASSWORD_ERR_MSG.MIN_LENGTH)
  .when("password-lowercase", (password, field) => {
    if (!/[a-z]+/.test(password)) {
      return field.matches(/[a-z]+/, PASSWORD_ERR_MSG.LOWER_CASE_REQ);
    }
  })
  .when("password-number", (password, field) => {
    if (!/[0-9]+/.test(password)) {
      return field.matches(/[0-9]+/, PASSWORD_ERR_MSG.NUMBER_REQ);
    }
  })
  .when("password-uppercase", (password, field) => {
    if (!/[A-Z]+/.test(password)) {
      return field.matches(/[A-Z]+/, PASSWORD_ERR_MSG.UPPER_CASE_REQ);
    }
  })
  .when("password-special", (password, field) => {
    if (!/[@$!%*#?&]+/.test(password)) {
      return field.matches(/[@$!%*#?&]+/, PASSWORD_ERR_MSG.SPECIAL_CHAR_REQ);
    }
  });
const cPwdObj = (ref = "password") =>
  yup
    .string()
    .trim()
    .required(CONFIRM_PASSWORD_ERROR_MSG.REQUIRED)
    .oneOf([yup.ref(ref), null], CONFIRM_PASSWORD_ERROR_MSG.NOT_MATCH);

//  ====================Schema===========================

const registerSchema = yup.object({
  username: yup.string().required("Please enter your username").trim(),
  password: pwdObj,
  // addr: yup.string().required("Vui lòng nhập địa chỉ"),
  confirmPassword: cPwdObj(),
});

const addMangaSchema = yup.object({
  name: yup.string().required("Please enter manga name").trim(),
  description: yup.string().required("Please enter manga description").trim(),
});

export { registerSchema, addMangaSchema };
