import { Dialog, DialogActions, DialogContent, Stack } from "@mui/material";
import React from "react";
import BasicButton, { BUTTON_TYPE } from "./../button/BasicButton";
import Transition from "../Transition";
import { BiHelpCircle } from "react-icons/bi";

const ConfirmPopup = ({
  isOpen,
  handleClose,
  handleConfirm = () => console.log("confirm"),
  handleReject = handleClose,
  clickOutside = handleClose,
  isConfirming,
  children,
  noBtnLabel = "No",
  yesBtnLabel = "Yes",
  yesClassName = "!bg-red-500",
  style,
  wrapperClass = "",
  fullWidth = false,
  btnWrapperClass = "",
  icon = <BiHelpCircle className="!text-[50px] self-center" />,
}) => {
  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={clickOutside}
      sx={style}
      fullWidth={fullWidth}
    >
      <DialogContent
        sx={{
          pt: 4,
          pb: 0,
          margin: "auto",

          textAlign: "center",
        }}
        className={`w-[100%] !p-0 sm:!px-6 sm:!pt-8 sm:w-[450px] ${wrapperClass}`}
      >
        <Stack>
          {icon}
          {children}
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{ margin: "auto", gap: 1 }}
        className={`p-0 sm:!pb-8 ${btnWrapperClass}`}
      >
        <BasicButton
          buttonType={BUTTON_TYPE.NO_COLOR}
          onClick={handleReject}
          loading={isConfirming}
          variant="none"
          className="!px-8 !py-1 !rounded-lg !font-bold"
        >
          {noBtnLabel}
        </BasicButton>
        <BasicButton
          onClick={() => {
            handleConfirm();
            handleReject();
          }}
          loading={isConfirming}
          className={` !text-white !px-8 !py-1 !rounded-lg ${yesClassName}`}
        >
          {yesBtnLabel}
        </BasicButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmPopup;
