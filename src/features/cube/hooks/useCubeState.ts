import { useState } from 'react';
import { SOLVED_STATE_2x2 } from '../constants';
import { moveCube2x2, cloneState } from '../logic/engine';
import type { CubeState, Color, FacePosition } from '../types';

export const useCubeState = () => {
    const [state, setState] = useState<CubeState>(SOLVED_STATE_2x2);
    const [activeRotation, setActiveRotation] = useState<{ axis: string, value: number, cubies: number[] } | null>(null);

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const triggerMove = async (move: string, speedMultiplier: number = 1) => {
        const face = move[0];
        const isPrime = move.endsWith("'");
        const duration = 500 * speedMultiplier;
  
        let affectedCubies: number[] = [];
        let axis = '';
        let angle = 0;
  
        if (face === 'U') { affectedCubies = [0, 1, 2, 3]; axis = 'Y'; }
        if (face === 'D') { affectedCubies = [4, 5, 6, 7]; axis = 'Y'; }
        if (face === 'L') { affectedCubies = [0, 2, 4, 6]; axis = 'X'; }
        if (face === 'R') { affectedCubies = [1, 3, 5, 7]; axis = 'X'; }
        if (face === 'F') { affectedCubies = [0, 1, 4, 5]; axis = 'Z'; }
        if (face === 'B') { affectedCubies = [2, 3, 6, 7]; axis = 'Z'; }
  
        switch(face) {
            case 'U': angle = -90; break; 
            case 'D': angle = 90; break;
            case 'R': angle = 90; break;
            case 'L': angle = -90; break;
            case 'F': angle = 90; break;
            case 'B': angle = -90; break;
        }
  
        if (isPrime) angle *= -1;
  
        setActiveRotation({ axis, value: angle, cubies: affectedCubies });
        await wait(duration);
        setState(prev => moveCube2x2(prev, move));
        setActiveRotation(null);
    };

    const scramble = async () => {
        if (activeRotation) return;
        let s = SOLVED_STATE_2x2;
        const moves = ["R", "U", "F", "R'", "U'", "F'"];
        for(let i=0; i<20; i++) s = moveCube2x2(s, moves[Math.floor(Math.random() * moves.length)]);
        setState(s);
    };

    const reset = () => {
        setState(SOLVED_STATE_2x2);
    };

    const updateFace = (face: FacePosition, index: number, color: Color) => {
        setState(prev => {
            const ns = cloneState(prev);
            ns[face][index] = color;
            return ns;
        });
    };

    return {
        state,
        activeRotation,
        triggerMove,
        scramble,
        reset,
        updateFace,
        isBusy: activeRotation !== null
    };
};

