import React from "react";
import Fade from "@mui/material/Fade";
import { Dialog } from "@mui/material";
import Transition from "../Transition";
import BasicButton, { BUTTON_TYPE } from "../button/BasicButton";

const BasicModal = ({
  open,
  handleClose,
  children,
  maxWidth = "600px",
  padding = "40px",
  fullWidth = false,
  cancelBtnLabel = "Cancel",
  confirmBtnLabel = "Confirm",
  loading = false,
  handleCancel = () => {},
  handleConfirm = () => {},
  ...props
}) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      fullWidth={fullWidth}
      maxWidth="lg"
      PaperProps={{
        style: {
          zIndex: 7,
          position: "relative",
          boxShadow: "none",
          padding: padding,
          maxWidth: maxWidth,
          // overflowX: "hidden",
        },
      }}
    >
      <Fade in={open}>
        <div>
          {children}
          <div className="mt-8 flex gap-4">
            <BasicButton
              loading={loading}
              onClick={handleCancel}
              buttonType={BUTTON_TYPE.NO_COLOR}
            >
              {cancelBtnLabel}
            </BasicButton>
            <BasicButton loading={loading} onClick={handleConfirm}>
              {confirmBtnLabel}
            </BasicButton>
          </div>
        </div>
      </Fade>
    </Dialog>
  );
};

export default BasicModal;
