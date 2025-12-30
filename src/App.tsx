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
import { OrientationHelper } from './components/OrientationHelper';
import { Cubie } from './components/Cubie';

// --- Mapeo de Cubies ---
const OFFSET = 40; 
const CUBIES_CONFIG = [
    { id: 0, pos: [-OFFSET, -OFFSET, OFFSET],  faces: { U: 2, L: 1, F: 0 } }, // ULF
    { id: 1, pos: [OFFSET, -OFFSET, OFFSET],   faces: { U: 3, R: 0, F: 1 } }, // URF
    { id: 2, pos: [-OFFSET, -OFFSET, -OFFSET], faces: { U: 0, L: 0, B: 1 } }, // ULB
    { id: 3, pos: [OFFSET, -OFFSET, -OFFSET],  faces: { U: 1, R: 1, B: 0 } }, // URB
    { id: 4, pos: [-OFFSET, OFFSET, OFFSET],   faces: { D: 0, L: 3, F: 2 } }, // DLF
    { id: 5, pos: [OFFSET, OFFSET, OFFSET],    faces: { D: 1, R: 2, F: 3 } }, // DRF
    { id: 6, pos: [-OFFSET, OFFSET, -OFFSET],  faces: { D: 2, L: 2, B: 3 } }, // DLB
    { id: 7, pos: [OFFSET, OFFSET, -OFFSET],   faces: { D: 3, R: 3, B: 2 } }, // DRB
];

