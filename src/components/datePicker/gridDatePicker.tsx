import { ThemeProvider, useTheme } from "@mui/material/styles";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

interface GridDatePickerProps {
  year: number;
  month: number;
  rangeDate: boolean;
  pickCallback: (picked: { minDate: Date; maxDate: Date }) => void;
  invokeCallback: boolean;
  reset?: boolean;
  onClick?: (isPicked: boolean) => void;
}

const GridDatePicker: React.FC<GridDatePickerProps> = ({
  year,
  month,
  rangeDate,
  pickCallback,
  invokeCallback,
  reset,
  onClick,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [dateHover, setDateHover] = useState<number>();
  const [pickedDate, setPickedDate] = useState<Date | null>();
  const [secondPickedDate, setSecondPickedDate] = useState<Date | null>();
  const [daysGrid, setDaysGrid] = useState<number[]>([]);

  const daysOfWeek = ["sun", "mon", "tue", "wen", "thu", "fri", "sat"];

  useEffect(() => {
    setDaysGrid(getDaysGrid());
  }, [month]);

  useEffect(() => {
    setDaysGrid(getDaysGrid());
  }, [year]);

  useEffect(() => {
    setPickedDate(null);
    setSecondPickedDate(null);
  }, [reset]);

  useEffect(() => {
    setPickedDate(null);
    setSecondPickedDate(null);
  }, [rangeDate]);

  useEffect(() => {
    if (rangeDate) {
      if (pickedDate != null && secondPickedDate != null) {
        const maxTime = Math.max(
          pickedDate.getTime(),
          secondPickedDate.getTime()
        );
        pickCallback({
          minDate:
            pickedDate.getTime() <= secondPickedDate.getTime()
              ? pickedDate
              : secondPickedDate,
          maxDate: new Date(maxTime + 24 * 60 * 60 * 1000 - 1),
        });
      }
    } else {
      if (pickedDate != null) {
        pickCallback({
          minDate: new Date(
            pickedDate.getFullYear(),
            pickedDate.getMonth(),
            pickedDate.getDate(),
            0,
            0,
            0
          ),
          maxDate: new Date(
            pickedDate.getFullYear(),
            pickedDate.getMonth(),
            pickedDate.getDate(),
            23,
            59,
            59
          ),
        });
      }
    }
  }, [invokeCallback]);

  const onDateClick = (day: number) => {
    if (day == 0) {
      return;
    }

    if (rangeDate) {
      if (pickedDate == null) {
        setPickedDate(new Date(year, month - 1, day));
        onClick ? onClick(true) : undefined;
      } else if (secondPickedDate == null) {
        setSecondPickedDate(new Date(year, month - 1, day));
        onClick ? onClick(true) : undefined;
      } else {
        setPickedDate(new Date(year, month - 1, day));
        setSecondPickedDate(null);
        onClick ? onClick(true) : undefined;
      }
    } else {
      setPickedDate(new Date(year, month - 1, day));
      onClick ? onClick(true) : undefined;
    }
  };

  const getDaysGrid = () => {
    const date = new Date(year, month, 0);
    const days = date.getDate();
    const finalDays = [];
    date.setDate(1);
    const spaces = date.getDay();

    for (let i = 0; i < spaces; i++) {
      finalDays.push(0);
    }
    finalDays.push(1);

    for (let i = 1; i < days; i++) {
      finalDays.push(i + 1);
    }

    date.setDate(days);
    for (let i = 0; i < 6 - date.getDay(); i++) {
      finalDays.push(0);
    }

    return finalDays;
  };

  const checkDateRange = (currentDay: number) => {
    if (currentDay == 0) {
      return;
    }
    if (rangeDate && pickedDate != null) {
      const dateTime = new Date(year, month - 1, currentDay).getTime();
      let secondTime: number;
      if (secondPickedDate == null) {
        if (dateHover == 0) {
          secondTime = pickedDate.getTime();
        } else {
          secondTime = new Date(year, month - 1, dateHover).getTime();
        }
      } else {
        secondTime = secondPickedDate.getTime();
      }
      const minTime = Math.min(pickedDate.getTime(), secondTime);
      const maxTime = Math.max(pickedDate.getTime(), secondTime);
      return dateTime >= minTime && dateTime <= maxTime;
    }

    return false;
  };

  const today = new Date();

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            flexGrow: 1,
            borderRadius: 2,
            maxWidth: "12vw",
            minWidth: "230px",
            maxHeight: "230px",
            height: "20vh",
          }}
        >
          <Grid container spacing={0} sx={{ borderRadius: 2 }}>
            {daysOfWeek.map((day) => (
              <Grid
                size={12 / 7}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  background: "rgba(212, 212, 212, 0.9)",
                  pt: 1,
                  pb: 1,
                }}
              >
                <Typography sx={{ fontSize: "0.85rem" }}>{t(day)}</Typography>
              </Grid>
            ))}
            {daysGrid.map((gridDayValue) => (
              <Grid
                size={12 / 7}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  background: "rgb(236, 236, 236)",
                  pt: 0.5,
                  pb: 0.5,
                }}
                onMouseEnter={() => setDateHover(gridDayValue)}
                onMouseLeave={() => setDateHover(0)}
                onClick={() => onDateClick(gridDayValue)}
              >
                {gridDayValue != 0 && (
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      justifyContent: "center",
                      cursor: "pointer",
                      borderRadius: 16,
                      ":hover": {
                        background:
                          dateHover != 0 &&
                          gridDayValue == dateHover &&
                          pickedDate?.getDate() != gridDayValue &&
                          secondPickedDate?.getDate() != gridDayValue
                            ? "rgba(117, 180, 227, 0.4)"
                            : "",
                      },
                      background:
                        (pickedDate != null &&
                          pickedDate.getDate() == gridDayValue &&
                          pickedDate.getMonth() + 1 == month &&
                          pickedDate.getFullYear() == year) ||
                        (secondPickedDate?.getDate() == gridDayValue &&
                          secondPickedDate.getMonth() + 1 == month &&
                          secondPickedDate.getFullYear() == year)
                          ? "rgba(57, 152, 224, 0.98)"
                          : checkDateRange(gridDayValue)
                            ? "rgba(131, 187, 230, 0.73)"
                            : "",
                      borderTopLeftRadius:
                        rangeDate && checkDateRange(gridDayValue - 1) ? 0 : 16,
                      borderBottomLeftRadius:
                        rangeDate && checkDateRange(gridDayValue - 1) ? 0 : 16,
                      borderTopRightRadius:
                        rangeDate && checkDateRange(gridDayValue + 1) ? 0 : 16,
                      borderBottomRightRadius:
                        rangeDate && checkDateRange(gridDayValue + 1) ? 0 : 16,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        p: "0.12rem",
                        pr: "0.25rem",
                        pl: "0.25rem",
                        borderRadius: 16,
                        textDecoration:
                          today.getDate() == gridDayValue &&
                          today.getMonth() + 1 == month &&
                          today.getFullYear() == year
                            ? "underline"
                            : "none",
                      }}
                    >
                      {gridDayValue}
                    </Typography>
                  </Box>
                )}
              </Grid>
            ))}
          </Grid>
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default GridDatePicker;
