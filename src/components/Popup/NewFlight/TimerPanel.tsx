import React, { ChangeEvent, useState } from "react";
import { Grid, Stack, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import TimerModel from "../../timer/timer";
import { iafWeekFormat } from "../../../common/iafWeek";
import { useBackend } from "../../../context/backendContext";

interface TimerPanel {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const formatTime = (totalSeconds: number): string => {
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
};

const TimerPanel: React.FC<TimerPanel> = ({ onChange }) => {
  const { t } = useTranslation();
  const [seconds, setSeconds] = useState(0);
  // default to 1 so when there are no preserved flights the next number is 1
  const [nextFlightNumber, setNextFlightNumber] = useState<number>(1);
  const { connection } = useBackend();
  const currentTime = React.useMemo(() => new Date(), []);
  const [time, setTime] = useState(
    currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  );

  useEffect(() => {
    let mounted = true;
    const fetchMaxId = async () => {
      try {
        const res = await connection.getAllEntities("PreservedFlights");
        if (res && res.status === 200 && Array.isArray(res.data)) {
          const maxId = res.data.reduce((max: number, item: any) => {
            const id =
              typeof item._id === "number"
                ? item._id
                : parseInt(item._id, 10) || 0;
            return id > max ? id : max;
          }, 0);
          if (mounted) setNextFlightNumber(maxId + 1);
        } else {
          if (mounted) setNextFlightNumber(1);
        }
      } catch (err) {
        if (mounted) setNextFlightNumber(1);
      }
    };

    fetchMaxId();
    return () => {
      mounted = false;
    };
  }, [connection]);

  return (
    <Stack
      spacing={2}
      sx={{
        border: "1px solid rgba(204, 204, 204, 1)",
        padding: 2,
        borderRadius: 4,
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid size={6}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", textAlign: "right", width: "100%" }}
          >
            {t("flightNumber")}
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography>{t("later")}</Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="center">
        <Grid size={6}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", textAlign: "right", width: "100%" }}
          >
            {t("date")}
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography>
            {currentTime.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="center">
        <Grid size={6}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", textAlign: "right", width: "100%" }}
          >
            {t("time")}
          </Typography>
        </Grid>
        <Grid size={5}>
          <TextField
            type="time"
            size="small"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            inputProps={{
              step: 60,
              style: { direction: "ltr" },
            }}
            sx={{
              "& .MuiInputBase-root": {
                height: 32,
                fontSize: "1rem",
              },
              "& input": {
                textAlign: "center",
                padding: "4px 8px",
              },
            }}
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="center">
        <Grid size={6}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", textAlign: "right", width: "100%" }}
          >
            {t("iafWeek")}
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography>{iafWeekFormat(new Date())}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="center">
        <Grid size={6}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", textAlign: "right", width: "100%" }}
          >
            {t("goTime")}
          </Typography>
        </Grid>
        <Grid size={6}>
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
