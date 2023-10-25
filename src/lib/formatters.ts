const formatter = new Intl.NumberFormat("en", {
  style: "currency",
  currency: "USD",
});

export const currency = (num: number | string) =>
  num || num === 0 ? formatter.format(typeof num === "number" ? num : Number(num)) : null;

export const percent = (num: number) => (num * 100).toFixed(2) + "%";
