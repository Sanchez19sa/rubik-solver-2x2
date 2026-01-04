import { useState } from 'react';
import { Header } from './shared/components/Header';
import { PlayMode } from './features/cube/components/PlayMode';
import { PaintMode } from './features/painter/components/PaintMode';
import { useCubeState } from './features/cube/hooks/useCubeState';
import { useCubeSolver } from './features/cube/hooks/useCubeSolver';
import { useDrag } from './shared/hooks/useDrag';

export default function App() {
  const [mode, setMode] = useState<'PLAY' | 'PAINT'>('PLAY');
  const cubeState = useCubeState();
  const dragControls = useDrag();
  const solver = useCubeSolver({
      state: cubeState.state,
      triggerMove: cubeState.triggerMove,
      rotateTo: dragControls.rotateTo,
      resetView: dragControls.resetView
  });

  const handleFinishPaint = () => {
      setMode('PLAY');
      solver.giveHint();
  };

  const handleReset = () => {
      cubeState.reset();
      solver.setHintMessage("Cubo reiniciado.");
      dragControls.resetView();
  };

  const handleScramble = async () => {
      await cubeState.scramble();
      solver.setHintMessage("Cubo mezclado.");
  };

  return (
    // CAMBIO: h-[100dvh] y fixed inset-0 para bloquear el viewport en móviles correctamente
    <div className="h-[100dvh] w-full bg-gray-950 text-gray-100 font-sans select-none flex flex-col overflow-hidden fixed inset-0">
      <Header mode={mode} setMode={setMode} />
      {mode === 'PLAY' ? (
        <PlayMode 
            state={cubeState.state}
            activeRotation={cubeState.activeRotation}
            isBusy={cubeState.isBusy}
            isHinting={solver.isHinting}
            hintMessage={solver.hintMessage}
            animatingMove={solver.animatingMove}
            dragControls={dragControls}
            onGiveHint={solver.giveHint}
            onReset={handleReset}
            onScramble={handleScramble}
        />
      ) : (
        <PaintMode 
            state={cubeState.state}
            onPaint={cubeState.updateFace}
            onFinish={handleFinishPaint}
        />
      )}
    </div>
  );
}

