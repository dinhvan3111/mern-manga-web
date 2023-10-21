import { createSlice } from "@reduxjs/toolkit";
import { MANGA_ENTITY_UI } from "../common/constants";

const mangaEntityUISlice = createSlice({
  name: "mangaUI",
  initialState: {
    mangaEntityUI: MANGA_ENTITY_UI.LIST,
  },
  reducers: {
    changeMangaUI: (state, { payload }) => {
      return {
        ...state,
        mangaEntityUI: payload.value,
      };
    },
  },
});
export const { changeMangaUI } = mangaEntityUISlice.actions;

export default mangaEntityUISlice.reducer;
