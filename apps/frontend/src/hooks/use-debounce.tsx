import { useEffect, useCallback, DependencyList } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useDebounce(
  effect: () => void,
  dependencies: DependencyList,
  delay: number,
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callback = useCallback(effect, dependencies);

  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
}
