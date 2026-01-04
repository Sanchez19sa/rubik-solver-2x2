import { CubeView } from '../CubeView';
import { ControlPanel } from '../ControlPanel';
import { HintMessage } from '../HintMessage';
import type { CubeState } from '../../types';

interface PlayModeProps {
    state: CubeState;
    hintMessage: string;
    isHinting: boolean;
    isBusy: boolean;
    activeRotation: any;
    animatingMove: string | null;
    dragControls: any;
    onGiveHint: () => void;
    onScramble: () => void;
    onReset: () => void;
}

export const PlayMode = ({
    state, hintMessage, isHinting, isBusy, activeRotation, animatingMove, dragControls,
    onGiveHint, onScramble, onReset
}: PlayModeProps) => {

    const { transform, isDragging, handlePointerDown, handlePointerMove, resetView } = dragControls;

    return (
        <div className="flex-1 relative flex flex-col h-full">
            <HintMessage message={hintMessage} isHinting={isHinting} />

            <CubeView 
                state={state}
                transform={transform}
                activeRotation={activeRotation}
                animatingMove={animatingMove}
                isHinting={isHinting}
                isDragging={isDragging}
                handlePointerDown={handlePointerDown}
                handlePointerMove={handlePointerMove}
                onResetView={resetView}
            />

            <ControlPanel 
                isHinting={isHinting}
                isBusy={isBusy}
                onGiveHint={onGiveHint}
                onScramble={onScramble}
                onReset={onReset}
            />
        </div>
    );
};

