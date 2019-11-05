import dayjs from "dayjs";

// Formats date into "Nov 6" for example
export const formatDate = (date: string) => {
  return dayjs(date).format("MMM D");
};
