import { isNil } from 'ramda';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useThrottle = () => {
  const throttleId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isThrottle = useRef<boolean>(false);
  const [disabled, setDisabled] = useState(false);
  const _clearTimerSubscription = useCallback(() => {
    if (!isNil(throttleId.current)) {
      clearTimeout(throttleId.current);
    }
  }, [throttleId]);

  const manageThrottle = useCallback(
    (timeout: number) => {
      isThrottle.current = true;
      throttleId.current = setTimeout(() => {
        isThrottle.current = false;
      }, timeout);
    },
    [isThrottle],
  );

  const manageDisable = useCallback((timeout: number) => {
    setDisabled(() => true);
    throttleId.current = setTimeout(() => {
      setDisabled(false);
    }, timeout);
  }, []);

  useEffect(() => _clearTimerSubscription, [_clearTimerSubscription]);

  return {
    isThrottle,
    manageThrottle,
    manageDisable,
    disabled,
  };
};
