import React from 'react';
import { Eye } from 'lucide-react';
import { Cubie } from '../Cubie';
import { ArrowOverlay } from '../ArrowOverlay';
import type { CubeState, FacePosition, Color } from '../../types';

// Configuración de los cubies
const OFFSET = 40; 
const CUBIES_CONFIG = [
    { id: 0, pos: [-OFFSET, -OFFSET, OFFSET],  faces: { U: 2, L: 1, F: 0 } }, 
    { id: 1, pos: [OFFSET, -OFFSET, OFFSET],   faces: { U: 3, R: 0, F: 1 } }, 
    { id: 2, pos: [-OFFSET, -OFFSET, -OFFSET], faces: { U: 0, L: 0, B: 1 } }, 
    { id: 3, pos: [OFFSET, -OFFSET, -OFFSET],  faces: { U: 1, R: 1, B: 0 } }, 
    { id: 4, pos: [-OFFSET, OFFSET, OFFSET],   faces: { D: 0, L: 3, F: 2 } }, 
    { id: 5, pos: [OFFSET, OFFSET, OFFSET],    faces: { D: 1, R: 2, F: 3 } }, 
    { id: 6, pos: [-OFFSET, OFFSET, -OFFSET],  faces: { D: 2, L: 2, B: 3 } }, 
    { id: 7, pos: [OFFSET, OFFSET, -OFFSET],   faces: { D: 3, R: 3, B: 2 } }, 
];

interface CubeViewProps {
    state: CubeState;
    transform: string;
    activeRotation: { axis: string, value: number, cubies: number[] } | null;
    animatingMove: string | null;
    isHinting?: boolean;
    isDragging?: React.MutableRefObject<boolean>;
    handlePointerDown?: (e: React.MouseEvent | React.TouchEvent) => void;
    handlePointerMove?: (e: React.MouseEvent | React.TouchEvent) => void;
    onResetView?: () => void;
    variant?: 'default' | 'mini';
}

export const CubeView = ({ 
    state, transform, activeRotation, animatingMove, 
    isHinting = false, 
    isDragging, 
    handlePointerDown, 
    handlePointerMove, 
    onResetView,
    variant = 'default'
}: CubeViewProps) => {
    
    const isMini = variant === 'mini';

    const containerClasses = isMini
        ? "relative w-full h-full flex items-center justify-center perspective pointer-events-none" 
        : "flex-1 relative flex items-center justify-center perspective bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-950 to-black cursor-move touch-none"; 

    return (
        <div 
            className={containerClasses}
            onMouseDown={!isMini ? handlePointerDown : undefined} 
            onMouseMove={!isMini ? handlePointerMove : undefined} 
            onMouseUp={!isMini && isDragging ? () => isDragging.current = false : undefined} 
            onMouseLeave={!isMini && isDragging ? () => isDragging.current = false : undefined}
            onTouchStart={!isMini ? handlePointerDown : undefined} 
            onTouchMove={!isMini ? handlePointerMove : undefined} 
            onTouchEnd={!isMini && isDragging ? () => isDragging.current = false : undefined}
        >
            <div 
                className="relative w-0 h-0 transform-style-3d" 
                style={{ 
                  transform: transform,
                  // CAMBIO: Aumentado a 1.5s para movimientos más suaves y controlados.
                  transition: isDragging?.current ? 'none' : isHinting ? 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)' 
                }}
            >
                {CUBIES_CONFIG.map((config) => {
                    const cubieColors: Partial<Record<FacePosition, Color>> = {};
                    Object.entries(config.faces).forEach(([face, index]) => {
                        cubieColors[face as FacePosition] = state[face as FacePosition][index];
                    });

                    let rotation = '';
                    let duration = 0;
                    if (activeRotation && activeRotation.cubies.includes(config.id)) {
                        rotation = `rotate${activeRotation.axis}(${activeRotation.value}deg)`;
                        duration = isHinting ? 1500 : 300; 
                    }

                    return (
                        <Cubie 
                            key={config.id}
                            position={config.pos as [number, number, number]}
                            colors={cubieColors}
                            size={80}
                            rotation={rotation}
                            transitionDuration={duration}
                        />
                    );
                })}

                {animatingMove && <ArrowOverlay move={animatingMove} />}
            </div>

            {(!animatingMove && !isHinting && !isMini && onResetView) && (
                <button onClick={onResetView} className="absolute bottom-6 right-6 bg-gray-800/80 p-3 rounded-full text-white hover:bg-gray-700 backdrop-blur-sm border border-gray-700 shadow-lg z-40 transition-transform active:scale-95"><Eye size={24}/></button>
            )}
            
            <style>{`
                .perspective { perspective: 800px; }
                .transform-style-3d { transform-style: preserve-3d; }
            `}</style>
        </div>
    );
};

