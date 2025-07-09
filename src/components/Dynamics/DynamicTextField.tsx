import { createTheme, TextField, ThemeProvider, useTheme } from "@mui/material";
import { prefixer } from "stylis";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { ChangeEvent } from "react";

interface DynamicTextFieldProps {
  label: string;
  width: string;
  multiline?: boolean;
  rows?: number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const DynamicTextField: React.FC<DynamicTextFieldProps> = ({
  label,
  width,
  rows,
  multiline,
  onChange
}) => {
  const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
  });

  const outerTheme = useTheme();

  const rtlTheme = createTheme({
    direction: "rtl",
    palette: {
      mode: outerTheme.palette.mode,
    },
  });

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={rtlTheme}>
        <div dir="rtl">
          <TextField
            label={label}
            sx={{ width }}
            rows={rows}
            multiline={multiline}
            onChange={onChange}
          />
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default DynamicTextField;
