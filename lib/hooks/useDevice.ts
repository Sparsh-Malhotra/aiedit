import {useState, useEffect} from 'react';

export function useDevice() {
    const [isMobile, setIsMobile] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        const checkDevice = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        checkDevice();

        // Add event listener
        window.addEventListener('resize', checkDevice);

        // Cleanup
        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    return {isMobile, hasMounted};
}