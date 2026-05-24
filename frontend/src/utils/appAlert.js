export const APP_ALERT_EVENT = 'app-alert';

export const showAppAlert = (config) => {
  if (typeof window === 'undefined') return;

  const detail =
    typeof config === 'string'
      ? { message: config }
      : config;

  window.dispatchEvent(new CustomEvent(APP_ALERT_EVENT, { detail }));
};
