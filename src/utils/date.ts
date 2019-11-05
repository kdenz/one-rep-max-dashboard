import dayjs from "dayjs";

// Formats date into "Nov 6" for example
export const formatDate = (date: string, full?: boolean) => {
  return dayjs(date).format(full ? "MM/DD/YY" : "MMM D");
};
