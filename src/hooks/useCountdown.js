import { useEffect, useMemo, useState } from 'react';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

function getRemaining(targetDate) {
  const distance = Math.max(new Date(targetDate).getTime() - Date.now(), 0);

  return {
    days: Math.floor(distance / DAY),
    hours: Math.floor((distance % DAY) / HOUR),
    minutes: Math.floor((distance % HOUR) / MINUTE),
    seconds: Math.floor((distance % MINUTE) / SECOND),
    complete: distance === 0
  };
}

export function useCountdown(targetDate) {
  const stableTarget = useMemo(() => targetDate, [targetDate]);
  const [remaining, setRemaining] = useState(() => getRemaining(stableTarget));

  useEffect(() => {
    const tick = () => setRemaining(getRemaining(stableTarget));
    tick();
    const timer = window.setInterval(tick, SECOND);
    return () => window.clearInterval(timer);
  }, [stableTarget]);

  return remaining;
}
