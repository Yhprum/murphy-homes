export function PMT(rate: number, periods: number, present: number, future = 0) {
  if (rate === 0) {
    return (-present - future) / periods;
  } else {
    const term = Math.pow(1 + rate, periods);
    return (future * rate + present * rate * term) / (1 - term);
  }
}
