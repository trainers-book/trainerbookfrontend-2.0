import React, { ChangeEvent, useState } from "react";
import { Grid, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import TimerModel from "../../timer/timer";

interface TimerPanel {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const formatTime = (totalSeconds: number): string => {
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
};

const iafWeekFormat = () => {
  const currentTime = new Date( );
  const firstDayOfYear = new Date(currentTime.getFullYear(), 0, 1);
  const firstDayOfNextYear = new Date(currentTime.getFullYear() + 1, 0, 1);
  const daysInYear = Math.floor(
    (currentTime.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24)
  );
  const weekNumber = Math.floor(daysInYear / 7) + 1;
  const sameWeekAsNextYear =
    Math.floor(
      (currentTime.getTime() - firstDayOfNextYear.getTime()) /
        (1000 * 60 * 60 * 24)
    ) >= -6 &&
    Math.floor(
      (currentTime.getTime() - firstDayOfNextYear.getTime()) /
        (1000 * 60 * 60 * 24)
    ) <= 0;
  return sameWeekAsNextYear || weekNumber > 52 ? 1 : weekNumber;
};

const TimerPanel: React.FC<TimerPanel> = ({ onChange }) => {
  const { t } = useTranslation();
  const [seconds, setSeconds] = useState(0);
  const currentTime = React.useMemo(() => new Date(), []);

  return (
    <Stack spacing={2}>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {t("flightNumber")}
          </Typography>
        </Grid>
        <Grid size={4}>
          <Typography>{t("later")}</Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {t("date")}
          </Typography>
        </Grid>
        <Grid size={4}>
          <Typography>{currentTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })}</Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {t("time")}
          </Typography>
        </Grid>
        <Grid size={4}>
          <Typography>
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {t("iafWeek")}
          </Typography>
        </Grid>
        <Grid size={4}>
          <Typography>{iafWeekFormat()}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {t("goTime")}
          </Typography>
        </Grid>
        <Grid size={4}>
          <Typography>{formatTime(seconds)}</Typography>
        </Grid>
      </Grid>

      <TimerModel
        onTick={(val) => setSeconds(val)}
        label={t("startFlight")}
        onChange={onChange}
      />
    </Stack>
  );
};

export default TimerPanel;
