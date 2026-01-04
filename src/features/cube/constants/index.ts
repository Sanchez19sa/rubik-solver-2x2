import type { Color, FacePosition, CubeState } from '../types';

export const COLORS: Record<Color, string> = {
  W: '#ffffff', Y: '#fabc21', R: '#ef4444', 
  O: '#f97316', G: '#22c55e', B: '#3b82f6',
};

export const FACE_NAMES: Record<FacePosition, string> = {
  F: 'Frente', B: 'Atrás', L: 'Izquierda', 
  R: 'Derecha', U: 'Arriba', D: 'Abajo'
};

export const SOLVED_STATE_2x2: CubeState = {
  U: ['W','W','W','W'], D: ['Y','Y','Y','Y'],
  L: ['O','O','O','O'], R: ['R','R','R','R'],
  F: ['G','G','G','G'], B: ['B','B','B','B'],
};

