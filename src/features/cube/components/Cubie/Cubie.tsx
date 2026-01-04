import { COLORS } from '../../constants';
import type { Color, FacePosition } from '../../types';

interface CubieProps {
  position: [number, number, number];
  colors: Partial<Record<FacePosition, Color>>;
  size: number;
  rotation?: string;
  transitionDuration?: number;
}

export const Cubie = ({ position, colors, size, rotation, transitionDuration = 500 }: CubieProps) => {
  const [x, y, z] = position;
  const visualSize = size - 2; 
  const half = visualSize / 2;

  const faceStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    boxShadow: 'inset 0 0 0 3px #000',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#050505',
    borderRadius: '12%',
  };

  const renderSticker = (color?: Color) => {
    if (!color) return null;
    return (
      <div style={{
        width: '90%',
        height: '90%',
        backgroundColor: COLORS[color],
        borderRadius: '10%', 
        boxShadow: 'inset 0 0 8px rgba(0,0,0,0.15)'
      }} />
    );
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 0,
        height: 0,
        transformStyle: 'preserve-3d',
        transform: rotation || 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)',
        transition: rotation ? `transform ${transitionDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1)` : 'none',
        pointerEvents: 'none'
      }}
    >
      <div
        style={{
            position: 'absolute',
            width: visualSize,
            height: visualSize,
            left: -half,
            top: -half,
            transform: `translate3d(${x}px, ${y}px, ${z}px)`, 
            transformStyle: 'preserve-3d',
        }}
      >
          <div style={{ ...faceStyle, transform: `translateZ(${half}px)` }}>{renderSticker(colors.F)}</div>
          <div style={{ ...faceStyle, transform: `rotateY(180deg) translateZ(${half}px)` }}>{renderSticker(colors.B)}</div>
          <div style={{ ...faceStyle, transform: `rotateY(90deg) translateZ(${half}px)` }}>{renderSticker(colors.R)}</div>
          <div style={{ ...faceStyle, transform: `rotateY(-90deg) translateZ(${half}px)` }}>{renderSticker(colors.L)}</div>
          <div style={{ ...faceStyle, transform: `rotateX(90deg) translateZ(${half}px)` }}>{renderSticker(colors.U)}</div>
          <div style={{ ...faceStyle, transform: `rotateX(-90deg) translateZ(${half}px)` }}>{renderSticker(colors.D)}</div>
      </div>
    </div>
  );
};

