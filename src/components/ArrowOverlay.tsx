import { RotateCw } from 'lucide-react';

export const ArrowOverlay = ({ move }: { move: string }) => {
    if (!move) return null;

    const face = move[0];
    const isPrime = move.endsWith("'");
    
    // Distancia del centro: 
    // El cubo tiene cubies de 80px en posiciones +/- 40. 
    // El borde del cubo está en +/- 80px.
    // Ponemos la flecha en 85px para que "flote" justo encima de la cara.
    const dist = 85; 

    let transform = '';

    switch(face) {
        case 'F': transform = `translateZ(${dist}px)`; break;
        case 'B': transform = `rotateY(180deg) translateZ(${dist}px)`; break;
        case 'R': transform = `rotateY(90deg) translateZ(${dist}px)`; break;
        case 'L': transform = `rotateY(-90deg) translateZ(${dist}px)`; break;
        case 'U': transform = `rotateX(90deg) translateZ(${dist}px)`; break;
        case 'D': transform = `rotateX(-90deg) translateZ(${dist}px)`; break;
    }

    return (
        <div 
            className="absolute top-1/2 left-1/2 w-32 h-32 -mt-16 -ml-16 pointer-events-none z-50 flex items-center justify-center"
            style={{ 
                transformStyle: 'preserve-3d',
                transform: transform
            }}
        >
            {/* Círculo de fondo semitransparente para resaltar la flecha */}
            <div className="absolute inset-0 bg-black/40 rounded-full blur-md animate-pulse"></div>
            
            {/* Flecha */}
            <div className={`relative transition-all ${isPrime ? 'scale-x-[-1]' : ''}`}>
                 <RotateCw 
                    size={100} 
                    strokeWidth={2} 
                    className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" 
                 />
            </div>
            
            {/* Texto indicador de dirección */}
            {/* Rotamos el texto para que siempre se lea 'derecho' respecto a la cámara si es necesario, 
                pero para simplificar, lo dejamos alineado a la flecha */}
        </div>
    );
};

