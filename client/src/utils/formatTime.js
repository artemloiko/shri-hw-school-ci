/**
 *
 * @param {number} duration - duration specified in seconds
 * @returns {string} formatted string `H h M min`
 */
export const formatTime = (duration) => {
  const durationInMinutes = Math.round(duration / 60);
  const minutes = durationInMinutes % 60;
  const hours = (durationInMinutes - minutes) / 60;
  const minutesToShow = minutes || (duration / 60).toFixed(1);
  return hours ? `${hours} h ${minutes} min` : `${minutesToShow} min`;
};
