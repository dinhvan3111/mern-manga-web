import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SUBMIT_STATUS } from "./../../common/constants";
import Transition from "../Transition";
import CircleLoadingForOverlay from "./CircleLoadingForOverlay";
import "./styles.css";
import { MdCheckCircle, MdOutlineCancel } from "react-icons/md";
import { PAGE_PATH } from "../../routes/page-path";

const PopupMsg = ({
  children,
  status,
  isOpen,
  handleClosePopup,
  navigateTo,
  hasOk = true,
  hideOnSuccess = false,
  sx,
  navOnErr = false,
  navigateOnErr = PAGE_PATH.HOME,
  disableBackDropClick = false,
}) => {
  const navigate = useNavigate();

  const handleClose = (event, reason) => {
    if (disableBackDropClick && reason && reason === "backdropClick") return;
    // Close the popup
    handleClosePopup();
    // Navigate to a page on success
    if (status === SUBMIT_STATUS.SUCCESS && navigateTo) {
      navigate(navigateTo);
    }

    if (navOnErr === true && status === SUBMIT_STATUS.ERROR) {
      navigate(navigateOnErr);
    }
  };
  const renderIcon = () => {
    switch (status) {
      case SUBMIT_STATUS.ERROR:
        return (
          <Layout
            isOpen={isOpen}
            status={status}
            hideOnSuccess={hideOnSuccess}
            hasOk={hasOk}
            handleClose={handleClose}
            sx={sx}
            children={children}
          >
            <MdOutlineCancel color="red" size={30}></MdOutlineCancel>

            {children}
          </Layout>
        );
      case SUBMIT_STATUS.SUCCESS:
        return (
          <Layout
            isOpen={isOpen}
            status={status}
            hideOnSuccess={hideOnSuccess}
            hasOk={hasOk}
            handleClose={handleClose}
            sx={sx}
            children={children}
          >
            <MdCheckCircle color="green" size={30}></MdCheckCircle>

            {children}
          </Layout>
        );
      case SUBMIT_STATUS.LOADING:
        return <CircleLoadingForOverlay show={true} />;
      default:
        return <></>;
    }
  };
  return <>{renderIcon()}</>;
};

const Layout = ({
  isOpen,
  status,
  hideOnSuccess,
  hasOk,
  handleClose,
  sx,
  children,
}) => {
  return (
    <Dialog
      open={hideOnSuccess && status === SUBMIT_STATUS.SUCCESS ? false : isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      sx={[...(Array.isArray(sx) ? sx : [sx])]}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px 50px 10px 50px",
        }}
      >
        {children}

        {/* Modal buttons */}
        <DialogActions>
          {hasOk ? (
            <button
              className="rounded-lg border border-gray-200 px-4 py-1 hover:bg-gray-200"
              onClick={handleClose}
            >
              Đóng
            </button>
          ) : (
            ""
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default PopupMsg;
