export const DATE_TYPES = {
  DATE: 'date',
  RANGE: 'range',
};

export const DEFAULT_PLUS_DAYS = 0;

function clampNonNegative(value, fallback = 0) {
  const normalized = Number(value);
  if (!Number.isFinite(normalized)) {
    return fallback;
  }

  return Math.max(0, Math.floor(normalized));
}

export function getDefaultInitialDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return tomorrow;
}

export function toDate(value, fallback = new Date()) {
  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return parseLocalDate(value);
  }

  const normalized = new Date(value ?? fallback);
  normalized.setHours(0, 0, 0, 0);

  return normalized;
}

export function parseLocalDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  const normalized = new Date(year, month - 1, day);
  normalized.setHours(0, 0, 0, 0);

  return normalized;
}

export function formatLocalDate(date) {
  const normalized = toDate(date);
  const year = normalized.getFullYear();
  const month = String(normalized.getMonth() + 1).padStart(2, '0');
  const day = String(normalized.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function addLocalDays(date, days) {
  const normalized = toDate(date);
  normalized.setDate(normalized.getDate() + Number(days || 0));

  return normalized;
}

export function isSameLocalDate(left, right) {
  return formatLocalDate(left) === formatLocalDate(right);
}

export function getInclusiveDateDiff(startDate, endDate) {
  const start = toDate(startDate);
  const end = toDate(endDate);
  const diff = end.getTime() - start.getTime();
  const days = Math.round(diff / (1000 * 60 * 60 * 24));

  return Math.max(1, days + 1);
}

export function normalizeDateValue(dateValue, initialDate = getDefaultInitialDate()) {
  const rawDate = toDate(dateValue?.rawDate ?? initialDate);
  const plusDays = clampNonNegative(dateValue?.plusDays, DEFAULT_PLUS_DAYS);
  const dateType = Object.values(DATE_TYPES).includes(dateValue?.dateType)
    ? dateValue.dateType
    : DATE_TYPES.DATE;

  const fallbackAdditionalDays = dateType === DATE_TYPES.DATE ? plusDays + 1 : Math.max(1, plusDays * 2 + 1);
  const additionalDays = Math.max(
    1,
    clampNonNegative(dateValue?.additionalDays, fallbackAdditionalDays) || fallbackAdditionalDays,
  );

  return {
    rawDate,
    plusDays,
    additionalDays,
    dateType,
  };
}

export function getDateRangeEndDate(dateValue, initialDate = getDefaultInitialDate()) {
  const normalizedDate = normalizeDateValue(dateValue, initialDate);
  return addLocalDays(normalizedDate.rawDate, normalizedDate.additionalDays - 1);
}

export function getDateRangeLabel(dateValue, formatter, initialDate = getDefaultInitialDate()) {
  const normalizedDate = normalizeDateValue(dateValue, initialDate);
  const endDate = getDateRangeEndDate(normalizedDate, initialDate);

  return `${formatter(normalizedDate.rawDate)} - ${formatter(endDate)}`;
}

export function buildDateSearchQuery(dateValue, initialDate = getDefaultInitialDate()) {
  const normalizedDate = normalizeDateValue(dateValue, initialDate);

  return {
    checkIn: formatLocalDate(normalizedDate.rawDate),
    checkTo: formatLocalDate(getDateRangeEndDate(normalizedDate, initialDate)),
    plusDays: normalizedDate.plusDays,
    dateType: normalizedDate.dateType,
  };
}

export function parseDateQuery(query, initialDate = getDefaultInitialDate()) {
  if (!query?.checkIn || !query?.checkTo) {
    return null;
  }

  const rawDate = parseLocalDate(query.checkIn);
  const endDate = parseLocalDate(query.checkTo);
  const additionalDays = getInclusiveDateDiff(rawDate, endDate);

  const hasNewPickerParams = query.plusDays !== undefined || query.dateType !== undefined;
  if (hasNewPickerParams) {
    return normalizeDateValue(
      {
        rawDate,
        plusDays: query.plusDays,
        additionalDays,
        dateType: query.dateType,
      },
      initialDate,
    );
  }

  const legacyType = isSameLocalDate(rawDate, initialDate) ? DATE_TYPES.DATE : DATE_TYPES.RANGE;
  const plusDays = legacyType === DATE_TYPES.DATE ? additionalDays - 1 : Math.floor((additionalDays - 1) / 2);

  return normalizeDateValue(
    {
      rawDate,
      plusDays,
      additionalDays,
      dateType: legacyType,
    },
    initialDate,
  );
}
