import { ThemeProvider, useTheme } from "@mui/material/styles";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useState } from "react";
import { Box, Button } from "@mui/material";
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
    picked: { minDate: Date; maxDate: Date } | undefined
  ) => void;
  minYear: number;
  invokeCallback: boolean;
  smallestHeight?: boolean;
  firstDate?: Date;
  lastDate?: Date;
  minDate?: Date;
}

const FullDatePicker: React.FC<FullDatePickerProps> = ({
  rangeDate,
  pickCallback,
  minYear,
  invokeCallback,
  smallestHeight,
  firstDate,
  lastDate,
  minDate
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [maxYear, setMaxYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(firstDate ? firstDate.getMonth() + 1 : new Date().getMonth() + 1);
  const [year, setYears] = useState<number>(firstDate ? firstDate.getFullYear() : currentYear);
  const [resetPick, setResetPick] = useState<boolean>(false);
  const [isDatePicked, setIsDatePicked] = useState<boolean>(firstDate ? true : false);

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
              sx={{ minWidth: "90px", maxWidth: "5vw" }}
            />
            <NumberInput
              label={t("year")}
              setValue={(value: number) => {
                if (
                  value >= minYear &&
                  value <= (maxYear != undefined ? maxYear : currentYear)
                ) {
                  setYears(value);
                }
              }}
              value={year}
              sx={{ minWidth: "90px", maxWidth: "5vw", pl: 1, pr: 1 }}
            />
            <Button
              disabled={!isDatePicked}
              onClick={() => {
                setResetPick(!resetPick);
                setIsDatePicked(false);
                pickCallback(undefined);
              }}
              sx={{
                minWidth: "20px",
                maxWidth: "2vw",
                bgcolor: "rgba(255, 255, 255, 0)",
                color: "rgb(0, 0, 0)",
                ":hover": { bgcolor: "rgba(213, 212, 212, 0.32)" },
              }}
            >
              X
            </Button>
          </Box>
          <GridDatePicker
            year={year}
            month={month}
            rangeDate={rangeDate}
            pickCallback={pickCallback}
            reset={resetPick}
            onClick={(isPicked: boolean) => {
              setIsDatePicked(isPicked);
            }}
            invokeCallback={invokeCallback}
            smallestHeight={smallestHeight}
            firstDate={firstDate}
            lastDate={lastDate}
            minDate={minDate}
          />
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default FullDatePicker;
