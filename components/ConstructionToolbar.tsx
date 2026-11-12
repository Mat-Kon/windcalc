'use client';

import { ProjectItem, WindowNode, OpeningBaseType, HingePosition, HingeSide, ConnectorType, CONNECTOR_LABELS, GlazingType } from '@/types';
import Toolbar from './Toolbar';

interface Props {
  construction: ProjectItem;
  selectedBlockId: string | null;
  selectedImpostPath: { blockId: string; path: string[] } | null;
  selectedWindowData: any;
  selectedConnectorData: any;
  selectedLeafNode: WindowNode | null;
  isSingleWindow: boolean;
  onChangeType: (type: OpeningBaseType) => void;
  onChangeHinge: (pos: HingePosition, side: HingeSide) => void;
  onChangeGlazing: (glazing: GlazingType) => void;
  onToggleMosquitoNet: (hasNet: boolean) => void;
  onAddImpost: (dir: 'vertical' | 'horizontal') => void;
  onRemoveWindow: () => void;
  onDeleteBlock: () => void;
  onRemoveImpost: () => void;
  onUpdateConnectorType: (id: string, type: ConnectorType) => void;
  onDeselect: () => void;
}

export default function ConstructionToolbar({
  construction,
  selectedBlockId,
  selectedImpostPath,
  selectedWindowData,
  selectedConnectorData,
  selectedLeafNode,
  isSingleWindow,
  onChangeType,
  onChangeHinge,
  onChangeGlazing,
  onToggleMosquitoNet,
  onAddImpost,
  onRemoveWindow,
  onDeleteBlock,
  onRemoveImpost,
  onUpdateConnectorType,
  onDeselect,
}: Props) {
  return (
    <div className="no-print" style={{ width: '100%', maxWidth: '800px', marginBottom: '16px' }}>
      {selectedWindowData && (
        <Toolbar 
          mode="leaf" 
          node={selectedLeafNode?.kind === 'window' ? selectedLeafNode : undefined} 
          onChangeType={onChangeType} 
          onChangeHinge={onChangeHinge} 
          onChangeGlazing={onChangeGlazing}
          onToggleMosquitoNet={onToggleMosquitoNet}
          onAddHorizontal={() => onAddImpost('horizontal')} 
          onAddVertical={() => onAddImpost('vertical')} 
          onRemoveWindow={onRemoveWindow} 
          onDeleteBlock={!isSingleWindow ? onDeleteBlock : undefined}
          onDeselect={onDeselect} 
        />
      )}
      
      {selectedImpostPath && (
        <Toolbar mode="impost" canRemove={true} onRemoveImpost={onRemoveImpost} onDeselect={onDeselect} />
      )}

      {selectedBlockId && selectedConnectorData && (
        <div style={{ display: 'flex', gap: '8px', padding: '12px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '4px', marginBottom: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Соединитель:</span>
          <select 
            value={selectedConnectorData.connectorType} 
            onChange={(e) => onUpdateConnectorType(selectedConnectorData.id, e.target.value as ConnectorType)}
            style={{ fontSize: '0.875rem', border: '1px solid #d1d5db', borderRadius: '4px', padding: '4px 8px' }}
          >
            {Object.entries(CONNECTOR_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <button onClick={onDeleteBlock} style={{ fontSize: '0.875rem', padding: '4px 12px', borderRadius: '4px', backgroundColor: '#fecaca', color: '#991b1b', border: '1px solid #f87171', cursor: 'pointer', marginLeft: '8px' }}>
            🗑 Удалить
          </button>
          <button onClick={onDeselect} style={{ fontSize: '0.875rem', padding: '4px 12px', borderRadius: '4px', color: '#4b5563', marginLeft: 'auto', cursor: 'pointer', background: 'none', border: 'none' }}>
            Снять
          </button>
        </div>
      )}
    </div>
  );
}