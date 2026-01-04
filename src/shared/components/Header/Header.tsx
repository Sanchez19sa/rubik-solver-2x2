interface HeaderProps {
    mode: 'PLAY' | 'PAINT';
    setMode: (m: 'PLAY' | 'PAINT') => void;
}

export const Header = ({ mode, setMode }: HeaderProps) => {
    return (
        <header className="bg-gray-900 p-3 flex justify-between items-center border-b border-gray-800 z-20">
            <div className="flex items-center gap-2">
                <div className="bg-emerald-600 w-8 h-8 rounded flex items-center justify-center font-bold shadow">2x2</div>
                <h1 className="font-bold text-lg text-white">RubikMaster</h1>
            </div>
            <div className="flex bg-gray-800 p-1 rounded-lg gap-1 border border-gray-700">
                <button onClick={() => setMode('PLAY')} className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${mode==='PLAY' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}>Jugar</button>
                <button onClick={() => setMode('PAINT')} className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${mode==='PAINT' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>Pintar</button>
            </div>
        </header>
    );
};

