import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

interface TimerModelProps {
  onTick?: (seconds: number) => void;
  label: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  resetKey?: number;
}

const TimerModel: React.FC<TimerModelProps> = ({
  onTick,
  label,
  onChange,
  resetKey,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPause, setPause] = useState(false);
  const [isReset, setReset] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTickRef = useRef(onTick);
  const onChangeRef = useRef(onChange);
  const { t } = useTranslation();

  useEffect(() => {
    onTickRef.current = onTick;
    onChangeRef.current = onChange;
  }, [onTick, onChange]);

  useEffect(() => {
    if (resetKey === undefined) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    setPause(false);
    setReset(true);
    setSeconds(0);
    onTickRef.current?.(0);
    onChangeRef.current?.({
      target: { checked: false },
    } as ChangeEvent<HTMLInputElement>);
  }, [resetKey]);

  useEffect(() => {
    if (isRunning) {
      onChange?.({
        target: { checked: true },
      } as ChangeEvent<HTMLInputElement>);
    } else if ((isReset)) {
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
    setReset(true);
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

  const buttonSx = {
    minWidth: 62,
    height: 36,
    whiteSpace: "nowrap",
    px: 1.5,
  };

  return (
    <Stack
      spacing={1}
      direction="row"
      sx={{
        alignItems: "center",
        flexWrap: "nowrap",
        "& .MuiButton-root": buttonSx,
      }}
    >
      {!isRunning && !isPause ? (
        <Stack
          direction="row"
          sx={{
            flexWrap: "nowrap",
            gap: "4px",
          }}
        >
          <Button variant="contained" color="success" onClick={start}>
            {label}
          </Button>
          {!isRunning && seconds > 0 && (
            <Button
              variant="contained"
              sx={{ background: "rgba(128, 128, 128, 1)" }}
              onClick={reset}
            >
              {t("clear")}
            </Button>
          )}
        </Stack>
      ) : (
        <Stack
          direction="row"
          sx={{
            flexWrap: "nowrap",
            gap: "4px",
          }}
        >
          <Button
            variant="contained"
            sx={{ background: "rgba(46, 45, 45, 1)" }}
            onClick={isPause ? resume : pause}
          >
            {isPause ? t("resume") : t("stop")}
          </Button>
          <Button
            variant="contained"
            sx={{ background: "rgba(128, 128, 128, 1)" }}
            onClick={reset}
          >
            {t("clear")}
          </Button>
          <Button variant="contained" color="error" onClick={stop}>
            {t("done")}
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default TimerModel;
