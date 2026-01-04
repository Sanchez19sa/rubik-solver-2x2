import { useState, useRef, useCallback } from 'react';

export const useDrag = () => {
    const [transform, setTransform] = useState('rotateX(-25deg) rotateY(-45deg)');
    const currentRotation = useRef({ x: -25, y: -45 });
    const isDragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });

    const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
        isDragging.current = true;
        const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
        lastPos.current = { x: cx, y: cy };
    };

    const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging.current) return;
        const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
        
        const deltaX = cx - lastPos.current.x;
        const deltaY = cy - lastPos.current.y;
        
        currentRotation.current.y += deltaX * 0.5;
        currentRotation.current.x -= deltaY * 0.5;
        
        setTransform(`rotateX(${currentRotation.current.x}deg) rotateY(${currentRotation.current.y}deg)`);
        lastPos.current = { x: cx, y: cy };
    };

    const rotateTo = useCallback((x: number, y: number) => {
        currentRotation.current = { x, y };
        setTransform(`rotateX(${x}deg) rotateY(${y}deg)`);
    }, []);

    const resetView = useCallback(() => {
        rotateTo(-25, -45);
    }, [rotateTo]);

    return {
        transform,
        isDragging,
        handlePointerDown,
        handlePointerMove,
        rotateTo,
        resetView,
        currentRotation
    };
};

