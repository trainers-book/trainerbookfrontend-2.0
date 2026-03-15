import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface MissingDataProps {
  open: boolean;
  title?: string;
  content?: string;
  onCancel: () => void;
}

const MissingData: React.FC<MissingDataProps> = ({
  open,
  title,
  content,
  onCancel,
}) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle
      sx={{display: "flex", justifyContent: "center" ,
        fontWeight: "bold"
      }}>{title}</DialogTitle>
      <DialogContent>
        <Typography>{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="error" variant="contained">
          {t("confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MissingData;
