import type { Color } from '../types';
import { Sticker } from './Sticker';

export const FaceView = ({ colors, tx }: { colors: Color[], tx: string }) => (
    <div 
      className="absolute grid grid-cols-2 gap-1 bg-black p-1 rounded border border-black/50 backface-hidden shadow-xl"
      style={{ width: '160px', height: '160px', transform: tx, marginLeft: '-80px', marginTop: '-80px', left: '50%', top: '50%' }}
    >
        {colors.map((c, i) => <Sticker key={i} color={c} />)}
    </div>
);

