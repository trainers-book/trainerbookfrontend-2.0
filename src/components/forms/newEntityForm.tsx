import { Button, FormControl } from "@mui/material";

import "../../i18n";
import { useTranslation } from "react-i18next";

import { ThemeProvider, useTheme } from "@mui/material/styles";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import FilterSearchBar from "../Dynamics/filterSearchBar";
import FilterDropdown from "../Dynamics/filterDropdown";

interface NewEntityProps {
  textInputs: { label: string; setter: (fields: string) => void }[];
  dropdownInputs: {
    label: string;
    options: string[];
    selected: string[];
    setter: (fields: string[]) => void;
    multiple: boolean;
  }[];
  callback: () => void;
  width?: string;
}

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const NewEntity: React.FC<NewEntityProps> = ({
  textInputs,
  dropdownInputs,
  callback,
  width,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <FormControl
          sx={{
            width: width,
            display: "flex",
            flexDirection: "row",
          }}
        >
          {textInputs.map((textField) => (
            <FilterSearchBar
              label={textField.label}
              setSearch={textField.setter}
              isReset={false}
            />
          ))}
          {dropdownInputs.map((dropdown) => (
            <FilterDropdown
              label={dropdown.label}
              options={dropdown.options}
              selected={dropdown.selected}
              setSelected={dropdown.setter}
              isMultiple={dropdown.multiple}
              width="9rem"
            />
          ))}
          <Button
            sx={{
              color: "#000000",
              bgcolor: "#ffffff",
              borderRadius: 2,
              ":hover": { bgcolor: "#d4edff7a" },
            }}
            onClick={() => {
              callback();
              dropdownInputs.forEach((input) => input.setter([]));
            }}
          >
            {t("add")}
          </Button>
        </FormControl>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default NewEntity;
