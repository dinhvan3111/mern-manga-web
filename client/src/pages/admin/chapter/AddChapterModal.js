import { useState } from "react";
import chapterApi from "../../../api/chapterApi";
import { toast } from "react-toastify";
import BasicModal from "../../../components/popup/BasicModal";
import { TextField } from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import QUERY_KEY from "../../../common/queryKey";

const AddChapterModal = ({ chapter, mangaId, open, handleClosePopup }) => {
  const isAddMode = !chapter ? true : false;
  const queryClient = useQueryClient();
  const [chapterName, setChapterName] = useState(chapter?.title || "");
  const { isLoading, mutate } = useMutation({
    mutationFn: () => addOrEditChapter(),
    onSuccess: (res) => {
      if (res.success) {
        if (isAddMode) {
          toast.success("Add chapter successful");
        } else {
          toast.success("Update chapter successful");
        }
        queryClient.invalidateQueries(QUERY_KEY.CHAPTER_MANAGEMENT);
        handleClosePopup();
        setChapterName("");
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const addOrEditChapter = async () => {
    if (isAddMode) {
      const data = {
        mangaId,
        title: chapterName,
      };
      const res = await chapterApi.addChapter(data);
      return res;
    } else {
      const data = {
        chapterId: chapter._id,
        title: chapterName,
      };
      const res = await chapterApi.updateChapter(chapter._id, data);
      return res;
    }
  };
  return (
    <BasicModal
      open={open}
      loading={isLoading}
      handleClose={handleClosePopup}
      handleCancel={handleClosePopup}
      handleConfirm={mutate}
      confirmBtnLabel={isAddMode ? "Add" : "Update"}
    >
      <div className="flex flex-col gap-4">
        <h2 className="w-full">Chapter name</h2>
        <TextField
          value={chapterName}
          onChange={(e) => setChapterName(e.target.value)}
          className="!w-[500px]"
          variant="outlined"
          size="small"
          sx={{
            input: {
              color: "black",
            },
            width: "100%",
            "& label.Mui-focused": {
              color: "orange",
            },
            "& .MuiInputBase-root": {
              background: "",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "",
              },
              "&:hover fieldset": {
                borderColor: "orange",
              },
              "&.Mui-focused fieldset": {
                borderColor: "orange",
              },
            },
          }}
          // helperText={helperText}
          // error={!!errMsg}
        />
      </div>
    </BasicModal>
  );
};
export default AddChapterModal;
