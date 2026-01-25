export const formatNumber = (value) =>
  new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 2 }).format(value);

export const formatCurrency = (value) =>
  new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(value);

export const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
};
