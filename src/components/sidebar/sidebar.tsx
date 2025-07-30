import { Box, MenuItem, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface SideBarProps {
  titlesIcons: Record<string, React.ReactNode>;
  activeTitle: string;
}

const SideBar: React.FC<SideBarProps> = ({ titlesIcons, activeTitle }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const handleMouseOver = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    const timeout = setTimeout(() => {
      setIsHovering(false);
    }, 500);

    setHoverTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

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
        border: "1px solid #aaa"
      }}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseOut}
    >
      {Object.entries(titlesIcons).map(([key, value]) => (
        <MenuItem
          sx={{
            display: "flex",
            alignItems: "center",
            ":hover": { bgcolor: "#00309a36" },
            borderRadius: 2,
            mb: 2,
            bgcolor: activeTitle == key ? "#00309a26" : "#00000000"
          }}
        >
          {isHovering ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              { value }
              <Typography sx={{ mr: 1 }}>{key}</Typography>
            </Box>
          ) : (
             value 
          )}
        </MenuItem>
      ))}
    </Box>
  );
};

export default SideBar;
