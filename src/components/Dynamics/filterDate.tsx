import { FormControl, TextField } from "@mui/material";
import "../../i18n";
import { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

interface FilterDateProps {
  setDate: (value: string) => void;
  width?: string;
  isReset: boolean;
}

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const FilterDate: React.FC<FilterDateProps> = ({ width, setDate, isReset }) => {
  const theme = useTheme();
  const [dateValue, setDateValue] = useState("");

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setDateValue(value);
    setDate(value);
  };

  useEffect(() => {
    if (isReset) {
      setDateValue("");
      setDate("");
    }
  }, [isReset, handleChange]);

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
            value={dateValue}
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
