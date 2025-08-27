import { ThemeProvider, useTheme } from "@mui/material/styles";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useState } from "react";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import NumberInput from "../Dynamics/numberFieldInput";
import GridDatePicker from "./gridDatePicker";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

interface FullDatePickerProps {
  rangeDate: boolean;
  pickCallback: (
    picked: { date: Date } | { minDate: Date; maxDate: Date }
  ) => void;
  minYear: number;
}

const FullDatePicker: React.FC<FullDatePickerProps> = ({
  rangeDate,
  pickCallback,
  minYear,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYears] = useState<number>(currentYear);

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 2,
            mt: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <NumberInput
              label={t("month")}
              setValue={(value: number) => {
                if (value >= 1 && value <= 12) {
                  setMonth(value);
                }
              }}
              value={month}
              sx={{ minWidth: "105px", maxWidth: "5.5vw", pr: 1 }}
            />
            <NumberInput
              label={t("year")}
              setValue={(value: number) => {
                if (value >= minYear && value <= currentYear) {
                  setYears(value);
                }
              }}
              value={year}
              sx={{ minWidth: "105px", maxWidth: "5.5vw", pl: 1 }}
            />
          </Box>
          <GridDatePicker
            year={year}
            month={month}
            rangeDate={rangeDate}
            pickCallback={pickCallback}
          />
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default FullDatePicker;
