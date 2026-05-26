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
import InfinateScrollData from "../../table/infinateScrollTableData";
import IssueData, { getIssueColor } from "../../../types/tables/issues";

interface FlightInformationProps {
  selectedRow: any;
  handleClose: () => void;
  flightMalfunctions: IssueData[];
}

const FlightInformation: React.FC<FlightInformationProps> = ({
  selectedRow,
  handleClose,
  flightMalfunctions,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      fullWidth={true}
      maxWidth={flightMalfunctions.length !== 0 ? "xl" : undefined}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column",
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

      <DialogContent
        sx={{
          overflowY: "auto",
        }}
      >
        <Typography sx={{ fontSize: 18, mb: 1, mr: 5 }}>
          {t("flightNumber")}: {selectedRow.flightNumber}
        </Typography>

        <Typography sx={{ fontSize: 18, mb: 1, mr: 5 }}>
          {t("platform")}: {selectedRow.platform}
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {Object.keys(selectedRow).map(
            (key) =>
              key !== "flightNumber" &&
              key !== "dateTime" &&
              key !== "startTime" &&
              key !== "flightName" &&
              key !== "issueDescription" &&
              key !== "platform" &&
              !key.includes("_") && (
                <Typography
                  key={key}
                  sx={{ fontSize: 18, flexBasis: "35%", mr: 5 }}
                >
                  {t(key)}: {JSON.stringify(selectedRow[key])}
                </Typography>
              )
          )}
        </Box>

        <Typography sx={{ fontSize: 18, mr: 5, mt: 2 }}>
          {t("issueDescription")}: {selectedRow.issueDescription}
        </Typography>

        {flightMalfunctions.length !== 0 && (
          <Box sx={{ mt: 5 }}>
            <InfinateScrollData
              properties={Object.keys(new IssueData({})).filter(
                (property) =>
                  !property.includes("_") && 
                  property !== "platform" && 
                  property !== "flightName" // KEY FIX: Excluded flightName from the table properties
              )}
              data={flightMalfunctions}
              getRowKey={(row: IssueData) => `${row.issueNumber}`}
              noHeight={true}
              color={true}
              getRowClass={getIssueColor}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FlightInformation;