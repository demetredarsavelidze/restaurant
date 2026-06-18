export const toDateOnly = (value: string | Date) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};

export const formatDateOnly = (value: Date) => value.toISOString().slice(0, 10);
