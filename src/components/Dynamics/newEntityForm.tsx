import {
    Button,
    FormControl,
  } from "@mui/material";
  
  import "../../i18n";
  import { useTranslation } from "react-i18next";
  
  import { ThemeProvider, useTheme } from "@mui/material/styles";
  import rtlPlugin from "@mui/stylis-plugin-rtl";
  import { prefixer } from "stylis";
  import { CacheProvider } from "@emotion/react";
  import createCache from "@emotion/cache";
import FilterSearchBar from "./filterSearchBar";
  
  interface NewEntityProps {
    textInputs: {string: (fields: string) => void};
    dropdownInputs: {string: (fields: string) => void};
    callback: () => void,
    width?: string;
  }
  
  const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
  });
  
  const NewEntity: React.FC<NewEntityProps> = ({
    textInputs, callback, width
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
              flexDirection: "row"
            }}
          >
            {Object.keys(textInputs).map((text) => (<FilterSearchBar label={text} setSearch={textInputs[text]}/>))}
            <Button sx={{ color: "#000000", bgcolor: "#ffffff", borderRadius: 2, ":hover": {bgcolor: "#d4edff7a"} }} onClick={() => {callback()}}>{t("add")}</Button>
          </FormControl>
        </ThemeProvider>
      </CacheProvider>
    );
  };
  
  export default NewEntity;
  