export default function App() {
  const [state, setState] = useState<CubeState>(SOLVED_STATE_2x2);
  const [mode, setMode] = useState<'PLAY' | 'PAINT'>('PLAY');
  
  // Cámara
  const [transform, setTransform] = useState('rotateX(-25deg) rotateY(-45deg)');
  const currentRotation = useRef({ x: -25, y: -45 });
  
  // Estados de Animación
  const [isHinting, setIsHinting] = useState(false);
  const [animatingMove, setAnimatingMove] = useState<string | null>(null);
  const [activeRotation, setActiveRotation] = useState<{ axis: string, value: number, cubies: number[] } | null>(null);
  const [hintMessage, setHintMessage] = useState("¿Listo? Pide una pista.");

  // Estado Pintar
  const [selectedColor, setSelectedColor] = useState<Color>('R');
  const [paintFaceIdx, setPaintFaceIdx] = useState(0); 
  const paintOrder: FacePosition[] = ['F', 'R', 'B', 'L', 'U', 'D'];

  // Control de arrastre
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
      if (animatingMove || isHinting) return; 
      isDragging.current = true;
      const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
      lastPos.current = { x: cx, y: cy };
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging.current) return;
      const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const deltaX = cx - lastPos.current.x;
      const deltaY = cy - lastPos.current.y;
      
      currentRotation.current.y += deltaX * 0.5;
      currentRotation.current.x -= deltaY * 0.5;
      
      setTransform(`rotateX(${currentRotation.current.x}deg) rotateY(${currentRotation.current.y}deg)`);
      lastPos.current = { x: cx, y: cy };
  };

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // --- Lógica de Animación de Capas ---
  const triggerMove = async (move: string, speedMultiplier: number = 1) => {
      const face = move[0];
      const isPrime = move.endsWith("'");
      const duration = 500 * speedMultiplier;

      let affectedCubies: number[] = [];
      let axis = '';
      let angle = 0;

      // 1. Identificar Cubies Afectados (IDs)
      if (face === 'U') { affectedCubies = [0, 1, 2, 3]; axis = 'Y'; }
      if (face === 'D') { affectedCubies = [4, 5, 6, 7]; axis = 'Y'; }
      if (face === 'L') { affectedCubies = [0, 2, 4, 6]; axis = 'X'; }
      if (face === 'R') { affectedCubies = [1, 3, 5, 7]; axis = 'X'; }
      if (face === 'F') { affectedCubies = [0, 1, 4, 5]; axis = 'Z'; }
      if (face === 'B') { affectedCubies = [2, 3, 6, 7]; axis = 'Z'; }

      // 2. Definir Ángulos de Rotación Visual
      switch(face) {
          case 'U': angle = -90; break; 
          case 'D': angle = 90; break;
          case 'R': angle = 90; break;
          case 'L': angle = -90; break;
          case 'F': angle = 90; break;
          case 'B': angle = -90; break;
      }

      if (isPrime) angle *= -1;

      // 3. Aplicar estado de animación
      setActiveRotation({ axis, value: angle, cubies: affectedCubies });
      
      // 4. Esperar a que termine la animación
      await wait(duration);

      // 5. Actualizar estado lógico
      setState(prev => moveCube2x2(prev, move));
      setActiveRotation(null);
  };

  const scramble = async () => {
      if (isHinting || activeRotation) return;
      let s = SOLVED_STATE_2x2;
      const moves = ["R", "U", "F", "R'", "U'", "F'"];
      
      // Scramble instantáneo
      for(let i=0; i<20; i++) s = moveCube2x2(s, moves[Math.floor(Math.random() * moves.length)]);
      setState(s);
      setHintMessage("Cubo mezclado.");
  };

  const resetView = () => {
    currentRotation.current = { x: -25, y: -45 };
    setTransform('rotateX(-25deg) rotateY(-45deg)');
  };

  const reset = () => {
    setState(SOLVED_STATE_2x2);
    setHintMessage("Cubo reiniciado.");
    resetView();
  };

  const handlePaint = (idx: number) => {
      setState(prev => {
          const ns = cloneState(prev);
          const face = paintOrder[paintFaceIdx];
          ns[face][idx] = selectedColor;
          return ns;
      });
  };

  const giveHint = async () => {
      if (isHinting || activeRotation) return; 

      setHintMessage("Calculando...");
      await wait(200);
      
      const sol = solveBiDirectional(state);
      
      if (sol === "ERROR_COLORS") { setHintMessage("Error: Colores imposibles."); return; }
      if (!sol) { setHintMessage("Error: Cubo imposible."); return; }
      if (typeof sol === 'object' && sol.length === 0) { setHintMessage("¡Cubo ya resuelto! 🎉"); return; }

      const steps = sol as string[];
      const nextMove = steps[0];
      const face = nextMove[0] as FacePosition;
      const isPrime = nextMove.endsWith("'");
      const stepsLeft = steps.length;

      setIsHinting(true);

      // 1. Enfocar Cámara (Rotar todo el cubo para ver la cara)
      let tX = -25, tY = -45;
      
      // Ajustamos los ángulos para que la cara quede bien de frente
      if (face === 'U') { tX = -60; tY = 0; } // CORREGIDO: Negativo para ver Arriba
      if (face === 'D') { tX = 60; tY = 0; }  // CORREGIDO: Positivo para ver Abajo
      if (face === 'F') { tX = 0; tY = 0; }
      if (face === 'B') { tX = 0; tY = 180; }
      if (face === 'R') { tX = 0; tY = -90; }
      if (face === 'L') { tX = 0; tY = 90; }
      
      currentRotation.current = { x: tX, y: tY };
      setTransform(`rotateX(${tX}deg) rotateY(${tY}deg)`);
      setHintMessage("Observa...");
      
      await wait(1000);

      // 2. MOSTRAR FLECHA (Sin mover el cubo todavía)
      const dirText = isPrime ? "CONTRA reloj" : "A FAVOR reloj";
      setHintMessage(`Paso 1/${stepsLeft}: Gira ${FACE_NAMES[face]} ${dirText}`);
      
      // Activamos la flecha visual
      setAnimatingMove(nextMove);
      
      // Dejamos la flecha visible por 2 segundos para que el usuario entienda el giro
      await wait(2000); 

      // 3. Ejecutar movimiento animado
      setAnimatingMove(null); // Quitamos la flecha justo cuando empieza a girar
      await triggerMove(nextMove, 3); // Giro lento
      
      await wait(500);

      resetView(); 
      setIsHinting(false);

      if (stepsLeft > 1) setHintMessage("¡Bien! Siguiente paso...");
      else setHintMessage("¡Cubo Resuelto! 🎉");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans select-none flex flex-col overflow-hidden">
      <header className="bg-gray-900 p-3 flex justify-between items-center border-b border-gray-800 z-20">
         <div className="flex items-center gap-2">
             <div className="bg-emerald-600 w-8 h-8 rounded flex items-center justify-center font-bold shadow">2x2</div>
             <h1 className="font-bold text-lg">RubikMaster</h1>
         </div>
         <div className="flex bg-gray-800 p-1 rounded-lg gap-1 border border-gray-700">
             <button onClick={() => setMode('PLAY')} className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${mode==='PLAY' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}>Jugar</button>
             <button onClick={() => setMode('PAINT')} className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${mode==='PAINT' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>Pintar</button>
         </div>
      </header>

      <div className="flex-1 relative flex flex-col">
        
        {mode === 'PLAY' && (
           <div 
             className="flex-1 relative flex items-center justify-center perspective bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-950 to-black cursor-move touch-none"
             onMouseDown={handlePointerDown} 
             onMouseMove={handlePointerMove} 
             onMouseUp={() => isDragging.current = false} 
             onMouseLeave={() => isDragging.current = false}
             onTouchStart={handlePointerDown} 
             onTouchMove={handlePointerMove} 
             onTouchEnd={() => isDragging.current = false}
           >
               <div className="absolute top-4 z-30 pointer-events-none w-full flex justify-center px-4">
                   <div className={`px-6 py-3 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] border backdrop-blur-md text-center transition-all duration-500 ${hintMessage.startsWith('Error') ? 'bg-red-900/80 border-red-500/50 text-red-100' : 'bg-gray-800/80 border-emerald-500/30 text-emerald-300'} ${isHinting ? 'scale-105' : ''}`}>
                       {hintMessage.startsWith('Error') && <AlertTriangle size={16} className="inline mr-2 -mt-1"/>}
                       <span className="font-bold text-sm md:text-base drop-shadow-sm">{hintMessage}</span>
                   </div>
               </div>

               <div 
                 className="relative w-0 h-0 transform-style-3d" 
                 style={{ 
                   transform: transform,
                   transition: isDragging.current ? 'none' : isHinting ? 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)' 
                 }}
               >
                   {/* Renderizado de los 8 Cubies */}
                   {CUBIES_CONFIG.map((config) => {
                       const cubieColors: Partial<Record<FacePosition, Color>> = {};
                       Object.entries(config.faces).forEach(([face, index]) => {
                           cubieColors[face as FacePosition] = state[face as FacePosition][index];
                       });

                       let rotation = '';
                       let duration = 0;
                       if (activeRotation && activeRotation.cubies.includes(config.id)) {
                           rotation = `rotate${activeRotation.axis}(${activeRotation.value}deg)`;
                           duration = isHinting ? 1500 : 300; 
                       }

                       return (
                           <Cubie 
                               key={config.id}
                               position={config.pos as [number, number, number]}
                               colors={cubieColors}
                               size={80} // Tamaño base
                               rotation={rotation}
                               transitionDuration={duration}
                           />
                       );
                   })}

                   {/* Renderizamos la flecha en el mismo contexto 3D que los cubies */}
                   {animatingMove && <ArrowOverlay move={animatingMove} />}
               </div>

               {(!animatingMove && !isHinting) && (
                   <button onClick={resetView} className="absolute bottom-6 right-6 bg-gray-800/80 p-3 rounded-full text-white hover:bg-gray-700 backdrop-blur-sm border border-gray-700 shadow-lg z-40 transition-transform active:scale-95"><Eye size={24}/></button>
               )}
           </div>
        )}

        {mode === 'PAINT' && (
            <div className="flex-1 bg-gray-900 flex flex-col items-center justify-center p-4 overflow-y-auto">
                <h2 className="text-white font-bold mb-4 text-2xl tracking-tight">Pinta tu cubo</h2>
                <OrientationHelper face={paintOrder[paintFaceIdx]} />
                <p className="text-sm text-gray-400 mb-8 text-center max-w-xs bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700/50">
                    <span className="text-indigo-400 font-semibold">Nota:</span> Gira tu cubo real para que coincida.
                </p>

                <div className="flex items-center gap-6 mb-8">
                     <button onClick={() => setPaintFaceIdx(i => (i - 1 + 6) % 6)} className="p-4 bg-gray-800 rounded-full border border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-white transition-all shadow-lg active:scale-95"><ChevronLeft size={24} /></button>
                     <div className="flex flex-col items-center gap-3">
                         <div className="bg-gray-800 p-3 rounded-xl grid grid-cols-2 gap-2 border border-gray-600 shadow-xl">
                             {state[paintOrder[paintFaceIdx]].map((c, i) => (
                                 <button key={i} onClick={() => handlePaint(i)} className="w-16 h-16 rounded-lg transition-transform active:scale-90 hover:scale-105 shadow-md border-2 border-transparent hover:border-white/20">
                                     <Sticker color={c} />
                                 </button>
                             ))}
                         </div>
                         <span className="font-bold text-indigo-400 text-lg tracking-wider">{FACE_NAMES[paintOrder[paintFaceIdx]]}</span>
                     </div>
                     <button onClick={() => setPaintFaceIdx(i => (i + 1) % 6)} className="p-4 bg-gray-800 rounded-full border border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-white transition-all shadow-lg active:scale-95"><ChevronRight size={24} /></button>
                </div>
                <div className="flex gap-3 mb-8 bg-gray-800 p-2 rounded-2xl border border-gray-700 shadow-lg">
                    {(Object.keys(COLORS) as Color[]).map(c => (
                        <button key={c} onClick={() => setSelectedColor(c)} className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all shadow-md ${selectedColor===c ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'border-transparent hover:scale-110 hover:border-white/50'}`} style={{ backgroundColor: COLORS[c] }} />
                    ))}
                </div>
                <button onClick={() => { setMode('PLAY'); giveHint(); }} className="w-full max-w-xs bg-indigo-600 py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all active:scale-95">
                    <Play size={24} fill="white" /> Terminar y Resolver
                </button>
            </div>
        )}

        {mode === 'PLAY' && (
            <div className="bg-gray-900 p-4 border-t border-gray-800 flex flex-col gap-3 pb-8 md:pb-6 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] z-40 shrink-0">
                <button onClick={giveHint} disabled={isHinting || activeRotation !== null} className={`bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all hover:brightness-110 border border-emerald-500/30 ${(isHinting || activeRotation) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}>
                    <HelpCircle size={24} /> {isHinting ? 'Mostrando Pista...' : '¡Dame una Pista!'}
                </button>
                <div className="flex gap-3">
                    <button onClick={scramble} disabled={isHinting || activeRotation !== null} className="flex-1 bg-gray-800 py-3 rounded-lg font-bold text-yellow-400 flex justify-center items-center gap-2 hover:bg-gray-700 active:bg-gray-600 transition-all border border-gray-700 disabled:opacity-50"><Shuffle size={18}/> Mezclar</button>
                    <button onClick={reset} disabled={isHinting || activeRotation !== null} className="flex-1 bg-gray-800 py-3 rounded-lg font-bold text-red-400 flex justify-center items-center gap-2 hover:bg-gray-700 active:bg-gray-600 transition-all border border-gray-700 disabled:opacity-50"><RotateCcw size={18}/> Reiniciar</button>
                </div>
            </div>
        )}
      </div>
      <style>{`
        .perspective { perspective: 800px; }
        .transform-style-3d { transform-style: preserve-3d; }
      `}</style>
    </div>
  );
}

