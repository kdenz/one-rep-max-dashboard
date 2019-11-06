export const calcOneRepMax = (weight: number, reps: number) => {
  if (reps >= 37 || weight < 0 || reps < 0) {
    return null;
  }

  return (weight * 36) / (37 - reps);
};
