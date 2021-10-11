export const remToPx = (prop: string): number =>
  parseInt(getComputedStyle(document.documentElement).fontSize) *
  parseInt(prop);
