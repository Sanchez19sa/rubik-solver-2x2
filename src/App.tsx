import React, { useState, useRef } from 'react';
import { RotateCcw, Play, Shuffle, HelpCircle, Eye, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

// Importaciones Modulares
import type { Color, CubeState, FacePosition } from './types';
import { SOLVED_STATE_2x2, FACE_NAMES, COLORS } from './constants';
import { moveCube2x2, cloneState } from './logic/engine';
import { solveBiDirectional } from './logic/solver';

// UI Components
import { Sticker } from './components/Sticker';
import { ArrowOverlay } from './components/ArrowOverlay';
import { FaceView } from './components/FaceView';
import { OrientationHelper } from './components/OrientationHelper';

export default function App() {
  const [state, setState] = useState<CubeState>(SOLVED_STATE_2x2);
  const [mode, setMode] = useState<'PLAY' | 'PAINT'>('PLAY');
  const [rotX, setRotX] = useState(-25);
  const [rotY, setRotY] = useState(-45);
  
  const [animatingMove, setAnimatingMove] = useState<string | null>(null);
  const [hintMessage, setHintMessage] = useState("¿Listo? Pide una pista.");

  const [selectedColor, setSelectedColor] = useState<Color>('R');
  const [paintFaceIdx, setPaintFaceIdx] = useState(0); 
  const paintOrder: FacePosition[] = ['F', 'R', 'B', 'L', 'U', 'D'];

  // Control de arrastre (Cámara)
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
      if (animatingMove) return; 
      isDragging.current = true;
      const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
      lastPos.current = { x: cx, y: cy };
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging.current) return;
      const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
      setRotY(y => y + (cx - lastPos.current.x) * 0.8);
      setRotX(x => x - (cy - lastPos.current.y) * 0.8);
      lastPos.current = { x: cx, y: cy };
  };

  const applyMove = (move: string) => setState(prev => moveCube2x2(prev, move));

  const scramble = () => {
      let s = SOLVED_STATE_2x2;
      const moves = ["R", "U", "F", "R'", "U'", "F'"];
      for(let i=0; i<20; i++) s = moveCube2x2(s, moves[Math.floor(Math.random() * moves.length)]);
      setState(s);
      setHintMessage("Cubo mezclado.");
  };

  const reset = () => {
    setState(SOLVED_STATE_2x2);
    setHintMessage("Cubo reiniciado.");
    setRotX(-25); setRotY(-45);
  };

  const handlePaint = (idx: number) => {
      setState(prev => {
          const ns = cloneState(prev);
          const face = paintOrder[paintFaceIdx];
          ns[face][idx] = selectedColor;
          return ns;
      });
  };

  // --- Lógica de Pistas ---
  const giveHint = async () => {
      setHintMessage("Calculando...");
      await new Promise(r => setTimeout(r, 20)); 
      
      const sol = solveBiDirectional(state);
      
      if (sol === "ERROR_COLORS") {
          setHintMessage("Error: Pieza con colores imposibles.");
          return;
      }
      if (!sol) { 
          setHintMessage("Error: Cubo mal armado (imposible)."); 
          return; 
      }
      if (typeof sol === 'object' && sol.length === 0) { 
          setHintMessage("¡Cubo ya resuelto! 🎉"); 
          return; 
      }

      const steps = sol as string[];
      const nextMove = steps[0];
      const face = nextMove[0] as FacePosition;
      const isPrime = nextMove.endsWith("'");
      const stepsLeft = steps.length;

      // Animación de cámara automática para ver el movimiento
      let tX = -25, tY = -45;
      if (face === 'U') { tX = 60; tY = 0; }
      if (face === 'D') { tX = -60; tY = 0; }
      if (face === 'F') { tX = 0; tY = 0; }
      if (face === 'B') { tX = 0; tY = 180; }
      if (face === 'R') { tX = 0; tY = -90; }
      if (face === 'L') { tX = 0; tY = 90; }
      
      setRotX(tX); 
      setRotY(tY);
      
      const dirText = isPrime ? "CONTRA reloj" : "A FAVOR reloj";
      setHintMessage(`Paso 1 de ${stepsLeft}: Gira ${FACE_NAMES[face]} ${dirText}`);

      setAnimatingMove(nextMove);
      
      setTimeout(() => {
          applyMove(nextMove);
          setAnimatingMove(null);
          setRotX(-25); 
          setRotY(-45);
          if (stepsLeft > 1) setHintMessage("¡Bien! Pulsa para el siguiente.");
          else setHintMessage("¡Cubo Resuelto! 🎉");
      }, 2000); 
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans select-none flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-gray-900 p-3 flex justify-between items-center border-b border-gray-800 z-20">
         <div className="flex items-center gap-2">
             <div className="bg-emerald-600 w-8 h-8 rounded flex items-center justify-center font-bold">2x2</div>
             <h1 className="font-bold text-lg">RubikMaster</h1>
         </div>
         <div className="flex bg-gray-800 p-1 rounded-lg gap-1">
             <button onClick={() => setMode('PLAY')} className={`px-3 py-1.5 rounded text-xs font-bold ${mode==='PLAY' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}>Jugar</button>
             <button onClick={() => setMode('PAINT')} className={`px-3 py-1.5 rounded text-xs font-bold ${mode==='PAINT' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>Pintar</button>
         </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 relative flex flex-col">
        
        {/* MODO JUEGO */}
        {mode === 'PLAY' && (
           <div 
             className="flex-1 relative flex items-center justify-center perspective bg-gradient-to-b from-gray-900 to-black cursor-move"
             onMouseDown={handlePointerDown} onMouseMove={handlePointerMove} onMouseUp={() => isDragging.current = false} onMouseLeave={() => isDragging.current = false}
             onTouchStart={handlePointerDown} onTouchMove={handlePointerMove} onTouchEnd={() => isDragging.current = false}
           >
               <div className="absolute top-2 z-30 pointer-events-none w-full flex justify-center">
                   <div className={`px-6 py-3 rounded-full shadow-2xl border backdrop-blur-sm text-center ${hintMessage.startsWith('Error') ? 'bg-red-900/90 border-red-500/50' : 'bg-gray-900/90 border-emerald-500/30'}`}>
                       {hintMessage.startsWith('Error') && <AlertTriangle size={16} className="inline mr-2 text-red-400"/>}
                       <p className={`${hintMessage.startsWith('Error') ? 'text-red-300' : 'text-emerald-400'} font-bold text-sm md:text-base`}>{hintMessage}</p>
                   </div>
               </div>

               <div className="relative w-0 h-0 transform-style-3d" style={{ transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`, transition: `transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)` }}>
                   <FaceView colors={state.F} tx="rotateY(0deg) translateZ(80px)" />
                   <FaceView colors={state.B} tx="rotateY(180deg) translateZ(80px)" />
                   <FaceView colors={state.R} tx="rotateY(90deg) translateZ(80px)" />
                   <FaceView colors={state.L} tx="rotateY(-90deg) translateZ(80px)" />
                   <FaceView colors={state.U} tx="rotateX(90deg) translateZ(80px)" />
                   <FaceView colors={state.D} tx="rotateX(-90deg) translateZ(80px)" />

                   {animatingMove && (
                       <div className="absolute inset-0 flex items-center justify-center pointer-events-none" 
                          style={{ transform: animatingMove[0] === 'F' ? 'translateZ(100px)' : animatingMove[0] === 'B' ? 'rotateY(180deg) translateZ(100px)' : animatingMove[0] === 'R' ? 'rotateY(90deg) translateZ(100px)' : animatingMove[0] === 'L' ? 'rotateY(-90deg) translateZ(100px)' : animatingMove[0] === 'U' ? 'rotateX(90deg) translateZ(100px)' : 'rotateX(-90deg) translateZ(100px)' }}
                       >
                          <ArrowOverlay move={animatingMove} />
                       </div>
                   )}
               </div>
               {!animatingMove && <button onClick={() => {setRotX(-25); setRotY(-45);}} className="absolute bottom-4 right-4 bg-gray-800/50 p-2 rounded-full text-white hover:bg-gray-700"><Eye size={20}/></button>}
           </div>
        )}

        {/* MODO PINTAR */}
        {mode === 'PAINT' && (
            <div className="flex-1 bg-gray-900 flex flex-col items-center justify-center p-4">
                <h2 className="text-white font-bold mb-2">Pinta tu cubo real</h2>
                <OrientationHelper face={paintOrder[paintFaceIdx]} />
                <p className="text-xs text-gray-400 mb-4 text-center max-w-xs">
                    <span className="text-indigo-400">"Derecha" está a la derecha de "Frente".</span>
                </p>

                <div className="flex items-center gap-4 mb-6">
                     <button onClick={() => setPaintFaceIdx(i => (i - 1 + 6) % 6)} className="p-3 bg-gray-800 rounded-full border border-gray-700"><ChevronLeft /></button>
                     <div className="flex flex-col items-center gap-2">
                         <div className="bg-gray-800 p-2 rounded-lg grid grid-cols-2 gap-2 border border-gray-700 shadow-lg">
                             {state[paintOrder[paintFaceIdx]].map((c, i) => (
                                 <button key={i} onClick={() => handlePaint(i)} className="w-16 h-16 rounded transition-transform active:scale-90">
                                     <Sticker color={c} />
                                 </button>
                             ))}
                         </div>
                         <span className="font-bold text-indigo-400">{FACE_NAMES[paintOrder[paintFaceIdx]]}</span>
                     </div>
                     <button onClick={() => setPaintFaceIdx(i => (i + 1) % 6)} className="p-3 bg-gray-800 rounded-full border border-gray-700"><ChevronRight /></button>
                </div>
                <div className="flex gap-3 mb-6">
                    {(Object.keys(COLORS) as Color[]).map(c => (
                        <button key={c} onClick={() => setSelectedColor(c)} className={`w-10 h-10 rounded-full border-2 ${selectedColor===c ? 'border-white scale-110' : 'border-transparent'}`} style={{ backgroundColor: COLORS[c] }} />
                    ))}
                </div>
                <button onClick={() => { setMode('PLAY'); giveHint(); }} className="w-full max-w-xs bg-indigo-600 py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2">
                    <Play size={16} fill="white" /> Terminar y Resolver
                </button>
            </div>
        )}

        {/* CONTROLES PLAY */}
        {mode === 'PLAY' && (
            <div className="bg-gray-900 p-4 border-t border-gray-800 flex flex-col gap-3">
                <button onClick={giveHint} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
                    <HelpCircle size={24} /> ¡Dame una Pista!
                </button>
                <div className="flex gap-3">
                    <button onClick={scramble} className="flex-1 bg-gray-800 py-3 rounded-lg font-bold text-yellow-500 flex justify-center gap-2 hover:bg-gray-750"><Shuffle size={18}/> Mezclar</button>
                    <button onClick={reset} className="flex-1 bg-gray-800 py-3 rounded-lg font-bold text-red-400 flex justify-center gap-2 hover:bg-gray-750"><RotateCcw size={18}/> Reiniciar</button>
                </div>
            </div>
        )}
      </div>
      <style>{`
        .perspective { perspective: 800px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
}

