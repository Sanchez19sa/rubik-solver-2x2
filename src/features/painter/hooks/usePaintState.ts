import { useReducer, useMemo } from 'react';
import type { Color, FacePosition } from '../../cube/types';

type Rotation = { x: number; y: number };

type PaintNavState = {
  idx: number;
  rotation: Rotation;
};

type Action =
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'SET_COLOR'; color: Color };

const paintOrder: FacePosition[] = ['F', 'R', 'B', 'L', 'U', 'D'];

const initialNavState: PaintNavState = {
  idx: 0,
  rotation: { x: 0, y: 0 },
};

const PITCH_SHOW_U = -90;
const PITCH_SHOW_D = 90;

function navReducer(state: PaintNavState, action: Action): PaintNavState {
  const { idx, rotation } = state;

  switch (action.type) {
    case 'NEXT': {
      // F -> R -> B -> L -> U -> D -> F
      if (idx >= 0 && idx < 3) {
        return { idx: idx + 1, rotation: { x: 0, y: rotation.y - 90 } };
      }
      if (idx === 3) {
        // L -> U
        return { idx: 4, rotation: { x: PITCH_SHOW_U, y: rotation.y - 90 } };
      }
      if (idx === 4) {
        // U -> D
        return { idx: 5, rotation: { x: PITCH_SHOW_D, y: rotation.y } };
      }
      // D -> F
      return { idx: 0, rotation: { x: 0, y: rotation.y } };
    }

    case 'PREV': {
      // F <- R <- B <- L <- U <- D <- F
      if (idx > 0 && idx <= 3) {
        return { idx: idx - 1, rotation: { x: 0, y: rotation.y + 90 } };
      }
      if (idx === 4) {
        // U -> L
        return { idx: 3, rotation: { x: 0, y: rotation.y + 90 } };
      }
      if (idx === 5) {
        // D -> U
        return { idx: 4, rotation: { x: PITCH_SHOW_U, y: rotation.y } };
      }
      // F -> D (loop hacia atrás)
      return { idx: 5, rotation: { x: PITCH_SHOW_D, y: rotation.y } };
    }

    default:
      return state;
  }
}

export const usePaintState = () => {
  const [selectedColor, colorDispatch] = useReducer(
    (curr: Color, action: Action) => (action.type === 'SET_COLOR' ? action.color : curr),
    'R' as Color
  );

  const [nav, navDispatch] = useReducer(navReducer, initialNavState);

  const currentFace = useMemo(() => paintOrder[nav.idx], [nav.idx]);

  return {
    selectedColor,
    setSelectedColor: (color: Color) => colorDispatch({ type: 'SET_COLOR', color }),
    currentFace,
    rotation: nav.rotation,
    nextFace: () => navDispatch({ type: 'NEXT' }),
    prevFace: () => navDispatch({ type: 'PREV' }),
  };
};

