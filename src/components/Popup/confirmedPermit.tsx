import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface ConfirmedPermitProps {
  open: boolean;
  title?: string;
  content?: string;
}

const ConfirmedPermit: React.FC<ConfirmedPermitProps> = ({
  open,
  title,
  content,
}) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{content}</Typography>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmedPermit;
