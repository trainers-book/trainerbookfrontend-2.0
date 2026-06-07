import { FormControl, TextField } from "@mui/material";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import React, { useEffect, useState } from "react";

interface FilterDateTimeProps {
  label: string;
  value?: Date | string;
  setDate: (value: Date | undefined) => void;
  width?: string;
  isReset?: boolean;
  disabled?: boolean;
}

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const formatToInput = (value?: Date | string) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

const parseFromInput = (val: string) => {
  return val ? new Date(val) : undefined;
};

const FilterDateTime: React.FC<FilterDateTimeProps> = ({
  label,
  value,
  setDate,
  width,
  isReset,
  disabled,
}) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState<string>(formatToInput(value));

  useEffect(() => {
    setInputValue(formatToInput(value));
  }, [value]);

  useEffect(() => {
    if (isReset) {
      setInputValue("");
      setDate(undefined);
    }
  }, [isReset, setDate]);

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <FormControl sx={{ width: width }}>
          <TextField
            label={label}
            type="datetime-local"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setDate(parseFromInput(e.target.value));
            }}
            disabled={disabled}
            InputLabelProps={{ shrink: true }}
            sx={{
              mr: 0.2,
              "& .MuiInputBase-root": { borderRadius: 2 },
              "& .MuiInputBase-input": { padding: "6.5px" },
            }}
          />
        </FormControl>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default FilterDateTime;
