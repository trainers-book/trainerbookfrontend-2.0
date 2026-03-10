import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material";

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
