import { CURRENCY_CODE, LOCALE } from "@/constants";

export const formatCurrency = (n: number) => {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY_CODE,
  }).format(n);
};
