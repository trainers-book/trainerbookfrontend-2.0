import React from "react";
import { Snackbar, Alert, AlertColor, SnackbarOrigin } from "@mui/material";

interface CustomAlertProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity?: AlertColor; // "success" | "info" | "warning" | "error"
  autoHideDuration?: number;
  position?: SnackbarOrigin;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  open,
  onClose,
  message,
  severity,
  autoHideDuration = 4000,
  position = { vertical: "top", horizontal: "center" },
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={position}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          width: "100%",
          padding: "12px 24px",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
          fontSize: "1.1rem",
          alignItems: "center",
          display: "flex",
          flexDirection: "row-reverse",
          "& .MuiAlert-action": {
            marginRight: 0,
            marginLeft: "auto",
            paddingTop: 0,
          },
          "& .MuiAlert-icon": {
            marginLeft: 0,
            marginRight: "16px",
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomAlert;