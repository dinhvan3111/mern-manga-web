import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { PAGE_PATH } from "./routes/page-path";
import AuthPage from "./pages/auth/AuthPage";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import ProfilePage from "./pages/profile/ProfilePage";
import { logout } from "./redux-toolkit/authSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { ROLE } from "./common/constants";
import MangaDetailPage from "./pages/manga/MangaDetailPage";
import BasicLayout from "./components/layout/BasicLayout";
import NotFoundPage from "./pages/NotFoundPage";
import LibraryPage from "./pages/library/LibraryPage";
import SearchMangaPage from "./pages/manga/SearchMangaPage";
import AddMangaPage from "./pages/admin/AddMangaPage";
import MangaMangament from "./pages/admin/MangaMangament";
import ReadChapter from "./pages/chapter/ReadChapter";
import ChapterMangement from "./pages/admin/chapter/ChapterMangement";

function App() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    function handleExprTok() {
      if (user?.data && user?.token.isExpired === true) {
        toast.warn("Login session expired");
        // signOut(user?.curFCMToken?.token);

        dispatch(logout());
        navigate(PAGE_PATH.LOGIN);
      }
    }
    handleExprTok();
  }, [user?.token]);
  return (
    <>
      <Routes>
        {/* ---------White background layout----------------- */}
        <Route path="/" element={<BasicLayout />}>
          <Route path={PAGE_PATH.HOME} element={<HomePage />} />
          <Route
            path={PAGE_PATH.LIBRARY}
            element={<ProtectedRoute pageRole={[ROLE.AUTHOR, ROLE.USER]} />}
          >
            <Route path={PAGE_PATH.LIBRARY} element={<LibraryPage />}></Route>
          </Route>
          <Route
            path={PAGE_PATH.SEARCH_MANGA()}
            element={<SearchMangaPage />}
          />
          <Route
            path={PAGE_PATH.PROFILE}
            element={
              <ProtectedRoute pageRole={[ROLE.ADMIN, ROLE.AUTHOR, ROLE.USER]} />
            }
          >
            <Route path={PAGE_PATH.PROFILE} element={<ProfilePage />}></Route>
          </Route>
          <Route
            path={PAGE_PATH.MANGA_MANAGEMENT}
            element={<ProtectedRoute pageRole={[ROLE.ADMIN]} />}
          >
            <Route
              path={PAGE_PATH.MANGA_MANAGEMENT}
              element={<MangaMangament />}
            ></Route>
          </Route>
          <Route
            path={PAGE_PATH.ADD_MANGA}
            element={<ProtectedRoute pageRole={[ROLE.ADMIN]} />}
          >
            <Route
              path={PAGE_PATH.ADD_MANGA}
              element={<AddMangaPage />}
            ></Route>
          </Route>
          <Route
            path={PAGE_PATH.EDIT_MANGA()}
            element={<ProtectedRoute pageRole={[ROLE.ADMIN]} />}
          >
            <Route
              path={PAGE_PATH.EDIT_MANGA()}
              element={<AddMangaPage />}
            ></Route>
          </Route>
          <Route
            path={PAGE_PATH.CHAPTERS_MANAGEMENT()}
            element={<ProtectedRoute pageRole={[ROLE.ADMIN]} />}
          >
            <Route
              path={PAGE_PATH.CHAPTERS_MANAGEMENT()}
              element={<ChapterMangement />}
            ></Route>
          </Route>
        </Route>
        {/*----------Transparent background layout-------------- */}
        <Route
          path="/"
          element={
            <BasicLayout textColor="text-white" accordionIconColor="white" />
          }
        >
          <Route
            path={PAGE_PATH.MANGA_DETAIL()}
            element={<MangaDetailPage />}
          />
        </Route>

        {/*----------No layout-------------- */}
        <Route path={PAGE_PATH.READ_CHAPTER()} element={<ReadChapter />} />
        <Route
          path={PAGE_PATH.REGISTER}
          element={<AuthPage authRoute="register" />}
        />
        <Route
          path={PAGE_PATH.LOGIN}
          element={<ProtectedRoute stopWhenLoggedIn={true} />}
        >
          <Route
            path={PAGE_PATH.LOGIN}
            element={<AuthPage authRoute="login" />}
          />
        </Route>
        <Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>
      </Routes>
    </>
  );
}

export default App;
