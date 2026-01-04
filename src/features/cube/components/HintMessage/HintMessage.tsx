import { AlertTriangle } from 'lucide-react';

interface HintMessageProps {
    message: string;
    isHinting: boolean;
}

export const HintMessage = ({ message, isHinting }: HintMessageProps) => {
    return (
        <div className="absolute top-4 z-30 pointer-events-none w-full flex justify-center px-4">
            <div className={`px-6 py-3 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] border backdrop-blur-md text-center transition-all duration-500 ${message.startsWith('Error') ? 'bg-red-900/80 border-red-500/50 text-red-100' : 'bg-gray-800/80 border-emerald-500/30 text-emerald-300'} ${isHinting ? 'scale-105' : ''}`}>
                {message.startsWith('Error') && <AlertTriangle size={16} className="inline mr-2 -mt-1"/>}
                <span className="font-bold text-sm md:text-base drop-shadow-sm">{message}</span>
            </div>
        </div>
    );
};

