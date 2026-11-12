'use client';

import { WindowBlock } from '@/types';

interface Props {
  block: WindowBlock;
  onChangeWidth: (width: number) => void;
  onDelete: () => void;
}

export default function WindowControls({ block, onChangeWidth, onDelete }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: '#f3f4f6', borderRadius: '4px', marginTop: '8px' }}>
      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Окно:</span>
      <label style={{ fontSize: '14px' }}>
        Ширина (мм): 
        <input 
          type="number" 
          value={block.width} 
          onChange={(e) => onChangeWidth(Number(e.target.value))} 
          style={{ width: '70px', padding: '4px', marginLeft: '4px' }} 
        />
      </label>
      <button onClick={onDelete} style={{ padding: '4px 8px', background: '#fecaca', color: '#dc2626', border: '1px solid #f87171', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
        🗑 Удалить окно
      </button>
    </div>
  );
}