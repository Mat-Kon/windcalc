'use client';

import { SplitNode, WindowNode } from '@/types';
import WindowLeaf from './WindowLeaf';

interface Props {
  node: WindowNode;
  path: string[];
  selectedPath: string[] | null;
  selectedImpostPath: string[] | null;
  onSelect: (path: string[]) => void;
  onSelectImpost: (path: string[]) => void;
  width: number;
  height: number;
  showDimensions?: boolean;
}

export default function NodeView({
  node,
  path,
  selectedPath,
  selectedImpostPath,
  onSelect,
  onSelectImpost,
  width,
  height,
  showDimensions = true,
}: Props) {
  if (!node) return null;

  const isSelected = selectedPath !== null && selectedPath.length === path.length && selectedPath.every((id, i) => id === path[i]);

  if (node.kind === 'window') {
    return (
      <div 
        onClick={(e) => { e.stopPropagation(); onSelect(path); }}
        style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer', boxShadow: isSelected ? 'inset 0 0 0 3px #3b82f6' : 'none' }}
      >
        <WindowLeaf node={node} isSelected={isSelected} onSelect={() => onSelect(path)} width={width} height={height} />
      </div>
    );
  }

  const split = node as SplitNode;
  const isVertical = split.direction === 'vertical';

  const isImpostSelected = selectedImpostPath !== null && selectedImpostPath.length === path.length && selectedImpostPath.every((id, i) => id === path[i]);

  return (
    <div style={{ display: 'flex', flexDirection: isVertical ? 'row' : 'column', width: '100%', height: '100%' }}>
      {split.children.map((child, i) => {
        const childWidth = isVertical ? width * split.ratios[i] : width;
        const childHeight = isVertical ? height : height * split.ratios[i];

        return (
          <div key={child.id} style={{ flex: split.ratios[i], position: 'relative', display: 'flex', minWidth: 0, minHeight: 0 }}>
            <NodeView
              node={child}
              path={[...path, child.id]}
              selectedPath={selectedPath}
              selectedImpostPath={selectedImpostPath}
              onSelect={onSelect}
              onSelectImpost={onSelectImpost}
              width={childWidth}
              height={childHeight}
              showDimensions={showDimensions}
            />
            {i < split.children.length - 1 && (
              <div
                onClick={(e) => { e.stopPropagation(); onSelectImpost(path); }}
                style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  zIndex: isImpostSelected ? 10 : 'auto',
                  ...(isVertical ? { right: 0, top: 0, bottom: 0, width: '6px' } : { bottom: 0, left: 0, right: 0, height: '6px' }),
                  backgroundColor: isImpostSelected ? '#ef4444' : '#000',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}