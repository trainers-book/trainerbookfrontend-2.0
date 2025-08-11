import { useEffect, useState } from "react";

import { FormControl, TextField } from "@mui/material";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

interface FilterSearchBarProps {
  label: string;
  setSearch: (value: string) => void;
  width?: string;
  isReset: boolean;
}

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const FilterSearchBar: React.FC<FilterSearchBarProps> = ({
  label,
  setSearch,
  width,
  isReset,
}) => {
  const theme = useTheme();
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSearchValue(value);
    setSearch(value);
  };

  useEffect(() => {
    if (isReset) {
      setSearchValue("");
      setSearch("");
    }
  }, [isReset, handleChange]);

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <FormControl
          sx={{
            width: width,
          }}
        >
          <TextField
            value={searchValue}
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: 2,
              },
              "&.MuiInputLabel": {
                top: ".1rem",
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
