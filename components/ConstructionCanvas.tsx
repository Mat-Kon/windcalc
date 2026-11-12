'use client';

import { useState, useEffect, useRef } from 'react';
import { ProjectItem, CONNECTOR_LABELS } from '@/types';
import NodeView from './NodeView';

interface Props {
  construction: ProjectItem;
  selectedBlockId: string | null;
  selectedWindowPath: string[] | null;
  selectedImpostPath: { blockId: string; path: string[] } | null;
  maxHeight: number;
  totalWidth: number;
  onSelectBlock: (id: string) => void;
  onSelectLeaf: (blockId: string, path: string[]) => void;
  onSelectImpost: (blockId: string, path: string[]) => void;
}

export default function ConstructionCanvas({
  construction,
  selectedBlockId,
  selectedWindowPath,
  selectedImpostPath,
  maxHeight,
  totalWidth,
  onSelectBlock,
  onSelectLeaf,
  onSelectImpost,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateScale = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      
      // На мобилке отступы меньше
      const paddingX = 40; 
      const paddingY = 60; 
      const availableWidth = Math.max(100, width - paddingX);
      const availableHeight = Math.max(100, height - paddingY);

      const scaleX = availableWidth / totalWidth;
      const scaleY = availableHeight / maxHeight;
      
      const newScale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.05), 1);
      setScale(newScale);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [totalWidth, maxHeight]);

  return (
    <div 
      ref={containerRef} 
      id="print-area" 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        width: '100%', 
        height: '50vh', 
        minHeight: '250px',
        padding: '10px', 
        background: '#f9fafb', 
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div className="print-scale-wrapper">
        <div style={{ 
          position: 'relative', 
          paddingTop: '20px', 
          paddingRight: '20px',
          width: (totalWidth * scale) + 30,
          height: (maxHeight * scale) + 30,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          
          {/* Общая ширина сверху */}
          <div style={{ position: 'absolute', top: '0px', left: 0, right: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontSize: '10px' }}>
            <span style={{ borderTop: '1px solid #ef4444', flex: 1, marginRight: '4px' }}></span>
            {totalWidth}
            <span style={{ borderTop: '1px solid #ef4444', flex: 1, marginLeft: '4px' }}></span>
          </div>

          {/* Общая высота (справа) */}
          <div style={{ position: 'absolute', top: '20px', bottom: '20px', right: '-10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontSize: '10px' }}>
            <span style={{ borderRight: '1px solid #ef4444', flex: 1, marginBottom: '4px' }}></span>
            <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{maxHeight}</span>
            <span style={{ borderRight: '1px solid #ef4444', flex: 1, marginTop: '4px' }}></span>
          </div>

          {/* Сама конструкция */}
          <div className="sketch-container" style={{ 
            border: '2px solid #000', 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'flex-end', 
            width: totalWidth * scale,
            height: maxHeight * scale, 
            background: '#fff',
            position: 'relative'
          }}>
            {construction.items.map((item, index) => {
              const isBlockSelected = selectedBlockId === item.id || (item.type === 'window' && selectedBlockId === item.data.id);
              const itemWidth = item.type === 'connector' ? item.width : item.data.width;

              if (item.type === 'connector') {
                let pattern = 'repeating-linear-gradient(45deg, #9ca3af, #9ca3af 4px, #d1d5db 4px, #d1d5db 8px)';
                if (item.connectorType === 'balcony') pattern = 'repeating-linear-gradient(0deg, #6b7280, #6b7280 4px, #e5e7eb 4px, #e5e7eb 8px)';
                if (item.connectorType === 'bay') pattern = 'repeating-linear-gradient(90deg, #6b7280, #6b7280 4px, #e5e7eb 4px, #e5e7eb 8px)';
                if (item.connectorType === 'balcony_reinforced') pattern = 'repeating-linear-gradient(45deg, #374151, #374151 4px, #9ca3af 4px, #9ca3af 8px)';

                return (
                  <div 
                    key={item.id} 
                    onClick={() => onSelectBlock(item.id)}
                    style={{ 
                      width: itemWidth * scale, 
                      height: item.height * scale,
                      background: pattern,
                      flexShrink: 0,
                      cursor: 'pointer',
                      position: 'relative',
                      borderRight: '1px solid #000',
                      boxShadow: isBlockSelected ? 'inset 0 0 0 2px #3b82f6' : 'none'
                    }} 
                  >
                  </div>
                );
              }
              
              const shouldHighlight = selectedBlockId === item.data.id;
              const pathForWindow = shouldHighlight ? selectedWindowPath : null;
              const impostPathForWindow = selectedImpostPath?.blockId === item.data.id ? selectedImpostPath.path : null;
              
              return (
                <div 
                  key={item.data.id} 
                  style={{ 
                    width: itemWidth * scale, 
                    height: item.data.height * scale,
                    flexShrink: 0, 
                    position: 'relative', 
                    borderRight: index !== construction.items.length - 1 ? '1px solid #000' : 'none',
                    alignSelf: 'flex-end'
                  }}
                >
                  <NodeView 
                    node={item.data.root} 
                    path={[]} 
                    selectedPath={pathForWindow}
                    selectedImpostPath={impostPathForWindow}
                    onSelect={(path) => onSelectLeaf(item.data.id, path)} 
                    onSelectImpost={(path) => onSelectImpost(item.data.id, path)} 
                    width={item.data.width} 
                    height={item.data.height} 
                    showDimensions={false}
                  />
                  
                  {/* Ширина окна снизу (скрываем на мобилке, если слишком мелко) */}
                  {scale > 0.1 && (
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '-20px',
                      left: 0, 
                      right: 0, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: '#ef4444', 
                      fontSize: '8px',
                      fontWeight: 'bold'
                    }}>
                      <span style={{ borderTop: '1px solid #ef4444', flex: 1, marginRight: '2px' }}></span>
                      {item.data.width}
                      <span style={{ borderTop: '1px solid #ef4444', flex: 1, marginLeft: '2px' }}></span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}