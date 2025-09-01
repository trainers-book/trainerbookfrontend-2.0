import { Box, MenuItem, Typography } from "@mui/material";

type Tab = { label: string; show: boolean; icon: React.ReactNode };

interface SideBarProps {
  titlesIcons: Tab[];
  activeTab: Tab;
  changeTab: (newTab: string) => void;
}

const SideBar: React.FC<SideBarProps> = ({
  titlesIcons,
  activeTab,
  changeTab,
}) => {
  const handleClick = (tabClicked: string) => {
    if (tabClicked != activeTab.label) {
      changeTab(tabClicked);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "rgba(255, 255, 255, 1)",
        ml: ".5rem",
        borderRadius: 2,
        pt: 2,
        pb: 2,
        border: "1px solid #rgba(170, 170, 170, 1)",
        height: "86vh", // this value is the best looking for regular sized page but needs to be checked according to a full table and different size screens
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
      }}
    >
      {titlesIcons.map(
        (titleIcon) =>
          titleIcon.show && (
            <MenuItem
              sx={{
                display: "flex",
                alignItems: "center",
                ":hover": { bgcolor: "rgba(0, 48, 154, 0.212)" },
                borderRadius: 2,
                mb: 2,
                bgcolor:
                  activeTab.label == titleIcon.label
                    ? "rgba(0, 48, 154, 0.149)"
                    : "rgba(0, 0, 0, 0)",
              }}
              onClick={() => handleClick(titleIcon.label)}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {titleIcon.icon}
                <Typography sx={{ mr: 1 }}>{titleIcon.label}</Typography>
              </Box>
            </MenuItem>
          )
      )}
    </Box>
  );
};

export default SideBar;
