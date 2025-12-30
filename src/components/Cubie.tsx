import { COLORS } from '../constants';
import type { Color, FacePosition } from '../types';

interface CubieProps {
  position: [number, number, number]; // x, y, z
  colors: Partial<Record<FacePosition, Color>>; // Colores activos para este cubie
  size: number;
  rotation?: string; // Transformación para animación
  transitionDuration?: number;
}

export const Cubie = ({ position, colors, size, rotation, transitionDuration = 500 }: CubieProps) => {
  const [x, y, z] = position;
  
  // Reducimos ligeramente el tamaño visual del cubie para dejar un pequeño "gap" (espacio)
  // entre piezas, lo que aumenta el realismo y evita solapamientos visuales (z-fighting).
  const visualSize = size - 2; 
  const half = visualSize / 2;

  // Estilos base para las caras del cubie
  const faceStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    boxShadow: 'inset 0 0 0 3px #000', // Plástico negro del borde
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden', // Safari support
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#050505', // Casi negro para el interior
    borderRadius: '12%', // Bordes redondeados estilo cubo moderno
  };

  // Renderiza un sticker interno
  const renderSticker = (color?: Color) => {
    if (!color) return null;
    return (
      <div style={{
        width: '90%',
        height: '90%',
        backgroundColor: COLORS[color],
        borderRadius: '10%', 
        boxShadow: 'inset 0 0 8px rgba(0,0,0,0.15)' // Sutil profundidad en el sticker
      }} />
    );
  };

  return (
    // 1. PIVOTE: Este contenedor está en el centro absoluto del cubo grande (0,0,0).
    // Su única función es ROTAR. Al rotar, todo lo que contiene "orbita" a su alrededor.
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 0,
        height: 0,
        transformStyle: 'preserve-3d',
        // Aplicamos SOLO la rotación aquí.
        transform: rotation || 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)',
        transition: rotation ? `transform ${transitionDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1)` : 'none',
        pointerEvents: 'none'
      }}
    >
      {/* 2. POSICIONADOR: Este contenedor mueve el cubie a su posición (radio).
          Como es hijo del Pivote, al rotar el padre, este se mueve en un arco perfecto. */}
      <div
        style={{
            position: 'absolute',
            width: visualSize,
            height: visualSize,
            // Centramos el cubie en el punto del pivote antes de trasladarlo
            left: -half,
            top: -half,
            // Aquí definimos su posición estática en el espacio 3D
            transform: `translate3d(${x}px, ${y}px, ${z}px)`, 
            transformStyle: 'preserve-3d',
        }}
      >
          {/* Front Face (Z+) */}
          <div style={{ ...faceStyle, transform: `translateZ(${half}px)` }}>
              {renderSticker(colors.F)}
          </div>
          {/* Back Face (Z-) */}
          <div style={{ ...faceStyle, transform: `rotateY(180deg) translateZ(${half}px)` }}>
              {renderSticker(colors.B)}
          </div>
          {/* Right Face (X+) */}
          <div style={{ ...faceStyle, transform: `rotateY(90deg) translateZ(${half}px)` }}>
              {renderSticker(colors.R)}
          </div>
          {/* Left Face (X-) */}
          <div style={{ ...faceStyle, transform: `rotateY(-90deg) translateZ(${half}px)` }}>
              {renderSticker(colors.L)}
          </div>
          {/* Up Face (Y-) */}
          <div style={{ ...faceStyle, transform: `rotateX(90deg) translateZ(${half}px)` }}>
              {renderSticker(colors.U)}
          </div>
          {/* Down Face (Y+) */}
          <div style={{ ...faceStyle, transform: `rotateX(-90deg) translateZ(${half}px)` }}>
              {renderSticker(colors.D)}
          </div>
      </div>
    </div>
  );
};

