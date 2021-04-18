import { useEffect, useState } from 'react'

export const useOnClickOutside = (ref, handler) => {
    useEffect(() => {
        const listener = event => {
            if (!ref.current || ref.current.contains(event.target)) {
                return
            }
            handler(event)
        }
        document.addEventListener('mousedown', listener)
        return() => {
            document.addEventListener('mousedown', listener)
        }
    },
    [ref,handler]
    )
}

export function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });
    
    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowSize;
}