export type Color = 'W' | 'Y' | 'R' | 'O' | 'G' | 'B';
export type FacePosition = 'U' | 'D' | 'L' | 'R' | 'F' | 'B';

export interface CubeState {
  U: Color[]; D: Color[]; L: Color[]; R: Color[]; F: Color[]; B: Color[];
}

