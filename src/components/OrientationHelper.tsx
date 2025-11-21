import type { FacePosition } from '../types';

export const OrientationHelper = ({ face }: { face: FacePosition }) => {
    let rotX = -25, rotY = -45;
    if (face === 'F') { rotX = 0; rotY = 0; }
    if (face === 'R') { rotX = 0; rotY = -90; }
    if (face === 'B') { rotX = 0; rotY = -180; }
    if (face === 'L') { rotX = 0; rotY = 90; }
    if (face === 'U') { rotX = 90; rotY = 0; }
    if (face === 'D') { rotX = -90; rotY = 0; }

    return (
        <div className="w-24 h-24 relative perspective flex items-center justify-center mb-2 scale-75">
            <div className="w-16 h-16 transform-style-3d transition-transform duration-500 ease-out" style={{ transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)` }}>
                <div className="absolute inset-0 bg-gray-700 border border-gray-500 opacity-30 transform translate-z-8" style={{ transform: 'translateZ(32px)' }} />
                <div className="absolute inset-0 bg-gray-700 border border-gray-500 opacity-30 transform translate-z-8 rotate-y-90" style={{ transform: 'rotateY(90deg) translateZ(32px)' }} />
                <div className="absolute inset-0 bg-emerald-500 border-2 border-white animate-pulse flex items-center justify-center text-xs font-bold text-black" style={{ 
                    transform: face === 'F' ? 'translateZ(34px)' :
                               face === 'R' ? 'rotateY(90deg) translateZ(34px)' :
                               face === 'B' ? 'rotateY(180deg) translateZ(34px)' :
                               face === 'L' ? 'rotateY(-90deg) translateZ(34px)' :
                               face === 'U' ? 'rotateX(90deg) translateZ(34px)' :
                               'rotateX(-90deg) translateZ(34px)'
                }}>{face}</div>
            </div>
        </div>
    );
};

