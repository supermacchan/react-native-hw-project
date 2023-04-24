import date from "date-and-time";

export default commentDayandTime = () => {
  const now = new Date();
  return date.format(now, "DD MMM, YYYY | HH:mm");
};
