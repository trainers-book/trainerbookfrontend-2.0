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
  pickCallback: (
    picked: { date: Date } | { minDate: Date; maxDate: Date }
  ) => void;
}

const GridDatePicker: React.FC<GridDatePickerProps> = ({
  year,
  month,
  rangeDate,
  pickCallback,
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

  const onDateClick = (day: number) => {
    if (day == 0) {
      return;
    }

    if (rangeDate) {
      if (pickedDate == null) {
        setPickedDate(new Date(year, month - 1, day));
      } else if (secondPickedDate == null) {
        const selected = new Date(year, month - 1, day);
        setSecondPickedDate(selected);
        pickCallback({
          minDate:
            pickedDate.getTime() <= selected.getTime() ? pickedDate : selected,
          maxDate:
            pickedDate.getTime() > selected.getTime() ? pickedDate : selected,
        });
      } else {
        setPickedDate(null);
        setSecondPickedDate(null);
      }
    } else {
      const selected = new Date(year, month - 1, day);
      setPickedDate(selected);
      pickCallback({ date: selected });
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

  const styleOverride = true;
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
                  <Typography
                    sx={{
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      p: "0.12rem",
                      pr: "0.25rem",
                      pl: "0.25rem",
                      ":hover": {
                        background:
                          gridDayValue == dateHover &&
                          pickedDate?.getDate() != gridDayValue &&
                          secondPickedDate?.getDate() != gridDayValue
                            ? "rgba(117, 180, 227, 0.4)"
                            : "",
                        borderRadius: 16,
                      },
                      background:
                        (pickedDate?.getDate() == gridDayValue &&
                          pickedDate?.getMonth() + 1 == month &&
                          pickedDate.getFullYear() == year) ||
                        (secondPickedDate?.getDate() == gridDayValue &&
                          secondPickedDate.getMonth() + 1 == month &&
                          secondPickedDate.getFullYear() == year)
                          ? "rgba(57, 152, 224, 0.98)"
                          : today.getDate() == gridDayValue &&
                              today.getMonth() + 1 == month &&
                              today.getFullYear() == year
                            ? "rgba(65, 163, 238, 0.79)"
                            : checkDateRange(gridDayValue)
                              ? "rgba(131, 187, 230, 0.73)"
                              : "",
                      borderRadius: 16,
                      borderTopLeftRadius:
                        !styleOverride &&
                        rangeDate &&
                        checkDateRange(gridDayValue - 1)
                          ? 0
                          : 16,
                      borderBottomLeftRadius:
                        !styleOverride &&
                        rangeDate &&
                        checkDateRange(gridDayValue - 1)
                          ? 0
                          : 16,
                      borderTopRightRadius:
                        !styleOverride &&
                        rangeDate &&
                        checkDateRange(gridDayValue + 1)
                          ? 0
                          : 16,
                      borderBottomRightRadius:
                        !styleOverride &&
                        rangeDate &&
                        checkDateRange(gridDayValue + 1)
                          ? 0
                          : 16,
                    }}
                  >
                    {gridDayValue}
                  </Typography>
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
