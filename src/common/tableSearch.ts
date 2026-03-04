import { useCallback } from "react";

export const useTableSearch = () => {
  const cellValueToSearchText = useCallback((value: unknown): string => {
    if (value === null || value === undefined) {
      return "";
    }

    if (value instanceof Date) {
      return `${value.toLocaleDateString("en-GB")} ${value.toLocaleTimeString(
        [],
        {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        },
      )}`;
    }

    if (Array.isArray(value)) {
      return value.map(cellValueToSearchText).filter(Boolean).join(", ");
    }

    return String(value);
  }, []);

  const digitsOnly = useCallback((text: string): string => {
    return text.replace(/\D/g, "");
  }, []);

  const rowMatchesSearch = useCallback(
    (row: any, properties: string[], query: string): boolean => {
      const normalizedQuery = query.trim().toLowerCase();
      if (normalizedQuery === "") {
        return true;
      }

      const numericQuery = /^\d+$/.test(normalizedQuery)
        ? normalizedQuery
        : null;

      for (const prop of properties) {
        const raw = row?.[prop];
        const haystack = cellValueToSearchText(raw).toLowerCase();

        if (haystack.includes(normalizedQuery)) {
          return true;
        }

        if (numericQuery) {
          const hayDigits = digitsOnly(haystack);
          if (hayDigits.includes(numericQuery)) {
            return true;
          }
        }
      }

      return false;
    },
    [cellValueToSearchText, digitsOnly],
  );

  return { cellValueToSearchText, digitsOnly, rowMatchesSearch };
};
