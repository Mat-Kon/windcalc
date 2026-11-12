'use client';

import { WindowLeafNode, OPENING_LABELS, GLAZING_LABELS, OpeningBaseType, HingePosition, HingeSide, GlazingType } from '@/types';

interface Props {
  mode: 'leaf' | 'impost';
  node?: WindowLeafNode;
  onChangeType?: (type: OpeningBaseType) => void;
  onChangeHinge?: (pos: HingePosition, side: HingeSide) => void;
  onChangeGlazing?: (glazing: GlazingType) => void;
  onToggleMosquitoNet?: (hasNet: boolean) => void;
  onAddHorizontal?: () => void;
  onAddVertical?: () => void;
  onRemoveWindow?: () => void;
  onDeleteBlock?: () => void;
  canRemove?: boolean;
  onRemoveImpost?: () => void;
  onDeselect: () => void;
}

export default function Toolbar({
  mode,
  node,
  onChangeType,
  onChangeHinge,
  onChangeGlazing,
  onToggleMosquitoNet,
  onAddHorizontal,
  onAddVertical,
  onRemoveWindow,
  onDeleteBlock,
  onRemoveImpost,
  onDeselect,
}: Props) {
  const baseStyle = {
    display: 'flex', flexWrap: 'wrap' as const, alignItems: 'center', gap: '6px',
    padding: '8px', borderRadius: '4px', marginBottom: '8px',
    backgroundColor: '#eff6ff', border: '1px solid #bfdbfe',
    fontSize: '12px'
  };

  if (mode === 'impost') {
    return (
      <div style={{ ...baseStyle, backgroundColor: '#fef2f2', borderColor: '#fecaca', whiteSpace: 'nowrap' }}>
        <span style={{ fontWeight: 500 }}>Импост</span>
        <button onClick={onRemoveImpost} style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#dc2626', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px' }}>🗑 Удалить</button>
        <button onClick={onDeselect} style={{ padding: '4px 8px', color: '#4b5563', marginLeft: 'auto', background: 'none', border: 'none', fontSize: '12px', cursor: 'pointer' }}>Снять</button>
      </div>
    );
  }

  const showHinges = node?.type === 'casement' || node?.type === 'tilt-turn';

  return (
    <div style={baseStyle}>
      {node ? (
        <>
          <select value={node.type} onChange={(e) => onChangeType?.(e.target.value as OpeningBaseType)} style={{ fontSize: '12px', border: '1px solid #d1d5db', borderRadius: '4px', padding: '2px 4px' }}>
            {Object.entries(OPENING_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>

          {showHinges && (
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => onChangeHinge?.(node.hingePosition === 'left' ? 'right' : 'left', node.hingeSide!)} style={{ padding: '2px 4px', border: '1px solid #d1d5db', borderRadius: '4px', background: '#fff', fontSize: '12px', cursor: 'pointer' }}>
                {node.hingePosition === 'left' ? '↰' : '↱'}
              </button>
              <button onClick={() => onChangeHinge?.(node.hingePosition!, node.hingeSide === 'bottom' ? 'top' : 'bottom')} style={{ padding: '2px 4px', border: '1px solid #d1d5db', borderRadius: '4px', background: '#fff', fontSize: '12px', cursor: 'pointer' }}>
                {node.hingeSide === 'bottom' ? '↓' : '↑'}
              </button>
            </div>
          )}

          <select 
            value={node.glazing} 
            onChange={(e) => onChangeGlazing?.(e.target.value as GlazingType)} 
            style={{ fontSize: '12px', border: '1px solid #d1d5db', borderRadius: '4px', padding: '2px 4px' }}
          >
            {Object.entries(GLAZING_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>

          <label style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={node.hasMosquitoNet} 
              onChange={(e) => onToggleMosquitoNet?.(e.target.checked)} 
            />
            Сетка
          </label>
        </>
      ) : (
        <span style={{ fontWeight: 500 }}>Выделено окно</span>
      )}

      <button onClick={onAddVertical} style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: '#fff', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '12px' }}>⇔</button>
      <button onClick={onAddHorizontal} style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: '#fff', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '12px' }}>⇕</button>
      
      <button onClick={onRemoveWindow} style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', cursor: 'pointer', fontSize: '12px' }}>
        Сброс
      </button>

      {onDeleteBlock && (
        <button onClick={onDeleteBlock} style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: '#fecaca', color: '#991b1b', border: '1px solid #f87171', cursor: 'pointer', fontSize: '12px' }}>
          🗑
        </button>
      )}

      <button onClick={onDeselect} style={{ padding: '2px 6px', color: '#4b5563', marginLeft: 'auto', background: 'none', border: 'none', fontSize: '12px', cursor: 'pointer' }}>Снять</button>
    </div>
  );
}