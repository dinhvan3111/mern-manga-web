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
            refreshToken: payload.refreshToken,
            isExpired: false,
          },
        },
      };
    },

    logout: (state) => ({
      ...state,
      user: {},
    }),
    updateToken: (state, { payload }) => ({
      ...state,
      user: {
        ...state.user,
        token: {
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
          isExpired: false,
        },
      },
    }),
    invalidateToken: (state) => ({
      ...state,
      user: {
        ...state.user,
        token: {
          ...state.user.token,
          isExpired: true,
        },
      },
    }),
  },
});

export const { login, logout, invalidateToken, updateToken } =
  authSlice.actions;

export default authSlice.reducer;
