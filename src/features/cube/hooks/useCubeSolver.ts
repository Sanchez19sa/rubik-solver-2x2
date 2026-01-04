import { useState } from 'react';
import { solveBiDirectional } from '../logic/solver';
import { FACE_NAMES } from '../constants';
import type { CubeState, FacePosition } from '../types';

interface UseCubeSolverProps {
    state: CubeState;
    triggerMove: (move: string, speed: number) => Promise<void>;
    rotateTo: (x: number, y: number) => void;
    resetView: () => void;
}

export const useCubeSolver = ({ state, triggerMove, rotateTo, resetView }: UseCubeSolverProps) => {
    const [isHinting, setIsHinting] = useState(false);
    const [hintMessage, setHintMessage] = useState("¿Listo? Pide una pista.");
    const [animatingMove, setAnimatingMove] = useState<string | null>(null);

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const giveHint = async () => {
        if (isHinting) return; 
  
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
  
        let tX = -25, tY = -45;
        if (face === 'U') { tX = -60; tY = 0; }
        if (face === 'D') { tX = 60; tY = 0; }
        if (face === 'F') { tX = 0; tY = 0; }
        if (face === 'B') { tX = 0; tY = 180; }
        if (face === 'R') { tX = 0; tY = -90; }
        if (face === 'L') { tX = 0; tY = 90; }
        
        rotateTo(tX, tY);
        setHintMessage("Observa...");
        
        await wait(1000);
  
        const dirText = isPrime ? "CONTRA reloj" : "A FAVOR reloj";
        setHintMessage(`Paso 1/${stepsLeft}: Gira ${FACE_NAMES[face]} ${dirText}`);
        setAnimatingMove(nextMove);
        
        await wait(2000); 
  
        setAnimatingMove(null);
        await triggerMove(nextMove, 3);
        
        await wait(500);
  
        resetView(); 
        setIsHinting(false);
  
        if (stepsLeft > 1) setHintMessage("¡Bien! Siguiente paso...");
        else setHintMessage("¡Cubo Resuelto! 🎉");
    };

    return {
        isHinting,
        hintMessage,
        setHintMessage,
        animatingMove,
        giveHint
    };
};

