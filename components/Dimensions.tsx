'use client';

import { SplitNode, WindowNode } from '@/types';

interface Props {
  node: WindowNode;
  path: string[];
  width: number;
  height: number;
  scale: number;
}

export default function Dimensions({ node, path, width, height, scale }: Props) {
  // Функция для рендера размеров конкретной секции
  if (node.kind === 'window') {
    return (
      <g>
        {/* Горизонтальный размер (сверху) */}
        <line x1="0" y1="-20" x2={width * scale} y2="-20" stroke="#ef4444" strokeWidth="1" />
        <line x1="0" y1="-20" x2="0" y2="-10" stroke="#ef4444" strokeWidth="1" />
        <line x1={width * scale} y1="-20" x2={width * scale} y2="-10" stroke="#ef4444" strokeWidth="1" />
        {/* Стрелки */}
        <polygon points={`0,-20 5,-22 5,-18`} fill="#ef4444" />
        <polygon points={`${width * scale},-20 ${width * scale - 5},-22 ${width * scale - 5},-18`} fill="#ef4444" />
        <text x={(width * scale) / 2} y="-25" fontSize="12" fill="#ef4444" textAnchor="middle">{Math.round(width)}</text>
      </g>
    );
  }

  return null; // Для сплитов рисуем размеры внутри дочерних компонентов
}