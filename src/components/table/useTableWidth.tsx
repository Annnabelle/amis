import { useEffect, useRef, useState } from 'react';

export function useTableWidth() {
    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new ResizeObserver((entries) => {
            setWidth(entries[0].contentRect.width);
        });

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);

    return { ref, width };
}
