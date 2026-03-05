import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

interface InformationProps {
  isOpen: boolean;
  selectedRow: any;
  onClose: () => void;
}
const Information: React.FC<InformationProps> = ({
  isOpen,
  selectedRow,
  onClose,
}) => {
  const { t } = useTranslation();

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
            },
          },
        }}
      >
        <DialogTitle>
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Grid
            container
            padding={1}
            sx={{ position: "absolute", left: 50, top: 8 }}
          >
            <Grid size={10}>
              {selectedRow.dateTime.toLocaleDateString("en-GB")}
            </Grid>
            <Grid size={0}>
              {selectedRow.dateTime.toLocaleTimeString([], {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogTitle align="center" variant="body1" sx={{ pt: 2, pb: 0.5 }}>
          {selectedRow.flightName}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 18, mb: 1, mr: 5 }}>
            {t("flightNumber")}: {selectedRow.flightNumber}
          </Typography>
          <Typography sx={{ fontSize: 18, mb: 1, mr: 5 }}>
            {t("platform")}: {selectedRow.platform}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {Object.keys(selectedRow).map(
              (key) =>
                key != "flightNumber" &&
                key != "dateTime" &&
                key != "startTime" &&
                key != "flightName" &&
                key != "issueDescription" &&
                key != "platform" && (
                  <Typography sx={{ fontSize: 18, flexBasis: "35%", mr: 5 }}>
                    {t(key)}: {selectedRow[key]}
                  </Typography>
                )
            )}
          </Box>
          <Typography sx={{ fontSize: 18, mr: 5, mt: 2 }}>
            {t("issueDescription")}: {selectedRow.issueDescription}
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Information;
