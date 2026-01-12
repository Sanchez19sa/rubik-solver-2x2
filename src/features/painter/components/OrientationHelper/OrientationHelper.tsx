import type { FacePosition, CubeState } from '../../../cube/types';
import { CubeView } from '../../../cube/components/CubeView';

interface OrientationHelperProps {
  face: FacePosition;
  state: CubeState;
  rotation: { x: number; y: number };
}

export const OrientationHelper = ({ state, rotation }: OrientationHelperProps) => {
  const transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;

  return (
    <div className="w-40 h-40 md:w-48 md:h-48 relative flex items-center justify-center transition-all duration-500 shrink-0">
      <div className="w-full h-full scale-[0.62] md:scale-[0.65]">
        <CubeView
          state={state}
          transform={transform}
          activeRotation={null}
          animatingMove={null}
          variant="mini"
        />
      </div>
    </div>
  );
};

