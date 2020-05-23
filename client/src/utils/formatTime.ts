import { TFunction } from 'i18next';

/**
 * @param {number} duration - duration specified in seconds
 * @returns {string} formatted string `H h M min`
 */
export const formatTime = (duration: number, t: TFunction): string => {
  const durationInMinutes = Math.round(duration / 60);
  const minutes = durationInMinutes % 60;
  const hours = (durationInMinutes - minutes) / 60;
  const formattedHHMM = hours
    ? t('{{X}} h {{Y}} min', { X: hours, Y: minutes })
    : t('{{Y}} min', { Y: minutes });
  return duration > 60 ? formattedHHMM : t('{{Z}} sec', { Z: duration });
};
