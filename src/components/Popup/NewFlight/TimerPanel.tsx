import React, { ChangeEvent, useEffect, useState } from "react";
import { Grid, Stack, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import TimerModel from "../../timer/timer";
import { iafWeekFormat } from "../../../common/iafWeek";
import { useBackend } from "../../../context/backendContext";

interface TimerPanelProps {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFlightNumberChange?: (flightNumber: number) => void;
  onFlightTimeChange?: (flightTime: number) => void;
}

const formatTime = (totalSeconds: number): string => {
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
};

const TimerPanel: React.FC<TimerPanelProps> = ({
  onChange,
  onFlightNumberChange,
  onFlightTimeChange,
}) => {
  const { t } = useTranslation();
  const { connection } = useBackend();

  const [seconds, setSeconds] = useState(0);
  const [flightNumber, setFlightNumber] = useState<number>(1);

  const currentTime = React.useMemo(() => new Date(), []);

  const [time, setTime] = useState(
    currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  );

  useEffect(() => {
  onFlightTimeChange?.(seconds);
}, [seconds, onFlightTimeChange]);

  // 🔥 ONLY CHANGE: get max flightNumber ONCE and compute +1
  useEffect(() => {
    const fetchMaxFlightNumber = async () => {
      try {
        const res = await connection.getAllObjects("PreservedFlights");

        const flights = res?.data || res || [];

        const max = flights.reduce(
          (acc: number, f: any) => Math.max(acc, Number(f.flightNumber || 0)),
          0,
        );

        const nextFlightNumber = max + 1;

        setFlightNumber(nextFlightNumber);

        onFlightNumberChange?.(nextFlightNumber);
      } catch (err) {
        setFlightNumber(1);
      }
    };

    fetchMaxFlightNumber();
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
          <Typography sx={{ fontWeight: "bold", textAlign: "right" }}>
            {t("flightNumber")}
          </Typography>
        </Grid>
        <Grid size={4}>
          <Typography>{flightNumber}</Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="center">
        <Grid size={6}>
          <Typography sx={{ fontWeight: "bold", textAlign: "right" }}>
            {t("date")}
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography>{currentTime.toLocaleDateString("en-GB")}</Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="center">
        <Grid size={6}>
          <Typography sx={{ fontWeight: "bold", textAlign: "right" }}>
            {t("time")}
          </Typography>
        </Grid>
        <Grid size={4}>
          <TextField
            type="time"
            size="small"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="center">
        <Grid size={6}>
          <Typography sx={{ fontWeight: "bold", textAlign: "right" }}>
            {t("iafWeek")}
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography>{iafWeekFormat(new Date())}</Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="center">
        <Grid size={6}>
          <Typography sx={{ fontWeight: "bold", textAlign: "right" }}>
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
