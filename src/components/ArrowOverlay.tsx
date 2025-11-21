import { RotateCw } from 'lucide-react';

export const ArrowOverlay = ({ move }: { move: string }) => {
    const isPrime = move.endsWith("'");
    return (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-50 animate-in zoom-in duration-300 ${isPrime ? 'scale-x-[-1]' : ''}`}>
            <div className="relative drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                 <RotateCw size={100} strokeWidth={2} className="text-emerald-400" />
            </div>
        </div>
    );
};

