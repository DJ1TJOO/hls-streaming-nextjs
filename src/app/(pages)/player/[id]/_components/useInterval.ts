import { useEffect, useRef } from "react";

export function useInterval(delay: number, callback: () => void) {
    const savedCallback = useRef<(() => void) | null>(null);

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        function tick() {
            savedCallback.current?.();
        }

        let id = setInterval(tick, delay);
        return () => clearInterval(id);
    }, [delay]);
}
