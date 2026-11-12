'use client';

import { WindowLeafNode } from '@/types';

interface Props {
  node: WindowLeafNode;
  isSelected: boolean;
  onSelect: () => void;
  width: number;
  height: number;
}

export default function WindowLeaf({ node, isSelected, onSelect, width, height }: Props) {
  const isBlind = node.type === 'blind';
  const isRight = node.hingePosition === 'right';
  const isTop = node.hingeSide === 'top';

  const xLeft = 0;
  const xRight = width;
  const yTop = 0;
  const yBottom = height;
  const midX = width / 2;
  const midY = height / 2;

  const hingeX = isRight ? xRight : xLeft;
  const hingeY = isTop ? yTop : yBottom;
  
  const oppX = isRight ? xLeft : xRight;
  const oppY = isTop ? yBottom : yTop;

  let fillColor = 'transparent';
  if (node.glazing === 'energy') fillColor = 'rgba(59, 130, 246, 0.1)';
  if (node.glazing === 'sandwich') fillColor = '#d1d5db';

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        cursor: 'pointer',
        border: '1px solid #000',
        backgroundColor: isSelected ? '#e0f2fe' : isBlind ? '#d1d5db' : '#fff',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{ display: 'block' }}
      >
        {fillColor !== 'transparent' && (
          <rect x="0" y="0" width={width} height={height} fill={fillColor} />
        )}

        {node.type === 'casement' && (
          <>
            <polygon
              points={`${hingeX},${isTop ? yTop : yBottom} ${oppX},${midY} ${hingeX},${isTop ? yBottom : yTop}`}
              fill="none"
              stroke="#22c55e"
              strokeWidth="1.5"
            />
            <text x={width * 0.2} y={height / 2} fontSize="14" fill="#22c55e" textAnchor="middle" dominantBaseline="middle">М</text>
          </>
        )}

        {node.type === 'tilt-turn' && (
          <>
            <polygon
              points={`${hingeX},${isTop ? yTop : yBottom} ${oppX},${midY} ${hingeX},${isTop ? yBottom : yTop}`}
              fill="none"
              stroke="#22c55e"
              strokeWidth="1.5"
            />
            <polygon
              points={`${isRight ? xRight : xLeft},${hingeY} ${midX},${oppY} ${isRight ? xLeft : xRight},${hingeY}`}
              fill="none"
              stroke="#22c55e"
              strokeWidth="1.5"
            />
            <text x={width * 0.2} y={height / 2} fontSize="14" fill="#22c55e" textAnchor="middle" dominantBaseline="middle">М</text>
          </>
        )}

        {node.hasMosquitoNet && (
          <text 
            x={width / 2} 
            y={height / 2} 
            fontSize={Math.min(width, height) * 0.3} 
            fill="#9ca3af" 
            textAnchor="middle" 
            dominantBaseline="middle"
            style={{ userSelect: 'none' }}
          >
            #
          </text>
        )}
      </svg>
    </div>
  );
}