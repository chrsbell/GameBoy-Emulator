export const remToPx = (prop: string) =>
  parseInt(getComputedStyle(document.documentElement).fontSize) *
  parseInt(prop);
