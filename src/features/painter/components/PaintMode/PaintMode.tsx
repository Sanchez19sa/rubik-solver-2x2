import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Sticker } from '../../../cube/components/Sticker';
import { OrientationHelper } from '../OrientationHelper';
import { ColorPalette } from '../ColorPalette';
import { FACE_NAMES } from '../../../cube/constants';
import { usePaintState } from '../../hooks/usePaintState';
import type { Color, FacePosition, CubeState } from '../../../cube/types';

interface PaintModeProps {
  state: CubeState;
  onPaint: (face: FacePosition, index: number, color: Color) => void;
  onFinish: () => void;
}

export const PaintMode = ({ state, onPaint, onFinish }: PaintModeProps) => {
  const { selectedColor, setSelectedColor, currentFace, rotation, nextFace, prevFace } =
    usePaintState();

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-gray-900 w-full">
      <div className="w-full flex flex-col items-center px-4 pt-3 pb-8 pb-safe">
        <h2 className="text-white font-bold text-2xl tracking-tight leading-none">
          Pinta tu cubo
        </h2>

        <div className="w-full flex flex-col items-center gap-2 md:gap-3 mt-2">
          <div className="-mt-1">
            <OrientationHelper face={currentFace} state={state} rotation={rotation} />
          </div>

          <p className="text-sm text-gray-400 text-center max-w-xs bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700/50 -mt-1">
            <span className="text-indigo-400 font-semibold">Nota:</span> Gira tu cubo real para que
            coincida.
          </p>

          <div className="flex items-center gap-3 md:gap-4 -mt-1">
            <button
              onClick={prevFace}
              className="p-3 md:p-4 bg-gray-800 rounded-full border border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-white transition-all shadow-lg active:scale-95"
              aria-label="Cara anterior"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="flex flex-col items-center gap-2">
              <div className="bg-gray-800 p-2 md:p-3 rounded-xl grid grid-cols-2 gap-2 border border-gray-600 shadow-xl">
                {state[currentFace].map((c, i) => (
                  <button
                    key={i}
                    onClick={() => onPaint(currentFace, i, selectedColor)}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-lg transition-transform active:scale-90 hover:scale-105 shadow-md border-2 border-transparent hover:border-white/20"
                    aria-label={`Pintar sticker ${i + 1}`}
                  >
                    <Sticker color={c} />
                  </button>
                ))}
              </div>

              <span className="font-bold text-indigo-400 text-lg tracking-wider">
                {FACE_NAMES[currentFace]}
              </span>
            </div>

            <button
              onClick={nextFace}
              className="p-3 md:p-4 bg-gray-800 rounded-full border border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-white transition-all shadow-lg active:scale-95"
              aria-label="Siguiente cara"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="w-full flex justify-center px-2 mt-1">
            <div className="w-full max-w-sm">
              <ColorPalette selectedColor={selectedColor} onSelectColor={setSelectedColor} />
            </div>
          </div>

          <button
            onClick={onFinish}
            className="w-full max-w-xs bg-indigo-600 py-3 md:py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all active:scale-95"
          >
            <Play size={24} fill="white" /> Terminar y Resolver
          </button>
        </div>
      </div>
    </div>
  );
};

