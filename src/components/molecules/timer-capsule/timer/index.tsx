import { memo, useMemo, useSyncExternalStore } from "react";
import RollingDigit from "@/components/atoms/rolling-digit";

const getNowSecond = () => Math.floor(Date.now() / 1000);

let second = getNowSecond();
const listeners = new Set<() => void>();

const emitIfChanged = () => {
  const next = getNowSecond();

  if (next === second) return;
  second = next;

  listeners.forEach((l) => l());
};

const scheduleSecondTicks = () => {
  const msToNextSecond = 1000 - (Date.now() % 1000);

  setTimeout(() => {
    emitIfChanged();

    setInterval(emitIfChanged, 1000);
  }, msToNextSecond);
};

scheduleSecondTicks();

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => listeners.delete(listener);
};

const getSnapshot = () => second;

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

const getTimeParts = (unixSecond: number) => {
  const d = new Date(unixSecond * 1000);
  const hours24 = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();

  const ampm = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;

  return { hours24, hours12, minutes, seconds, ampm };
};

const Timer = ({
  is24Hour,
}: {
  is24Hour: boolean;
}) => {
  const s = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const parts = useMemo(() => getTimeParts(s), [s]);
  const time = useMemo(() => {
    const mm = pad2(parts.minutes);
    const ss = pad2(parts.seconds);

    if (is24Hour) return `${pad2(parts.hours24)}:${mm}:${ss}`;

    return `${pad2(parts.hours12)}:${mm}:${ss}`;
  }, [
    is24Hour,
    parts.ampm,
    parts.hours12,
    parts.hours24,
    parts.minutes,
    parts.seconds,
  ]);
  const chars = useMemo(() => time.split(""), [time]);

  return (
    <p
      role="button"
      tabIndex={0}
      className="flex cursor-pointer items-center leading-none whitespace-nowrap select-none"
    >
      {chars.map((ch, i) =>
        ch === ":" || ch === " " ? (
          <span key={i} className="inline-block w-[1ch] text-center">
            {ch}
          </span>
        ) : (
          <RollingDigit key={i} value={ch} />
        ),
      )}
      {!is24Hour && <span className="ml-1">{parts.ampm}</span>}
    </p>
  );
};

export default memo(Timer);
