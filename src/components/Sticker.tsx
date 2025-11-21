import { COLORS } from '../constants';
import type { Color } from '../types';

export const Sticker = ({ color }: { color: Color }) => (
  <div className="w-full h-full rounded-[3px] shadow-inner border border-black/10" style={{ backgroundColor: COLORS[color] }} />
);

