import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Grid, Stack, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import TimerModel from "../../timer/timer";
import { iafWeekFormat } from "../../../common/iafWeek";
import { useBackend } from "../../../context/backendContext";

interface TimerPanelProps {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFlightNumberChange?: (flightNumber: number) => void;
  onFlightTimeChange?: (flightTime: number) => void;
  onDateTimeChange?: (dateTime: Date) => void;
}

const dateInputValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const TimerPanel: React.FC<TimerPanelProps> = ({
  onChange,
  onFlightNumberChange,
  onFlightTimeChange,
  onDateTimeChange,
}) => {
  const { t } = useTranslation();
  const { connection } = useBackend();

  const [seconds, setSeconds] = useState(0);
  const [flightNumber, setFlightNumber] = useState<number>(1);

  const currentTime = React.useMemo(() => new Date(), []);
  const [date, setDate] = useState(dateInputValue(currentTime));

  const [time, setTime] = useState(
    currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  );
  const selectedDateTime = React.useMemo(
    () => new Date(`${date}T${time}`),
    [date, time],
  );

  useEffect(() => {
    onDateTimeChange?.(selectedDateTime);
  }, [selectedDateTime, onDateTimeChange]);

  const handleFlightTimeChange = (
    unit: "hours" | "minutes" | "seconds",
    value: string,
  ) => {
    const numericValue = Math.max(0, Number(value) || 0);
    const currentHours = Math.floor(seconds / 3600);
    const currentMinutes = Math.floor((seconds % 3600) / 60);
    const currentSeconds = seconds % 60;
    const nextSeconds =
      (unit === "hours" ? numericValue : currentHours) * 3600 +
      (unit === "minutes" ? numericValue : currentMinutes) * 60 +
      (unit === "seconds" ? numericValue : currentSeconds);

    setSeconds(nextSeconds);
    onFlightTimeChange?.(nextSeconds);
  };
  const timerInputSx = {
    width: 38,
    flex: "0 0 38px",
    "& .MuiOutlinedInput-root": {
      width: 38,
      height: 32,
    },
    "& .MuiInputBase-input": {
      textAlign: "center",
      p: 0,
    },
  };
  const timerInputStyle = {
    textAlign: "center" as const,
    paddingLeft: 0,
    paddingRight: 0,
  };

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
          <TextField
            type="date"
            size="small"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
          />
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
          <Typography>{iafWeekFormat(selectedDateTime)}</Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="center">
        <Grid size={6}>
          <Typography sx={{ fontWeight: "bold", textAlign: "right" }}>
            {t("flightTime")}
          </Typography>
        </Grid>
        <Grid
          size={6}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            direction: "ltr",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              direction: "ltr",
              gap: 0.5,
            }}
          >
            <TextField
              type="number"
              size="small"
              sx={timerInputSx}
              value={Math.floor(seconds / 3600)}
              onChange={(e) => handleFlightTimeChange("hours", e.target.value)}
              slotProps={{ htmlInput: { min: 0, style: timerInputStyle } }}
            />
            <Typography>:</Typography>
            <TextField
              type="number"
              size="small"
              sx={timerInputSx}
              value={Math.floor((seconds % 3600) / 60)}
              onChange={(e) =>
                handleFlightTimeChange("minutes", e.target.value)
              }
              slotProps={{
                htmlInput: { min: 0, max: 59, style: timerInputStyle },
              }}
            />
            <Typography>:</Typography>
            <TextField
              type="number"
              size="small"
              sx={timerInputSx}
              value={seconds % 60}
              onChange={(e) =>
                handleFlightTimeChange("seconds", e.target.value)
              }
              slotProps={{
                htmlInput: { min: 0, max: 59, style: timerInputStyle },
              }}
            />
          </Box>
        </Grid>
      </Grid>

      <TimerModel
        onTick={(val) => {
          setSeconds(val);
          onFlightTimeChange?.(val);
        }}
        label={t("startFlight")}
        onChange={onChange}
      />
    </Stack>
  );
};

export default TimerPanel;
