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

function App() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    function handleExprTok() {
      if (user.data && user.tokenExpr === true) {
        toast.warn("Phiên đăng nhập hết hạn");
        // signOut(user?.curFCMToken?.token);

        dispatch(logout());
        navigate(PAGE_PATH.LOGIN);
      }
    }
    handleExprTok();
  }, [user.isExpired]);
  return (
    <>
      <Routes>
        {/* ---------White background layout----------------- */}
        <Route path="/" element={<BasicLayout />}>
          <Route path={PAGE_PATH.HOME} element={<HomePage />} />
          <Route path={PAGE_PATH.LIBRARY} element={<LibraryPage />} />
          <Route
            path={PAGE_PATH.SEARCH_MANGA()}
            element={<SearchMangaPage />}
          />
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
        <Route
          path={PAGE_PATH.PROFILE}
          element={
            <ProtectedRoute pageRole={[ROLE.ADMIN, ROLE.AUTHOR, ROLE.USER]} />
          }
        >
          <Route path={PAGE_PATH.PROFILE} element={<ProfilePage />}></Route>
        </Route>
        <Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>
      </Routes>
    </>
  );
}

export default App;
