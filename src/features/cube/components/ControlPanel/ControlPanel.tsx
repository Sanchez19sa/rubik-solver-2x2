import { HelpCircle, Shuffle, RotateCcw } from 'lucide-react';

interface ControlPanelProps {
    isHinting: boolean;
    isBusy: boolean;
    onGiveHint: () => void;
    onScramble: () => void;
    onReset: () => void;
}

export const ControlPanel = ({ isHinting, isBusy, onGiveHint, onScramble, onReset }: ControlPanelProps) => {
    return (
        // CAMBIO: Reducción de paddings (p-3, pb-6) y gap para ahorrar espacio vertical en móviles
        <div className="bg-gray-900 p-3 md:p-4 border-t border-gray-800 flex flex-col gap-2 md:gap-3 pb-6 md:pb-6 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] z-40 shrink-0">
            <button 
                onClick={onGiveHint} 
                disabled={isHinting || isBusy} 
                // CAMBIO: py-3 en vez de py-4 en móvil
                className={`bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all hover:brightness-110 border border-emerald-500/30 ${(isHinting || isBusy) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
            >
                <HelpCircle size={22} className="md:w-6 md:h-6" /> 
                {isHinting ? 'Mostrando Pista...' : '¡Dame una Pista!'}
            </button>
            <div className="flex gap-2 md:gap-3">
                <button 
                    onClick={onScramble} 
                    disabled={isHinting || isBusy} 
                    // CAMBIO: py-2.5 para ser más compacto
                    className="flex-1 bg-gray-800 py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-base text-yellow-400 flex justify-center items-center gap-2 hover:bg-gray-700 active:bg-gray-600 transition-all border border-gray-700 disabled:opacity-50"
                >
                    <Shuffle size={16} className="md:w-[18px] md:h-[18px]"/> Mezclar
                </button>
                <button 
                    onClick={onReset} 
                    disabled={isHinting || isBusy} 
                    // CAMBIO: py-2.5 para ser más compacto
                    className="flex-1 bg-gray-800 py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-base text-red-400 flex justify-center items-center gap-2 hover:bg-gray-700 active:bg-gray-600 transition-all border border-gray-700 disabled:opacity-50"
                >
                    <RotateCcw size={16} className="md:w-[18px] md:h-[18px]"/> Reiniciar
                </button>
            </div>
        </div>
    );
};

