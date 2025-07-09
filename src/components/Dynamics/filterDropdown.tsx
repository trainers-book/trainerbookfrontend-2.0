import {
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";

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
  width
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

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
            }}
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
              {label}
            </InputLabel>
            <Select
              labelId="dropdown-select-label"
              multiple={isMultiple}
              value={selected}
              onChange={handleChange}
              input={<OutlinedInput label={label} />}
              renderValue={(selected) =>
                selected.length === 1
                  ? t(selected[0])
                  : selected.length > 1
                    ? `${t("selected")}: ${selected.length}`
                    : ""
              }
              MenuProps={MenuProps}
              sx={{
                height: 36,
                borderRadius: 2,
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
              }}
            >
              {options.map((option: string) => (
                <MenuItem
                  key={option}
                  value={t(option)}
                  style={{
                    fontWeight: selected.includes(t(option))
                      ? theme.typography.fontWeightBold
                      : theme.typography.fontWeightRegular,
                  }}
                >
                  {t(option)}
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
