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
    const { selectedColor, setSelectedColor, currentFace, nextFace, prevFace } = usePaintState();

    return (
        // CAMBIO: Asegurar h-full y padding inferior para scroll
        <div className="flex-1 bg-gray-900 flex flex-col items-center justify-start md:justify-center p-4 overflow-y-auto w-full h-full pb-20">
            <h2 className="text-white font-bold mb-4 text-2xl tracking-tight mt-4 md:mt-0">Pinta tu cubo</h2>
            
            <OrientationHelper face={currentFace} />
            
            <p className="text-sm text-gray-400 mb-6 text-center max-w-xs bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700/50">
                <span className="text-indigo-400 font-semibold">Nota:</span> Gira tu cubo real para que coincida.
            </p>

            <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
                 <button onClick={prevFace} className="p-3 md:p-4 bg-gray-800 rounded-full border border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-white transition-all shadow-lg active:scale-95"><ChevronLeft size={24} /></button>
                 
                 <div className="flex flex-col items-center gap-2 md:gap-3">
                     <div className="bg-gray-800 p-2 md:p-3 rounded-xl grid grid-cols-2 gap-2 border border-gray-600 shadow-xl">
                         {state[currentFace].map((c, i) => (
                             <button key={i} onClick={() => onPaint(currentFace, i, selectedColor)} className="w-14 h-14 md:w-16 md:h-16 rounded-lg transition-transform active:scale-90 hover:scale-105 shadow-md border-2 border-transparent hover:border-white/20">
                                 <Sticker color={c} />
                             </button>
                         ))}
                     </div>
                     <span className="font-bold text-indigo-400 text-lg tracking-wider">{FACE_NAMES[currentFace]}</span>
                 </div>
                 
                 <button onClick={nextFace} className="p-3 md:p-4 bg-gray-800 rounded-full border border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-white transition-all shadow-lg active:scale-95"><ChevronRight size={24} /></button>
            </div>

            <ColorPalette selectedColor={selectedColor} onSelectColor={setSelectedColor} />

            <button onClick={onFinish} className="w-full max-w-xs bg-indigo-600 py-3 md:py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all active:scale-95">
                <Play size={24} fill="white" /> Terminar y Resolver
            </button>
        </div>
    );
};

