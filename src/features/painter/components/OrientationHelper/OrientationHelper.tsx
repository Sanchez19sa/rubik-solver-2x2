import type { FacePosition } from '../../../cube/types';

export const OrientationHelper = ({ face }: { face: FacePosition }) => {
    let rotX = -25, rotY = -45;
    if (face === 'F') { rotX = 0; rotY = 0; }
    if (face === 'R') { rotX = 0; rotY = -90; }
    if (face === 'B') { rotX = 0; rotY = -180; }
    if (face === 'L') { rotX = 0; rotY = 90; }
    if (face === 'U') { rotX = 90; rotY = 0; }
    if (face === 'D') { rotX = -90; rotY = 0; }

    const faceStyle: React.CSSProperties = {
        position: 'absolute',
        inset: 0,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        border: '1px solid rgba(156, 163, 175, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    return (
        <div className="w-24 h-24 relative flex items-center justify-center mb-4" style={{ perspective: '800px' }}>
            <div className="w-16 h-16 relative transition-transform duration-500 ease-out" 
                 style={{ 
                    transformStyle: 'preserve-3d', 
                    transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)` 
                 }}>
                <div className="bg-gray-700/30" style={{ ...faceStyle, transform: 'translateZ(32px)' }} />
                <div className="bg-gray-700/30" style={{ ...faceStyle, transform: 'rotateY(90deg) translateZ(32px)' }} />
                <div className="bg-gray-700/30" style={{ ...faceStyle, transform: 'rotateY(180deg) translateZ(32px)' }} />
                <div className="bg-gray-700/30" style={{ ...faceStyle, transform: 'rotateY(-90deg) translateZ(32px)' }} />
                <div className="bg-gray-700/30" style={{ ...faceStyle, transform: 'rotateX(90deg) translateZ(32px)' }} />
                <div className="bg-gray-700/30" style={{ ...faceStyle, transform: 'rotateX(-90deg) translateZ(32px)' }} />

                <div className="bg-emerald-500 border-2 border-white animate-pulse text-xs font-bold text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]" style={{ 
                    ...faceStyle,
                    zIndex: 10,
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

