import { dateToTs, getDateDiff } from "../../../util/timeHelper";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MultipleImageBox from "../../../components/MultiImageBox";
import ConfirmPopup from "../../../components/popup/ConfirmPopup";
import { SUBMIT_STATUS } from "../../../common/constants";
import PopupMsg from "../../../components/popup/PopupMessage";
import { IconButton, styled } from "@mui/material";
import { GrNext } from "react-icons/gr";
import { useEffect, useState } from "react";
import usePopup from "../../../hooks/usePopup";
import { toast } from "react-toastify";
import chapterApi from "../../../api/chapterApi";
import { BiTimeFive } from "react-icons/bi";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import BasicButton, {
  BUTTON_TYPE,
} from "../../../components/button/BasicButton";
import AddChapterModal from "./AddChapterModal";
import { useMutation, useQueryClient } from "react-query";
import QUERY_KEY from "../../../common/queryKey";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  alignItems: "center",
  border: `2px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary expandIcon={<GrNext size={20} />} {...props} />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const ChapterAccordion = ({ chaptersQueries, chapter }) => {
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState([...chapter.listImgUrl]);
  const [isDirty, setIsDirty] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");
  const {
    isLoading: isLoadingDelete,
    status: deleteStatus,
    mutate: deleteMutate,
  } = useMutation({
    mutationFn: () => onDeleteChapter(),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries(QUERY_KEY.CHAPTER_MANAGEMENT);
        toast.success("Delete chapter successful");
        setPopupMsg("Delete chapter successful");
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error("Delete chapter failed");
      setPopupMsg("Delete chapter failed");
    },
  });
  const {
    isLoading: isLoadingUpdateListImg,
    status: updateListImgStatus,
    mutate: updateListImgMutate,
  } = useMutation({
    mutationFn: () => handleUpdateListImg(),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries(QUERY_KEY.CHAPTER_MANAGEMENT);
        toast.success("Update list images successful");
        setPopupMsg("Update list images  successful");
        setSelectedImage([...res.data.chapter.listImgUrl]);
        queryClient.setQueryData(
          [QUERY_KEY.CHAPTER_MANAGEMENT, chaptersQueries],
          (chapters) => {
            chapters.find((item) => item._id === chapter._id).listImgUrl =
              res.data.chapter.listImgUrl;
            return chapters;
          }
        );
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error("Update list images failed");
      setPopupMsg("Update list images failed");
    },
  });
  const { open, handleOpenPopup, handleClosePopup } = usePopup();
  const {
    open: openConfirm,
    handleOpenPopup: handleOpenConfirmPopup,
    handleClosePopup: handleCloseConfirmPopup,
  } = usePopup();
  const {
    open: openDeleteStatus,
    handleOpenPopup: handleOpenDeleteStatusPopup,
    handleClosePopup: handleCloseDeleteStatusPopup,
  } = usePopup();
  const {
    open: openUpdateListImgStatus,
    handleOpenPopup: handleOpenUpdateListImgStatusPopup,
    handleClosePopup: handleCloseUpdateListImgStatusPopup,
  } = usePopup();
  const onDeleteChapter = async () => {
    handleCloseConfirmPopup();
    handleOpenDeleteStatusPopup();
    const res = await chapterApi.deleteChapter(chapter._id);
    return res;
  };
  const handleCancel = () => {
    setSelectedImage([...chapter.listImgUrl]);
    setIsDirty(false);
  };
  const handleUpdateListImg = async () => {
    const listNewFile = selectedImage.filter((item) =>
      File.prototype.isPrototypeOf(item)
    );
    let updateListNewFileRes;
    let listNewImgUrl = selectedImage;
    if (listNewFile.length > 0) {
      const formData = new FormData();
      Object.keys(listNewFile).forEach((key) => {
        formData.append(key, listNewFile[key]);
      });
      updateListNewFileRes = await chapterApi.updateListImgsOfChapter(
        chapter._id,
        formData
      );
      if (!updateListNewFileRes.success) return updateListNewFileRes;
      let resIndex = 0;
      listNewImgUrl.forEach((item, index) => {
        if (File.prototype.isPrototypeOf(item)) {
          listNewImgUrl[index] =
            updateListNewFileRes.data.listPublicUrl[resIndex];
          resIndex++;
        }
      });
    }
    const updateChapterRes = await chapterApi.updateChapter(chapter._id, {
      title: chapter.title,
      listImgUrl: listNewImgUrl,
    });
    return updateChapterRes;
  };
  useEffect(() => {
    if (JSON.stringify(selectedImage) !== JSON.stringify(chapter.listImgUrl)) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [selectedImage]);
  return (
    <div>
      <Accordion key={chapter._id}>
        <AccordionSummary>
          <div className="w-full flex px-4 justify-between items-center cursor-pointer">
            <span className="font-semibold">{chapter?.title}</span>
            <div className="flex gap-2 justify-center items-center">
              <BiTimeFive size={20} />
              <span>{getDateDiff(dateToTs(chapter?.publishDate))}</span>
              <div className="flex">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenPopup();
                  }}
                >
                  <AiFillEdit color="green" size={25} />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenConfirmPopup();
                  }}
                >
                  <AiFillDelete color="red" size={25} />
                </IconButton>
              </div>
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="bg-white px-[10px] pt-3 pb-4 rounded-md">
            <MultipleImageBox
              haveLabel
              label="Choose image"
              name={chapter.title}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
            ></MultipleImageBox>
          </div>
          {isDirty && (
            <div className="mt-10 flex items-center justify-center ">
              <div className="flex items-center justify-center gap-2">
                <BasicButton
                  loading={isLoadingUpdateListImg}
                  buttonType={BUTTON_TYPE.NO_COLOR}
                  onClick={handleCancel}
                >
                  Cancel
                </BasicButton>
                <BasicButton
                  loading={isLoadingUpdateListImg}
                  onClick={updateListImgMutate}
                >
                  Save
                </BasicButton>
              </div>
            </div>
          )}
        </AccordionDetails>
      </Accordion>
      <AddChapterModal
        chapter={chapter}
        open={open}
        handleClosePopup={handleClosePopup}
      />
      <ConfirmPopup
        isOpen={openConfirm}
        handleConfirm={deleteMutate}
        handleReject={handleCloseConfirmPopup}
      >
        <div>
          Do you want to delete
          <span className="font-semibold text-orange-500">
            {" "}
            {chapter?.title}
          </span>{" "}
          ?
        </div>
      </ConfirmPopup>
      <PopupMsg
        isOpen={openDeleteStatus}
        handleClosePopup={handleCloseDeleteStatusPopup}
        status={deleteStatus}
        hasOk={true}
      >
        {popupMsg}
      </PopupMsg>
      <PopupMsg
        isOpen={openDeleteStatus}
        handleClosePopup={handleCloseDeleteStatusPopup}
        status={deleteStatus}
        hasOk={true}
      >
        {popupMsg}
      </PopupMsg>
      <PopupMsg
        isOpen={openUpdateListImgStatus}
        handleClosePopup={handleCloseUpdateListImgStatusPopup}
        status={updateListImgStatus}
        hasOk={true}
      >
        {popupMsg}
      </PopupMsg>
    </div>
  );
};
export default ChapterAccordion;
