// src/logic/engine.ts
import type { Color, CubeState, FacePosition } from '../types';

export const rotateFace = (face: Color[], clockwise: boolean) => {
  const [c0, c1, c2, c3] = face;
  return clockwise ? [c2, c0, c3, c1] : [c1, c3, c0, c2];
};

export const cloneState = (s: CubeState): CubeState => ({
  U: [...s.U], D: [...s.D], L: [...s.L], R: [...s.R], F: [...s.F], B: [...s.B]
});

export const moveCube2x2 = (state: CubeState, move: string): CubeState => {
  const s = cloneState(state);
  const isPrime = move.endsWith("'");
  const face = move[0] as FacePosition;

  s[face] = rotateFace(s[face], !isPrime);
  const { F, B, L, R, U, D } = s; // Destructuring para facilitar acceso

  // Lógica de permutación de caras adyacentes
  if (face === 'U') {
     const temp = [F[0], F[1]];
     if (!isPrime) {
        s.F = [R[0], R[1], F[2], F[3]]; s.R = [B[0], B[1], R[2], R[3]]; s.B = [L[0], L[1], B[2], B[3]]; s.L = [temp[0], temp[1], L[2], L[3]];
     } else {
        s.F = [L[0], L[1], F[2], F[3]]; s.L = [B[0], B[1], L[2], L[3]]; s.B = [R[0], R[1], B[2], B[3]]; s.R = [temp[0], temp[1], R[2], R[3]];
     }
  }

  if (face === 'D') {
    const temp = [F[2], F[3]];
    if (!isPrime) { s.F = [F[0], F[1], L[2], L[3]]; s.L = [L[0], L[1], B[2], B[3]]; s.B = [B[0], B[1], R[2], R[3]]; s.R = [R[0], R[1], temp[0], temp[1]]; } 
    else { s.F = [F[0], F[1], R[2], R[3]]; s.R = [R[0], R[1], B[2], B[3]]; s.B = [B[0], B[1], L[2], L[3]]; s.L = [L[0], L[1], temp[0], temp[1]]; }
  }

  if (face === 'F') {
    const temp = [U[2], U[3]];
    if (!isPrime) { s.U = [U[0], U[1], L[3], L[1]]; s.L = [L[0], D[0], L[2], D[1]]; s.D = [R[2], R[0], D[2], D[3]]; s.R = [temp[0], R[1], temp[1], R[3]]; } 
    else { s.U = [U[0], U[1], R[0], R[2]]; s.R = [D[1], R[1], D[0], R[3]]; s.D = [L[1], L[3], D[2], D[3]]; s.L = [L[0], temp[1], L[2], temp[0]]; }
  }

  if (face === 'R') {
    const temp = [U[1], U[3]];
    if (!isPrime) { s.U = [U[0], F[1], U[2], F[3]]; s.F = [F[0], D[1], F[2], D[3]]; s.D = [D[0], B[2], D[2], B[0]]; s.B = [temp[1], B[1], temp[0], B[3]]; } 
    else { s.U = [U[0], B[2], U[2], B[0]]; s.B = [D[3], B[1], D[1], B[3]]; s.D = [D[0], F[1], D[2], F[3]]; s.F = [F[0], temp[0], F[2], temp[1]]; }
  }

  if (face === 'L') {
      const temp = [U[0], U[2]];
      if (!isPrime) { s.U = [B[3], U[1], B[1], U[3]]; s.B = [B[0], D[2], B[2], D[0]]; s.D = [F[0], D[1], F[2], D[3]]; s.F = [temp[0], F[1], temp[1], F[3]]; } 
      else { s.U = [F[0], U[1], F[2], U[3]]; s.F = [D[0], F[1], D[2], F[3]]; s.D = [B[3], D[1], B[1], D[3]]; s.B = [B[0], temp[1], B[2], temp[0]]; }
  }
  
  if (face === 'B') {
      const temp = [U[0], U[1]];
      if (!isPrime) { s.U = [R[1], R[3], U[2], U[3]]; s.R = [R[0], D[3], R[2], D[2]]; s.D = [D[0], D[1], L[1], L[3]]; s.L = [temp[1], L[1], temp[0], L[3]]; } 
      else { s.U = [L[3], L[1], U[2], U[3]]; s.L = [temp[0], L[1], temp[1], L[3]]; s.D = [D[0], D[1], R[3], R[1]]; s.R = [R[0], D[2], R[2], D[3]]; }
  }

  return s;
};
