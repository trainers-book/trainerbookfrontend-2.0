import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button, Grid, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

interface TimerModelProps {
  onTick?: (seconds: number) => void;
  label: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const TimerModel: React.FC<TimerModelProps> = ({ onTick, label, onChange }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPause, setPause] = useState(false);
  const [isReset, setReset] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (isRunning) {
      onChange?.({
        target: { checked: true },
      } as ChangeEvent<HTMLInputElement>);
    } else if (!isRunning && seconds > 0) {
      onChange?.({
        target: { checked: false },
      } as ChangeEvent<HTMLInputElement>);
    }
  }, [isRunning, seconds, onChange]);

  const start = () => {
    if (isRunning) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        const next = prev + 1;
        onTick?.(next);
        return next;
      });
    }, 1000);
  };

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setPause(false);
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setReset(false);
    setPause(false);
    setSeconds(0);
    onTick?.(0);
  };

  const pause = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPause(true);
    setIsRunning(false);
  };

  const resume = () => {
    setIsRunning(true);
    setPause(false);
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        const next = prev + 1;
        onTick?.(next);
        return next;
      });
    }, 1000);
  };

  return (
    <Stack spacing={1} direction="row">
      {!isRunning && !isPause ? (
        <Stack direction="row" spacing={2}>
          <Grid size={18}>
            <Button variant="contained" color="success" onClick={start}>
              {label}
            </Button>
          </Grid>
          {!isRunning && seconds > 0 && (
            <Grid size={7}>
              <Button
                variant="contained"
                sx={{ background: "gray" }}
                onClick={reset}
              >
                {t("clear")}
              </Button>
            </Grid>
          )}
        </Stack>
      ) : (
        <Stack direction="row" spacing={1}>
          <Grid size={5}>
            <Button
              variant="contained"
              sx={{ background: "#2e2d2d" }}
              onClick={isPause ? resume : pause}
            >
              {isPause ? t("resume") : t("stop")}
            </Button>
          </Grid>
          <Grid size={4.5}>
            <Button
              variant="contained"
              sx={{ background: "gray" }}
              onClick={reset}
            >
              {t("clear")}
            </Button>
          </Grid>
          <Grid size={4.5}>
            <Button variant="contained" color="error" onClick={stop}>
              {t("done")}
            </Button>
          </Grid>
        </Stack>
      )}
    </Stack>
  );
};

export default TimerModel;
