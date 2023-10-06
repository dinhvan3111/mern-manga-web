import { AiOutlineSearch } from "react-icons/ai";
import useClickOutside from "../../hooks/useClickOutSide";
import { useEffect, useRef, useState } from "react";
import { IoSearchCircleOutline } from "react-icons/io5";
import { CircularProgress } from "@mui/material";
import { useDebounce } from "use-debounce";

const BasicSearch = ({
  searchRef = null,
  title,
  className = "",
  classNameWrapper = "",
  dropdownWrapperClassName = "",
  showResultDropdown = false,
  dropdownData = [],
  onChange = (value) => {},
  noItemText = "Không có kết quả",
  delay = 500,
  fullWidth = false,
  itemBuilder = (item) => <div></div>,
  isLoading = false,
  handleKeyDown = (e) => {},
  autoComplete = "off",
  handleOnClickSearchResultItem,
  showSearchResultItem = false,
  keyword,
  setKeyWord,
}) => {
  const [searchKey, setSearchKey] = useState("");
  const [debounceKeyword] = useDebounce(keyword ? keyword : searchKey, delay);
  const [coords, setCoords] = useState({});
  const notInitialRender = useRef(false);
  const { show, setShow, nodeRef } = useClickOutside();
  const handleOnChangeKeyword = (e) => {
    if (setKeyWord) setKeyWord(e.target.value);
    else setSearchKey(e.target.value);
  };
  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") {
      setShow(false);
    }
    handleKeyDown(e);
  };
  const onClickSearchInput = (e) => {
    if (e.target.value) {
      setCoords(nodeRef.current?.getBoundingClientRect());
      setShow(true);
    }
  };
  useEffect(() => {
    if (notInitialRender.current) {
      onChange(debounceKeyword);
      setCoords(nodeRef.current?.getBoundingClientRect());
      if (!searchRef) {
        setShow(debounceKeyword !== "");
        return;
      }
      if (searchRef.current === document.activeElement)
        setShow(debounceKeyword !== "");
    } else {
      notInitialRender.current = true;
    }
  }, [debounceKeyword]);
  return (
    <div
      ref={nodeRef}
      className=" relative bg-gray-100 max-w-3xl flex items-center h-fit rounded-md"
    >
      {/* <input
      type="text"
      className="px-4 py-1 w-full rounded-md bg-gray-200 max-h-12 focus:!border-2 focus:!border-orange-500"
      placeholder="Search"
    ></input> */}
      <input
        ref={searchRef}
        type="text"
        className={`w-56 transition-all duration-300 ease-out focus:w-[500px] max-h-12 pr-3 px-4 py-1 !pl-10 text-sm sm:leading-6 font-semibold text-gray-900 rounded-md bg-gray-100 focus:bg-white focus:ring-blue-100 focus:border-blue-500  `}
        placeholder="Search"
        onChange={handleOnChangeKeyword}
        onClick={onClickSearchInput}
        onKeyDown={handleOnKeyDown}
        autoComplete={autoComplete}
        value={keyword}
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <AiOutlineSearch />
      </div>
      {/* <div className="px-2 rounded-md absolute m-auto right-0 top-0 bottom-0 flex items-center bg-gray-200 h-fit">
      Ctrl
    </div> */}
      {show && (
        <DropdownList
          keyword={keyword}
          coords={coords}
          dropdownData={dropdownData}
          noItemText={noItemText}
          itemBuilder={itemBuilder}
          wrapperClassName={dropdownWrapperClassName}
          isLoading={isLoading}
          setShow={setShow}
          handleOnClickSearchResultItem={handleOnClickSearchResultItem}
          showSearchResultItem={showSearchResultItem}
        ></DropdownList>
      )}
    </div>
  );
};

const DropdownList = ({
  keyword,
  coords,
  dropdownData,
  noItemText = "",
  itemBuilder = (item) => <div></div>,
  wrapperClassName = "",
  isLoading = false,
  handleOnClickSearchResultItem,
  setShow,
  showSearchResultItem,
}) => {
  if (typeof document === "undefined") return null;
  return isLoading ? (
    <div className="p-2 absolute bg-white z-50 rounded-md border border-gray-300 shadow-md w-full flex justify-center items-center">
      <CircularProgress size="10"></CircularProgress>
    </div>
  ) : (
    <div
      className={`absolute bg-white -500 z-50 rounded-md border border-gray-300 shadow-md ${wrapperClassName}`}
      style={{
        // left: coords.left,
        top: coords?.height + 4,
        width: coords?.width,
      }}
    >
      {dropdownData.length !== 0 ? (
        <>{dropdownData.map((item) => itemBuilder(item))}</>
      ) : (
        <div className="p-4 text-center">
          <h1 className="text-slate-400">{noItemText}</h1>
        </div>
      )}
      {showSearchResultItem && (
        <div
          className="flex gap-2 p-4 text-sm sm:text-md cursor-pointer hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation();
            setShow(false);
            handleOnClickSearchResultItem();
          }}
        >
          <IoSearchCircleOutline></IoSearchCircleOutline>
          <h1 className="">
            Tìm kiếm cho từ khóa{" "}
            <span className="font-semibold">"{keyword}"</span>
          </h1>
        </div>
      )}
    </div>
  );
};

export default BasicSearch;
