import { ThemeProvider, useTheme } from "@mui/material/styles";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import NumberInput from "../Dynamics/numberFieldInput";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

interface FullMonthPickerProps {
  rangeMonth: boolean;
  pickCallback: (picked: { minMonthDate: Date; maxMonthDate: Date }) => void;
  minYear: number;
  invokeCallback: boolean;
}

const FullMonthPicker: React.FC<FullMonthPickerProps> = ({
  rangeMonth,
  pickCallback,
  minYear,
  invokeCallback,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isInitialRender = useRef(true);
  const currentYear = new Date().getFullYear();
  const [year, setYears] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [secondMonth, setSecondMonth] = useState<number>(
    new Date().getMonth() + 1
  );

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    
    if (rangeMonth) {
      pickCallback({
        minMonthDate: new Date(year, Math.min(month, secondMonth) - 1, 1),
        maxMonthDate: new Date(year, Math.max(month, secondMonth), 0),
      });
    } else {
      pickCallback({
        minMonthDate: new Date(year, month - 1, 1),
        maxMonthDate: new Date(year, month, 0),
      });
    }
  }, [invokeCallback]);

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
              alignItems: "center",
            }}
          >
            <NumberInput
              label={t("year")}
              setValue={(value: number) => {
                if (value >= minYear && value <= currentYear) {
                  setYears(value);
                }
              }}
              value={year}
              sx={{ mr: 1 }}
            />
            <NumberInput
              label={t("month")}
              setValue={(value: number) => {
                if (value >= 1 && value <= 12) {
                  setMonth(value);
                }
              }}
              value={month}
              sx={{ mr: 1 }}
            />
            {rangeMonth && (
              <Typography sx={{ fontSize: "1.5rem", mr: 1 }}>-</Typography>
            )}
            {rangeMonth && (
              <NumberInput
                label={t("month")}
                setValue={(value: number) => {
                  if (value >= 1 && value <= 12) {
                    setSecondMonth(value);
                  }
                }}
                value={secondMonth}
                sx={{ mr: 1 }}
              />
            )}
          </Box>
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default FullMonthPicker;
