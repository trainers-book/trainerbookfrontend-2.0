import { Box, MenuItem, Typography } from "@mui/material";

type Tab = {label: string, icon: React.ReactNode};

interface SideBarProps {
  titlesIcons: Tab[];
  activeTab: Tab;
  changeTab: (newTab: string) => void;
}

const SideBar: React.FC<SideBarProps> = ({ titlesIcons, activeTab, changeTab }) => {
  const handleClick = (tabClicked: string) => {
    if (tabClicked != activeTab.label) {
      changeTab(tabClicked);
    }
  }

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
        height: "86vh" // this value is the best looking for regular sized page but needs to be checked according to a full table and different size screens
      }}
    >
      {titlesIcons.map((titleIcon) => (
        <MenuItem
          sx={{
            display: "flex",
            alignItems: "center",
            ":hover": { bgcolor: "#00309a36" },
            borderRadius: 2,
            mb: 2,
            bgcolor: activeTab.label == titleIcon.label ? "#00309a26" : "#00000000",
          }}
          onClick={() => handleClick(titleIcon.label)}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {titleIcon.icon}
            <Typography sx={{ mr: 1 }}>{titleIcon.label}</Typography>
          </Box>
        </MenuItem>
      ))}
    </Box>
  );
};

export default SideBar;
