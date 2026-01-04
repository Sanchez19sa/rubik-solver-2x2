import { COLORS } from '../../constants';
import type { Color } from '../../types';

export const Sticker = ({ color }: { color: Color }) => (
  <div 
    className="rounded-[3px] shadow-inner border border-black/10" 
    style={{ 
        backgroundColor: COLORS[color],
        width: '100%',
        height: '100%'
    }} 
  />
);

