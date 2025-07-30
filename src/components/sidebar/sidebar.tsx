import { Box, MenuItem, Typography } from "@mui/material";

interface SideBarProps {
  titlesIcons: Record<string, React.ReactNode>;
  activeTitle: string;
}

const SideBar: React.FC<SideBarProps> = ({ titlesIcons, activeTitle }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "#ffffff",
        ml: ".5rem",
        borderRadius: 2,
        pt: 2,
        pb: 2,
        border: "1px solid #aaa",
        height: "88vh" // this value is the best looking for regular sized page but needs to be checked according to a full table and different size screens
      }}
    >
      {Object.entries(titlesIcons).map(([key, value]) => (
        <MenuItem
          sx={{
            display: "flex",
            alignItems: "center",
            ":hover": { bgcolor: "#00309a36" },
            borderRadius: 2,
            mb: 2,
            bgcolor: activeTitle == key ? "#00309a26" : "#00000000",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {value}
            <Typography sx={{ mr: 1 }}>{key}</Typography>
          </Box>
        </MenuItem>
      ))}
    </Box>
  );
};

export default SideBar;
