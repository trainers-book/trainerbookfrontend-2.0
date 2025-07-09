import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface ClickedOutsideProps {
  open: boolean;
  title?: string;
  content?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ClickedOutside: React.FC<ClickedOutsideProps> = ({
  open,
  title,
  content,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{t("cancel")}</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          {t("confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClickedOutside;
