import dayjs from "dayjs";
import "dayjs/locale/en";
import { useEffect, useMemo } from "react";

const APP_DAYJS_LOCALE = "en" as const;

dayjs.locale(APP_DAYJS_LOCALE);

export function useDayjs(): typeof dayjs {
  const locale = APP_DAYJS_LOCALE;

  useEffect(() => {
    dayjs.locale(locale);
  }, [locale]);

  return useMemo(() => dayjs, [locale]);
}
