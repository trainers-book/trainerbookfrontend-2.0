import {
  FormControl,
  TextField,
} from "@mui/material";

import "../../i18n";
import { useTranslation } from "react-i18next";

import { ThemeProvider, useTheme } from "@mui/material/styles";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

interface FilterSearchBarProps {
  label: string;
  setSearch: (value: string) => void;
  width?: string;
}

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const FilterSearchBar: React.FC<FilterSearchBarProps> = ({
  label,
  setSearch,
  width,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSearch(value);
  };

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <FormControl
          sx={{
            width: width
          }}
        >
          <TextField
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: 2,
              },
              "&.MuiInputLabel": {
                top: ".1rem"
              },
              "& .MuiInputBase-input": {
                padding: "6.5px",
                borderRadius: 2,
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
              },
            }}
            label={label}
            onChange={handleChange}
            InputLabelProps={{
              sx: {
                top: "-0.6rem",
                "&.MuiInputLabel-shrink": {
                  top: "-.1rem",
                },
              },
            }}
          ></TextField>
        </FormControl>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default FilterSearchBar;
