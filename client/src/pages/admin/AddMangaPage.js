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
import { useMatch, useNavigate } from "react-router-dom";
import BasicTextField from "../../components/input/BasicTextField";
import genreApi from "../../api/genreApi";
import { AiOutlineUpload } from "react-icons/ai";
import MultiTagSelectDropdown from "../../components/dropdown/MultiTagSelectDropdown";
import { yupResolver } from "@hookform/resolvers/yup";
import { addMangaSchema } from "../../common/form-schema";
import PopupMsg from "../../components/popup/PopupMessage";
import usePopup from "../../hooks/usePopup";
import { SUBMIT_STATUS } from "../../common/constants";
import { PAGE_PATH } from "../../routes/page-path";

const AddMangaPage = () => {
  const addMatch = useMatch(PAGE_PATH.ADD_MANGA);
  const editMatch = useMatch(PAGE_PATH.EDIT_MANGA());
  const mangaId = editMatch?.params.id;
  const isAddPage = Boolean(addMatch);
  const navigate = useNavigate();
  const fileRef = React.useRef(null);
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    reset,
    formState: { isSubmitting, errors, isDirty, isSubmitSuccessful },
  } = useForm({ resolver: yupResolver(addMangaSchema) });
  const [manga, setManga] = useState();
  const watchFile = watch("thumbnail");
  const watchGenres = watch("genres", []);
  const [genres, setGenres] = useState([]);
  const [addMangaMsg, setAddMangaMsg] = useState("");
  const [addMangaStatus, setAddMangaStatus] = useState();
  const [isFetchingGenres, setIsFetchingGenres] = useState(
    isAddPage ? true : false
  );
  const [isLoading, setIsLoading] = useState(isAddPage ? false : true);
  const {
    open: addStatusModel,
    handleOpenPopup: handleOpenAddStatusModal,
    handleClosePopup: handleCloseAddStatusModal,
  } = usePopup();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setValue("genres", typeof value === "string" ? value.split(",") : value, {
      shouldDirty: true,
    });
  };
  const setFormValue = (manga) => {
    let defaultValues = {};
    defaultValues.name = manga?.name;
    defaultValues.description = manga?.description;
    defaultValues.genres = manga?.genres.map((genre) => genre.name);
    defaultValues.authors = manga.authors.join(",");
    defaultValues.artists = manga.artists.join(",");
    defaultValues.transTeam = manga.transTeam;
    reset({ ...defaultValues });
    // if (manga) {
    //   setValue("name", manga.name);
    //   setValue("description", manga.description);
    //   // setValue("thumbnail", manga.thumbUrl);
    //   setValue("authors", manga.authors.join(","));
    //   setValue("artists", manga.artists.join(","));
    //   setValue("transTeam", manga.transTeam);
    // setSelectedGenres(manga.genres);
    setManga(manga);
    // }
  };
  const fetchGenres = async () => {
    setIsFetchingGenres(true);
    const res = await genreApi.getAllGenres();
    if (res.success) {
      setGenres(res.data);
    }
    setIsFetchingGenres(false);
  };
  const resetFileds = () => {
    if (addMangaStatus === SUBMIT_STATUS.FAILED) return;
    if (isAddPage) {
      reset();
    } else {
      reset({}, { keepValues: true });
    }
  };
  const fetchMangaDetail = async (id) => {
    setIsLoading(true);
    const res = await mangaApi.getMangaById(id);
    if (res.success === true) {
      setFormValue(res.data.manga);
    }
    setIsLoading(false);
  };
  const addManga = async (formData, submitData) => {
    try {
      const createRes = await mangaApi.addManga(submitData);
      if (createRes.success) {
        // If thumbnail not empty
        if (!formData.entries().next().done) {
          const uploadThumbRes = await mangaApi.uploadMangaThumb(
            createRes.manga._id,
            formData
          );
        }
        setAddMangaMsg("Add manga success");
        setAddMangaStatus(SUBMIT_STATUS.SUCCESS);
      } else {
        setAddMangaMsg("Add manga failed");
        setAddMangaStatus(SUBMIT_STATUS.FAILED);
      }
    } catch (error) {
      setAddMangaMsg("Failed");
      setAddMangaStatus(SUBMIT_STATUS.FAILED);
    }
  };
  const updateManga = async (mangaId, formData, submitData) => {
    try {
      const createRes = await mangaApi.updateManga(mangaId, submitData);
      if (createRes.success) {
        // If thumbnail not empty
        if (!formData.entries().next().done) {
          const uploadThumbRes = await mangaApi.uploadMangaThumb(
            createRes.manga._id,
            formData
          );
        }
        setAddMangaMsg("Update manga success");
        setAddMangaStatus(SUBMIT_STATUS.SUCCESS);
      } else {
        setAddMangaMsg("Update manga failed");
        setAddMangaStatus(SUBMIT_STATUS.FAILED);
      }
    } catch (error) {
      setAddMangaMsg("Failed");
      setAddMangaStatus(SUBMIT_STATUS.FAILED);
    }
  };
  const onSubmit = async (data) => {
    handleOpenAddStatusModal();
    setAddMangaStatus(SUBMIT_STATUS.LOADING);
    const files = data.thumbnail;
    const formData = new FormData();
    Object.keys(files).forEach((key) =>
      formData.append(files.item(key).name, files.item(key))
    );
    const submitData = {
      name: data.name,
      description: data.description,
      // thumbUrl: publicThumbUrl,
      authors: data.authors.split(","),
      artists: data.artists.split(","),
      transTeam: data.transTeam,
      genres: genres
        .filter((item) =>
          getValues("genres").some((genre) => genre === item.name)
        )
        .map((genre) => genre._id),
    };
    if (isAddPage) {
      await addManga(formData, submitData);
    } else {
      await updateManga(mangaId, formData, submitData);
    }
  };
  useEffect(() => {
    resetFileds();
  }, [isSubmitSuccessful]);
  useEffect(() => {
    if (!isAddPage) {
      fetchMangaDetail(mangaId);
    }
    fetchGenres();
  }, [mangaId, isAddPage]);
  return (
    <>
      <div className="page-wrapper">
        <div className="flex gap-4">
          <IconButton onClick={() => navigate(-1)}>
            <BiArrowBack></BiArrowBack>
          </IconButton>
          <h1 className="font-bold text-4xl">
            {isAddPage ? "Add Manga" : "Edit Manga"}
          </h1>
        </div>
        {isLoading || isFetchingGenres ? (
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
                      inputProps={{ maxLength: 1000 }}
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
                      items={genres.map((item) => item.name)}
                      selectedItems={watchGenres}
                      handleChange={handleChange}
                      renderValue={(selected) => (
                        <div className="flex gap-2">
                          {selected.map((item) => (
                            <div
                              key={item}
                              className="flex gap-1 items-center bg-gray-100 rounded-md p-1"
                            >
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      menuItem={(genre) => (
                        <MenuItem key={genre} value={genre}>
                          <Checkbox
                            style={{
                              color: "orange",
                            }}
                            checked={watchGenres?.indexOf(genre) > -1}
                          />
                          <ListItemText primary={genre} />
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
                        {manga?.thumbUrl || watchFile ? (
                          watchFile ? (
                            <img
                              className="mt-4 w-52 object-contain"
                              src={URL.createObjectURL(watchFile[0])}
                              alt="thumbnail"
                            ></img>
                          ) : (
                            <img
                              className="mt-4 w-52 object-contain"
                              src={manga?.thumbUrl}
                              alt="thumbnail"
                            ></img>
                          )
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
                <BasicButton
                  disabled={!isDirty}
                  loading={isSubmitting}
                  className="!w-fit"
                  type="submit"
                >
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
