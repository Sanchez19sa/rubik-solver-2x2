import type { CubeState, Color } from '../types';
import { moveCube2x2 } from './engine';

const stateToString = (s: CubeState) => `${s.U.join('')}${s.D.join('')}${s.L.join('')}${s.R.join('')}${s.F.join('')}${s.B.join('')}`;

export const detectOpposites = (s: CubeState): Record<string, string> | null => {
    const corners = [
    [s.U[0], s.L[0], s.B[1]], [s.U[1], s.B[0], s.R[1]], 
    [s.U[2], s.F[0], s.L[1]], [s.U[3], s.R[0], s.F[1]], 
    [s.D[0], s.L[3], s.F[2]], [s.D[1], s.F[3], s.R[2]], 
    [s.D[2], s.B[3], s.L[2]], [s.D[3], s.R[3], s.B[2]], 
  ];
  
  const adj = new Map<string, Set<string>>();
  const allColors = new Set<string>();
  
  corners.forEach(c => {
     c.forEach(color => {
        allColors.add(color);
        if(!adj.has(color)) adj.set(color, new Set());
        c.forEach(other => { if(color !== other) adj.get(color)!.add(other); });
     });
  });
  
  if(allColors.size !== 6) return null; 
  
  const ops: Record<string, string> = {};
  const colorsArr = Array.from(allColors);
  
  for(const c of colorsArr) {
      const neighbors = adj.get(c)!;
      const nonNeighbors = colorsArr.filter(x => x !== c && !neighbors.has(x));
      if(nonNeighbors.length !== 1) return null; 
      ops[c] = nonNeighbors[0];
  }
  return ops;
};

const generateTargets = (opposites: Record<string, string>): string[] => {
    const targets: string[] = [];
    const colors = Object.keys(opposites);

    colors.forEach(uColor => {
        const dColor = opposites[uColor];
        const possibleF = colors.filter(c => c !== uColor && c !== dColor);
        possibleF.forEach(fColor => {
            const bColor = opposites[fColor];
            const remaining = colors.filter(c => ![uColor, dColor, fColor, bColor].includes(c));
            [0, 1].forEach(i => {
                const rColor = remaining[i];
                const lColor = remaining[1-i];
                targets.push(
                    Array(4).fill(uColor).join('') + Array(4).fill(dColor).join('') + 
                    Array(4).fill(lColor).join('') + Array(4).fill(rColor).join('') + 
                    Array(4).fill(fColor).join('') + Array(4).fill(bColor).join('')
                );
            });
        });
    });
    return targets;
};

export const solveBiDirectional = (startState: CubeState): string[] | string | null => {
    const startStr = stateToString(startState);
    const opposites = detectOpposites(startState);
    
    if (!opposites) return "ERROR_COLORS"; 

    const allTargets = new Set(generateTargets(opposites));
    if (allTargets.has(startStr)) return [];

    const moves = ["R", "R'", "U", "U'", "F", "F'"]; 
    
    const forwardMap = new Map<string, string[]>(); forwardMap.set(startStr, []);
    const backwardMap = new Map<string, string[]>();
    const forwardQueue = [startState];
    const backwardQueue: CubeState[] = [];

    allTargets.forEach(tStr => {
        backwardMap.set(tStr, []);
        const chars = tStr.split('');
        const s: CubeState = {
            U: chars.slice(0,4) as Color[], D: chars.slice(4,8) as Color[],
            L: chars.slice(8,12) as Color[], R: chars.slice(12,16) as Color[],
            F: chars.slice(16,20) as Color[], B: chars.slice(20,24) as Color[]
        };
        backwardQueue.push(s);
    });

    for(let depth = 0; depth < 9; depth++) {
        let count = forwardQueue.length;
        while(count--) {
            const curr = forwardQueue.shift()!;
            const currStr = stateToString(curr);
            
            if (backwardMap.has(currStr)) {
                const pathF = forwardMap.get(currStr)!;
                const pathB = backwardMap.get(currStr)!;
                return [...pathF, ...pathB.map(m => m.endsWith("'") ? m[0] : m + "'").reverse()];
            }

            for (const m of moves) {
                const next = moveCube2x2(curr, m);
                const nextStr = stateToString(next);
                if (!forwardMap.has(nextStr)) {
                    forwardMap.set(nextStr, [...forwardMap.get(currStr)!, m]);
                    forwardQueue.push(next);
                }
            }
        }

        count = backwardQueue.length;
        while(count--) {
            const curr = backwardQueue.shift()!;
            const currStr = stateToString(curr);

            if (forwardMap.has(currStr)) {
                const pathF = forwardMap.get(currStr)!;
                const pathB = backwardMap.get(currStr)!;
                return [...pathF, ...pathB.map(m => m.endsWith("'") ? m[0] : m + "'").reverse()];
            }

            for (const m of moves) {
                const next = moveCube2x2(curr, m);
                const nextStr = stateToString(next);
                if (!backwardMap.has(nextStr)) {
                    backwardMap.set(nextStr, [...backwardMap.get(currStr)!, m]);
                    backwardQueue.push(next);
                }
            }
        }
    }
    return null; 
};

