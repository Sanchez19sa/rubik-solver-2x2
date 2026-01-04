import { useState } from 'react';
import type { Color, FacePosition } from '../../cube/types';

export const usePaintState = () => {
    const [selectedColor, setSelectedColor] = useState<Color>('R');
    const [paintFaceIdx, setPaintFaceIdx] = useState(0); 
    const paintOrder: FacePosition[] = ['F', 'R', 'B', 'L', 'U', 'D'];
    const currentFace = paintOrder[paintFaceIdx];

    const nextFace = () => setPaintFaceIdx(i => (i + 1) % 6);
    const prevFace = () => setPaintFaceIdx(i => (i - 1 + 6) % 6);

    return {
        selectedColor,
        setSelectedColor,
        currentFace,
        nextFace,
        prevFace
    };
};

