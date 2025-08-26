import { ThemeProvider, useTheme } from "@mui/material/styles";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { FormControl, TextField } from "@mui/material";

interface NumberInputProps {
  label: string;
  setValue: (value: number) => void;
  value: number;
  width?: string;
}

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const NumberInput: React.FC<NumberInputProps> = ({
  label,
  setValue,
  value,
  width,
}) => {
  const theme = useTheme();

  const handleChange = (event: any) => {
    const {
      target: { valueAsNumber },
    } = event;
    setValue(valueAsNumber);
  };

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <FormControl
          sx={{
            width: width,
          }}
        >
          <TextField
            type="number"
            value={value}
            sx={{
              mr: 1,
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

export default NumberInput;
