'use client';

import { useState } from 'react';
import { ProjectItem, WindowNode, OpeningBaseType, HingePosition, HingeSide, ConnectorType, GlazingType } from '@/types';
import { getNode, removeImpost, removeWindow, splitNode, replaceNode } from '@/lib/tree';
import ConstructionToolbar from './ConstructionToolbar';
import ConstructionCanvas from './ConstructionCanvas';
import ImpostModal from './ImpostModal';

interface Props {
  construction: ProjectItem;
  onChange: (c: ProjectItem) => void;
}

export default function ConstructionEditor({ construction, onChange }: Props) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedWindowPath, setSelectedWindowPath] = useState<string[] | null>(null);
  const [selectedImpostPath, setSelectedImpostPath] = useState<{ blockId: string; path: string[] } | null>(null);
  const [impostDir, setImpostDir] = useState<'vertical' | 'horizontal' | null>(null);
  const [impostModalData, setImpostModalData] = useState<{ blockId: string; path: string[]; maxSize: number } | null>(null);

  const maxHeight = Math.max(...construction.items.map(i => i.type === 'window' ? i.data.height : i.height), construction.height);
  const isSingleWindow = construction.itemType === 'window';

  const handleSelectBlock = (blockId: string) => {
    setSelectedBlockId(blockId);
    setSelectedWindowPath(null);
    setSelectedImpostPath(null);
  };

  const handleSelectLeaf = (blockId: string, path: string[]) => {
    setSelectedBlockId(blockId);
    setSelectedWindowPath(path);
    setSelectedImpostPath(null);
  };

  const handleSelectImpost = (blockId: string, path: string[]) => {
    setSelectedImpostPath({ blockId, path });
    setSelectedBlockId(null);
    setSelectedWindowPath(null);
  };

  const handleDeselect = () => {
    setSelectedBlockId(null);
    setSelectedWindowPath(null);
    setSelectedImpostPath(null);
  };

  const handleUpdateWindow = (blockId: string, updates: Partial<{ width: number; height: number }>) => {
    onChange({
      ...construction,
      items: construction.items.map(item => {
        if (item.type === 'window' && item.data.id === blockId) {
          return { ...item, data: { ...item.data, ...updates } };
        }
        return item;
      })
    });
  };

  const handleUpdateWindowTree = (blockId: string, newRoot: WindowNode) => {
    onChange({
      ...construction,
      items: construction.items.map(item => {
        if (item.type === 'window' && item.data.id === blockId) {
          return { ...item, data: { ...item.data, root: newRoot } };
        }
        return item;
      })
    });
  };

  const handleUpdateConnectorType = (connectorId: string, newType: ConnectorType) => {
    onChange({
      ...construction,
      items: construction.items.map(item => {
        if (item.type === 'connector' && item.id === connectorId) {
          return { ...item, connectorType: newType };
        }
        return item;
      })
    });
  };

  const handleChangeType = (type: OpeningBaseType) => {
    if (!selectedBlockId || !selectedWindowPath) return;
    const block = construction.items.find(i => i.type === 'window' && i.data.id === selectedBlockId);
    if (!block || block.type !== 'window') return;

    const newRoot = replaceNode(block.data.root, selectedWindowPath, (node) => 
      node.kind === 'window' ? { ...node, type } : node
    );
    handleUpdateWindowTree(selectedBlockId, newRoot);
  };

  const handleChangeHinge = (pos: HingePosition, side: HingeSide) => {
    if (!selectedBlockId || !selectedWindowPath) return;
    const block = construction.items.find(i => i.type === 'window' && i.data.id === selectedBlockId);
    if (!block || block.type !== 'window') return;

    const newRoot = replaceNode(block.data.root, selectedWindowPath, (node) => 
      node.kind === 'window' ? { ...node, hingePosition: pos, hingeSide: side } : node
    );
    handleUpdateWindowTree(selectedBlockId, newRoot);
  };

  const handleChangeGlazing = (glazing: GlazingType) => {
    if (!selectedBlockId || !selectedWindowPath) return;
    const block = construction.items.find(i => i.type === 'window' && i.data.id === selectedBlockId);
    if (!block || block.type !== 'window') return;

    const newRoot = replaceNode(block.data.root, selectedWindowPath, (node) => 
      node.kind === 'window' ? { ...node, glazing } : node
    );
    handleUpdateWindowTree(selectedBlockId, newRoot);
  };

  const handleToggleMosquitoNet = (hasNet: boolean) => {
    if (!selectedBlockId || !selectedWindowPath) return;
    const block = construction.items.find(i => i.type === 'window' && i.data.id === selectedBlockId);
    if (!block || block.type !== 'window') return;

    const newRoot = replaceNode(block.data.root, selectedWindowPath, (node) => 
      node.kind === 'window' ? { ...node, hasMosquitoNet: hasNet } : node
    );
    handleUpdateWindowTree(selectedBlockId, newRoot);
  };

  const handleAddImpost = (direction: 'vertical' | 'horizontal') => {
    if (!selectedBlockId || !selectedWindowPath) return;
    const block = construction.items.find(i => i.type === 'window' && i.data.id === selectedBlockId);
    if (!block || block.type !== 'window') return;
    
    let currentW = block.data.width;
    let currentH = block.data.height;
    let currentNode = block.data.root;
    
    for (const id of selectedWindowPath) {
      if (currentNode.kind !== 'split') break;
      const idx = currentNode.children.findIndex(c => c.id === id);
      if (idx === -1) break;
      const ratio = currentNode.ratios[idx];
      if (currentNode.direction === 'vertical') currentW *= ratio;
      else currentH *= ratio;
      currentNode = currentNode.children[idx];
    }

    const maxSize = direction === 'vertical' ? currentW : currentH;
    setImpostModalData({ blockId: selectedBlockId, path: selectedWindowPath, maxSize });
    setImpostDir(direction);
  };

  const confirmImpost = (positionMm: number) => {
    if (!impostModalData || !impostDir) return;
    const { blockId, path, maxSize } = impostModalData;
    const block = construction.items.find(i => i.type === 'window' && i.data.id === blockId);
    if (!block || block.type !== 'window') return;

    const ratio = positionMm / maxSize;
    const newRoot = replaceNode(block.data.root, path, (node) => splitNode(node, impostDir, ratio));
    
    handleUpdateWindowTree(blockId, newRoot);
    setImpostModalData(null);
    setImpostDir(null);
    handleDeselect();
  };

  const handleRemoveImpost = () => {
    if (!selectedImpostPath) return;
    const block = construction.items.find(i => i.type === 'window' && i.data.id === selectedImpostPath.blockId);
    if (!block || block.type !== 'window') return;

    const result = removeImpost(block.data.root, selectedImpostPath.path);
    handleUpdateWindowTree(selectedImpostPath.blockId, result.newRoot);
    handleDeselect();
  };

  const handleRemoveWindow = () => {
    if (!selectedBlockId || !selectedWindowPath) return;
    const block = construction.items.find(i => i.type === 'window' && i.data.id === selectedBlockId);
    if (!block || block.type !== 'window') return;

    const result = removeWindow(block.data.root, selectedWindowPath);
    handleUpdateWindowTree(selectedBlockId, result.newRoot);
    handleDeselect();
  };

  const handleDeleteBlock = () => {
    if (!selectedBlockId || isSingleWindow) return;
    
    const newItems = [];
    let skipNextConnector = false;
    
    for (let i = 0; i < construction.items.length; i++) {
      const item = construction.items[i];
      
      if ((item.type === 'window' && item.data.id === selectedBlockId) || (item.type === 'connector' && item.id === selectedBlockId)) {
        if (i > 0 && construction.items[i - 1].type === 'connector') {
          newItems.pop();
        } else {
          skipNextConnector = true;
        }
        continue;
      }
      
      if (skipNextConnector && item.type === 'connector') {
        skipNextConnector = false;
        continue;
      }
      
      newItems.push(item);
    }
    
    onChange({ ...construction, items: newItems });
    handleDeselect();
  };

  const handleAddWindowToConstruction = () => {
    const defaultHeight = construction.items.length > 0 
      ? (construction.items[construction.items.length - 1].type === 'window' ? (construction.items[construction.items.length - 1] as any).data.height : construction.height)
      : construction.height;

    onChange({
      ...construction,
      items: [
        ...construction.items,
        { type: 'connector', id: crypto.randomUUID(), width: 50, height: defaultHeight, connectorType: 'standard' },
        { type: 'window', data: { id: crypto.randomUUID(), width: 1000, height: defaultHeight, root: { kind: 'window', id: crypto.randomUUID(), type: 'fixed', hingePosition: 'left', hingeSide: 'bottom', glazing: 'standard', hasMosquitoNet: false } } }
      ]
    });
  };

  const selectedBlock = construction.items.find(i => 
    (i.type === 'window' && i.data.id === selectedBlockId) || 
    (i.type === 'connector' && i.id === selectedBlockId)
  );
  
  const selectedWindowData = selectedBlock && selectedBlock.type === 'window' ? selectedBlock.data : null;
  const selectedConnectorData = selectedBlock && selectedBlock.type === 'connector' ? selectedBlock : null;
  
  const selectedLeafNode = selectedWindowData && selectedWindowPath 
    ? getNode(selectedWindowData.root, selectedWindowPath) 
    : null;

  const totalWidth = construction.items.reduce((sum, item) => sum + (item.type === 'connector' ? item.width : item.data.width), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <ConstructionToolbar 
          construction={construction}
          selectedBlockId={selectedBlockId}
          selectedImpostPath={selectedImpostPath}
          selectedWindowData={selectedWindowData}
          selectedConnectorData={selectedConnectorData}
          selectedLeafNode={selectedLeafNode}
          isSingleWindow={isSingleWindow}
          onChangeType={handleChangeType}
          onChangeHinge={handleChangeHinge}
          onChangeGlazing={handleChangeGlazing}
          onToggleMosquitoNet={handleToggleMosquitoNet}
          onAddImpost={handleAddImpost}
          onRemoveWindow={handleRemoveWindow}
          onDeleteBlock={handleDeleteBlock}
          onRemoveImpost={handleRemoveImpost}
          onUpdateConnectorType={handleUpdateConnectorType}
          onDeselect={handleDeselect}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '800px', marginBottom: '12px', padding: '0 8px' }}>
        {selectedWindowData && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <label style={{ fontSize: '12px' }}>Ширина окна (мм): 
              <input 
                type="number" 
                value={selectedWindowData.width} 
                onChange={(e) => handleUpdateWindow(selectedWindowData.id, { width: Number(e.target.value) })} 
                style={{ width: '70px', marginLeft: '4px', padding: '4px', fontSize: '12px' }} 
              />
            </label>
            <label style={{ fontSize: '12px' }}>Высота окна (мм): 
              <input 
                type="number" 
                value={selectedWindowData.height} 
                onChange={(e) => handleUpdateWindow(selectedWindowData.id, { height: Number(e.target.value) })} 
                style={{ width: '70px', marginLeft: '4px', padding: '4px', fontSize: '12px' }} 
              />
            </label>
          </div>
        )}
        {!isSingleWindow && (
          <button onClick={handleAddWindowToConstruction} className="no-print" style={{ padding: '8px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', width: '100%' }}>
            + Добавить окно в конструкцию
          </button>
        )}
      </div>

      <ConstructionCanvas 
        construction={construction}
        selectedBlockId={selectedBlockId}
        selectedWindowPath={selectedWindowPath}
        selectedImpostPath={selectedImpostPath}
        maxHeight={maxHeight}
        totalWidth={totalWidth}
        onSelectBlock={handleSelectBlock}
        onSelectLeaf={handleSelectLeaf}
        onSelectImpost={handleSelectImpost}
      />

      {impostDir && impostModalData && (
        <ImpostModal 
          direction={impostDir} 
          maxSize={impostModalData.maxSize} 
          onCancel={() => { setImpostDir(null); setImpostModalData(null); }} 
          onConfirm={confirmImpost} 
        />
      )}
    </div>
  );
}