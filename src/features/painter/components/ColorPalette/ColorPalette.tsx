import { COLORS } from '../../../cube/constants';
import type { Color } from '../../../cube/types';

interface ColorPaletteProps {
    selectedColor: Color;
    onSelectColor: (c: Color) => void;
}

export const ColorPalette = ({ selectedColor, onSelectColor }: ColorPaletteProps) => {
    return (
        <div className="flex gap-3 mb-8 bg-gray-800 p-2 rounded-2xl border border-gray-700 shadow-lg">
            {(Object.keys(COLORS) as Color[]).map(c => (
                <button key={c} onClick={() => onSelectColor(c)} className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all shadow-md ${selectedColor===c ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'border-transparent hover:scale-110 hover:border-white/50'}`} style={{ backgroundColor: COLORS[c] }} />
            ))}
        </div>
    );
};

