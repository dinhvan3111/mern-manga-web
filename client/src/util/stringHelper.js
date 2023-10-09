import { MANGA_STATUS } from "../common/constants";

const mangaStatusToString = (status) => {
  switch (status) {
    case MANGA_STATUS.ON_GOING:
      return "On going";
    case MANGA_STATUS.ABANDONED:
      return "Abandoned";
    case MANGA_STATUS.COMPLETED:
      return "Completed";
    default:
      return "";
  }
};
export { mangaStatusToString };
