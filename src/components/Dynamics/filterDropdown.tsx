import {
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useEffect } from "react";
import "../../i18n";
import { useTranslation } from "react-i18next";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

const ITEM_HEIGHT = 36;
const ITEM_PADDING_TOP = 1;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

interface FilterDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  setSelected: (values: string[]) => void;
  isMultiple: boolean;
  width?: string;
  isReset?: boolean;
  onBlur?: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  touched?: boolean;
  error?: string;
  errorColor?: boolean;
}

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  selected,
  setSelected,
  isMultiple,
  width,
  isReset,
  touched,
  error,
  onBlur,
  errorColor
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    if (options.length == 1 && selected.length == 0) {
      setSelected(options);
    }
  });

  useEffect(() => {
    if (isReset) {
      setSelected([]);
    }
  }, [isReset]);

  const handleChange = (event: SelectChangeEvent<typeof selected>) => {
    const {
      target: { value },
    } = event;

    if (!isMultiple && typeof value === "string" && selected.includes(value)) {
      setSelected([]);
    } else {
      setSelected(typeof value === "string" ? value.split(",") : value);
    }
  };

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <div dir="rtl">
          <FormControl
            sx={{
              width: width,
              mr: .2,
            }}
            error={(touched && selected.length === 0) || errorColor}
          >
            <InputLabel
              id="dropdown-select-label"
              sx={{
                top: "-.6rem",
                "&.MuiInputLabel-shrink": {
                  top: "-.1rem",
                },
              }}
            >
              {touched && selected.length === 0 ? error : label}
            </InputLabel>
            <Select
              labelId="dropdown-select-label"
              multiple={isMultiple}
              value={selected}
              onChange={handleChange}
              onBlur={(event) => {
                if (onBlur) {
                  onBlur(event);
                }
              }}
              input={<OutlinedInput label={label} />}
              renderValue={(selected) =>
                selected.length === 1
                  ? selected[0]
                  : selected.length > 1
                    ? `${t("selected")}: ${selected.length}`
                    : ""
              }
              MenuProps={MenuProps}
              disabled={options.length == 1}
              sx={{
                height: 36,
                borderRadius: 2,
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
              }}
            >
              {options.map((option: string) => (
                <MenuItem
                  key={option}
                  value={option}
                  style={{
                    fontWeight: selected.includes(option)
                      ? theme.typography.fontWeightBold
                      : theme.typography.fontWeightRegular,
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default FilterDropdown;
