export const iafWeekFormat = (date: Date) => {
    const day = 24 * 60 * 60 * 1000;
    const currentTime = date;
    const firstDayOfYear = new Date(currentTime.getFullYear(), 0, 1);
    const dayOfWeek = firstDayOfYear.getDay(); 
    const weekOneStart = new Date(firstDayOfYear);
  
    weekOneStart.setDate(firstDayOfYear.getDate() - dayOfWeek);
  
    const daysSinceSunday = Math.floor(
      (currentTime.getTime() - weekOneStart.getTime()) / day
    );
  
    let week = Math.floor(daysSinceSunday / 7) + 1;
  
    return week > 52 ? ((week - 1) % 52) + 1 : week
  };