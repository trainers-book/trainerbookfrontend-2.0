import { FormControl, TextField } from "@mui/material";

import "../../i18n";
import { useTranslation } from "react-i18next";

import { ThemeProvider, useTheme } from "@mui/material/styles";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

interface FilterDateProps {
    setDate: (value: string) => void;
    width?: string;
}

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const FilterDate: React.FC<FilterDateProps> = ({ width, setDate }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;    

    setDate(value);
  };

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <FormControl
          sx={{
            width: width,
            ml: 1,
          }}
        >
          <TextField
            sx={{
              "& .MuiInputBase-input": {
                padding: "6.5px",
                borderRadius: 2,
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
              },
              "& .MuiInputBase-root": {
                borderRadius: 2,
              },
            }}
            type="date"
            placeholder="choose"
            onChange={handleChange}
          />
        </FormControl>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default FilterDate;
