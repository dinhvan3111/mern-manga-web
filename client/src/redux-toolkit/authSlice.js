import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {},
  },
  reducers: {
    login: (state, { payload }) => {
      return {
        ...state,
        user: {
          data: payload.user,
          token: {
            accessToken: payload.accessToken,
            isExpired: false,
          },
        },
      };
    },

    logout: (state) => ({
      ...state,
      user: {},
    }),
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
