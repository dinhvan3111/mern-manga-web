import React, { useEffect, useState } from "react";
import BasicButton from "../../components/button/BasicButton";
import { useForm } from "react-hook-form";
import mangaApi from "../../api/mangaApi";
import { API } from "../../api/apiUrl";
import {
  Checkbox,
  CircularProgress,
  IconButton,
  ListItemText,
  MenuItem,
} from "@mui/material";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import BasicTextField from "../../components/input/BasicTextField";
import genreApi from "../../api/genreApi";
import { AiOutlineUpload } from "react-icons/ai";
import MultiTagSelectDropdown from "../../components/dropdown/MultiTagSelectDropdown";
import { yupResolver } from "@hookform/resolvers/yup";
import { addMangaSchema } from "../../common/form-schema";
import PopupMsg from "../../components/popup/PopupMessage";
import usePopup from "../../hooks/usePopup";
import { SUBMIT_STATUS } from "../../common/constants";

const AddMangaPage = () => {
  const navigate = useNavigate();
  const fileRef = React.useRef(null);
  const {
    handleSubmit,
    control,
    register,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({ resolver: yupResolver(addMangaSchema) });
  const watchFile = watch("thumbnail");
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = React.useState([]);
  const [addMangaMsg, setAddMangaMsg] = useState("");
  const [addMangaStatus, setAddMangaStatus] = useState();
  const {
    open: addStatusModel,
    handleOpenPopup: handleOpenAddStatusModal,
    handleClosePopup: handleCloseAddStatusModal,
  } = usePopup();

  const handleChange = (event) => {
    console.log("change");
    const {
      target: { value },
    } = event;
    setSelectedGenres(typeof value === "string" ? value.split(",") : value);
  };
  const [isFetchingGenres, setIsFetchingGenres] = useState(false);
  const fetchGenres = async () => {
    setIsFetchingGenres(true);
    const res = await genreApi.getAllGenres();
    if (res.success) {
      setGenres(res.data);
    }
    setIsFetchingGenres(false);
  };
  const onSubmit = async (data) => {
    handleOpenAddStatusModal();
    setAddMangaStatus(SUBMIT_STATUS.LOADING);
    const authors = data.authors.split(",");
    const artists = data.artists.split(",");
    const listSelectedGenreIds = selectedGenres.map((item) => item._id);
    const files = data.thumbnail;
    const formData = new FormData();
    Object.keys(files).forEach((key) =>
      formData.append(files.item(key).name, files.item(key))
    );
    try {
      const submitData = {
        name: data.name,
        description: data.description,
        // thumbUrl: publicThumbUrl,
        authors: authors,
        artists: artists,
        transTeam: data.transTeam,
        genres: listSelectedGenreIds,
      };
      const createRes = await mangaApi.addManga(submitData);
      console.log("creat", createRes);
      if (createRes.success) {
        const uploadThumbRes = await mangaApi.uploadMangaThumb(
          createRes.manga._id,
          formData
        );
        setAddMangaMsg("Success");
        setAddMangaStatus(SUBMIT_STATUS.SUCCESS);

        // const res
      } else {
        setAddMangaMsg("Failed");
        setAddMangaStatus(SUBMIT_STATUS.FAILED);
      }
      // console.log(getValues("thumbnail"));
    } catch (error) {
      setAddMangaMsg("Failed");
      setAddMangaStatus(SUBMIT_STATUS.FAILED);
    }
  };
  useEffect(() => {
    fetchGenres();
  }, []);
  return (
    <>
      <div className="page-wrapper">
        <div className="flex gap-4">
          <IconButton onClick={() => navigate(-1)}>
            <BiArrowBack></BiArrowBack>
          </IconButton>
          <h1 className="font-bold text-4xl">Add Manga</h1>
        </div>
        {isFetchingGenres ? (
          <div className="mb-10 flex justify-center items-center">
            <CircularProgress
              style={{
                color: "orange",
              }}
            />
          </div>
        ) : (
          <div className="pb-10">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-10 flex flex-col gap-10 font-semibold text-xl">
                <div className="flex gap-4">
                  <h2 className="basis-1/5 w-full">
                    Manga name <span className="text-orange-500">*</span>
                  </h2>
                  <div className="basis-2/5 w-[50%]">
                    <BasicTextField
                      name="name"
                      control={control}
                      hasErrors={true}
                      errMsg={errors.name ? errors.name.message : null}
                    ></BasicTextField>
                  </div>
                </div>
                <div className="flex gap-4">
                  <h2 className="basis-1/5 w-full">
                    Description <span className="text-orange-500">*</span>
                  </h2>
                  <div className="basis-3/5 w-[50%]">
                    <BasicTextField
                      name="description"
                      multiline={true}
                      inputProps={{ maxLength: 200 }}
                      control={control}
                      hasErrors={true}
                      errMsg={
                        errors.description ? errors.description.message : null
                      }
                    ></BasicTextField>
                  </div>
                </div>
                <div className="flex gap-4">
                  <h2 className="basis-1/5 w-full">Genres</h2>
                  <div className="basis-2/5 min-w-[50%] max-w-full">
                    <MultiTagSelectDropdown
                      control={control}
                      name="genres"
                      items={genres}
                      selectedItems={selectedGenres}
                      handleChange={handleChange}
                      renderValue={(selected) => (
                        <div className="flex gap-2">
                          {selected.map((item) => (
                            <div
                              key={item._id}
                              className="flex gap-1 items-center bg-gray-100 rounded-md p-1"
                            >
                              <span>{item.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      menuItem={(genre) => (
                        <MenuItem key={genre._id} value={genre}>
                          <Checkbox
                            style={{
                              color: "orange",
                            }}
                            checked={selectedGenres.indexOf(genre) > -1}
                          />
                          <ListItemText primary={genre.name} />
                        </MenuItem>
                      )}
                    ></MultiTagSelectDropdown>
                    {/* <BasicTextField name="g" control={control}></BasicTextField> */}
                  </div>
                </div>
                <div className="flex gap-4">
                  <h2 className="basis-1/5 w-full">Authors</h2>
                  <div className="basis-2/5 w-[50%]">
                    <BasicTextField
                      name="authors"
                      control={control}
                    ></BasicTextField>
                  </div>
                </div>
                <div className="flex gap-4">
                  <h2 className="basis-1/5 w-full">Artists</h2>
                  <div className="basis-2/5 w-[50%]">
                    <BasicTextField
                      name="artists"
                      control={control}
                    ></BasicTextField>
                  </div>
                </div>
                <div className="flex gap-4">
                  <h2 className="basis-1/5 w-full">Translate team</h2>
                  <div className="basis-2/5 w-[50%]">
                    <BasicTextField
                      name="transTeam"
                      control={control}
                    ></BasicTextField>
                  </div>
                </div>
                <div className="flex gap-4">
                  <h2 className="basis-1/5 w-full">Thumbnail</h2>
                  <div className="basis-2/5 w-[50%] h-full text-base font-normal">
                    <input
                      name="thumbnail"
                      type="file"
                      ref={fileRef}
                      // encType="multipart/form-data"
                      className="hidden"
                      onChange={(e) => {
                        setValue("thumbnail", e.target?.files, {
                          shouldDirty: true,
                        });
                        // setFile(e.target?.files?.[0]);
                      }}
                      // multiple
                      accept="image/*"
                      control={control}
                      // {...register("img")}
                    />
                    <div className="flex gap-4">
                      <div className="flex flex-col w-full">
                        <BasicTextField
                          disabled
                          placeholder={`${
                            watchFile?.length > 0
                              ? watchFile[0].name
                              : "Choose manga thumbnail"
                          }`}
                          helperText="(Only image files are allowed)"
                          name="thumbnail"
                          className={`${
                            watchFile?.length > 0 ? "truncate" : ""
                          }`}
                          control={control}
                        />
                        {watchFile?.length > 0 ? (
                          <img
                            className="mt-4 w-52 object-contain"
                            src={URL.createObjectURL(watchFile[0])}
                            alt="thumbnail"
                          ></img>
                        ) : (
                          <div className="mt-4 p-4 w-52 h-full rounded-lg border-dashed border-2 border-slate-300">
                            <img
                              className="object-contain"
                              src="/images/no_image/empty_lessons.png"
                              alt="thumbnail"
                            ></img>
                          </div>
                        )}
                      </div>
                      <BasicButton
                        className="!w-fit max-h-[40px]"
                        onClick={() => {
                          fileRef.current.click();
                        }}
                      >
                        <AiOutlineUpload size={30} />
                      </BasicButton>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-10 flex justify-center w-full">
                <BasicButton className="!w-fit" type="submit">
                  Submit
                </BasicButton>
              </div>
            </form>
          </div>
        )}
      </div>
      <PopupMsg
        isOpen={addStatusModel}
        handleClosePopup={handleCloseAddStatusModal}
        status={addMangaStatus}
        hasOk={true}
      >
        {addMangaMsg}
      </PopupMsg>
    </>
  );
};

export default AddMangaPage;
