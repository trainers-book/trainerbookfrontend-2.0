import { FormControl, TextField, Menu } from "@mui/material";
import "../../i18n";
import { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import FullDatePicker from "../datePicker/fullDatePicker";
import DateRangeIcon from "@mui/icons-material/DateRange";

interface FilterDateProps {
  setDate: (value: { minDate: Date; maxDate: Date } | undefined) => void;
  width?: string;
  isReset: boolean;
}

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const FilterDate: React.FC<FilterDateProps> = ({ width, setDate, isReset }) => {
  const theme = useTheme();
  const [dateValue, setDateValue] = useState<
    { minDate: Date; maxDate: Date } | undefined
  >();
  const [callback, setCallback] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  interface HandleClickEvent {
    currentTarget: HTMLElement;
  }

  const handleClick = (event: HandleClickEvent) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setCallback(!callback);
  };

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setDateValue(value);
    setDate(value);
  };

  useEffect(() => {
    if (isReset) {
      setDateValue(undefined);
      setDate(undefined);
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
            sx={{
              mr: 0.2,
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
            label={
              <DateRangeIcon sx={{ color: dateValue ? "#5fcced9e" : "" }} />
            }
            onClick={handleClick}
            disabled
            InputLabelProps={{
              sx: {
                top: "-0.6rem",
                "&.MuiInputLabel-shrink": {
                  top: "-.1rem",
                },
              },
            }}
          />
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            sx={{
              borderRadius: 2,
              "& .MuiPaper-root": {
                borderRadius: 2,
                pr: 2,
                pl: 2,
              },
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <FullDatePicker
              rangeDate={true}
              pickCallback={(
                dates: { minDate: Date; maxDate: Date } | undefined
              ) => {
                setDateValue(dates);
                setDate(dates);
              }}
              minYear={2019}
              invokeCallback={callback}
              smallestHeight={true}
              firstDate={dateValue ? dateValue.minDate : undefined}
              lastDate={dateValue ? dateValue.maxDate : undefined}
            />
          </Menu>
        </FormControl>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default FilterDate;
