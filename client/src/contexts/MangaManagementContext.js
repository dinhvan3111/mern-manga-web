import { createContext, useContext, useState } from "react";

const MangaManagementContext = createContext();
function MangaManagementProvider(props) {
  const [mangaList, setMangaList] = useState([]);
  const value = { mangaList, setMangaList };
  return (
    <MangaManagementContext.Provider
      value={value}
      {...props}
    ></MangaManagementContext.Provider>
  );
}

function useMangaManagement() {
  const context = useContext(MangaManagementContext);
  if (typeof context === "undefined")
    throw new Error(
      "useMangaManagement must be used within MangaManagementProvider"
    );
  return context;
}
export { MangaManagementProvider, useMangaManagement };
