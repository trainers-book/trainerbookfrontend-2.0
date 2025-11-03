export const iafWeekFormat = (date: Date) => {
    const currentTime = date;
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