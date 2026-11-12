'use client';

import { useState } from 'react';

interface Props {
  direction: 'vertical' | 'horizontal';
  maxSize: number;
  onCancel: () => void;
  onConfirm: (positionMm: number) => void;
}

export default function ImpostModal({ direction, maxSize, onCancel, onConfirm }: Props) {
  const [pos, setPos] = useState(Math.round(maxSize / 2));
  const [inputValue, setInputValue] = useState(String(Math.round(maxSize / 2)));
  
  const isVertical = direction === 'vertical';

  const minPos = 100;
  const maxPos = Math.max(minPos + 1, maxSize - 100);

  const handleSliderChange = (val: number) => {
    const clamped = Math.min(maxPos, Math.max(minPos, val));
    setPos(clamped);
    setInputValue(String(clamped));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (val !== '') {
      const num = Number(val);
      if (num >= minPos && num <= maxPos) {
        setPos(num);
      }
    }
  };

  const handleBlur = () => {
    if (inputValue === '') {
      setInputValue(String(pos));
    } else {
      const num = Number(inputValue);
      const clamped = Math.min(maxPos, Math.max(minPos, num));
      setPos(clamped);
      setInputValue(String(clamped));
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px', width: '384px', maxWidth: '90vw', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '16px' }}>
          {isVertical ? 'Вертикальный импост' : 'Горизонтальный импост'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem' }}>
            Отступ от {isVertical ? 'левого' : 'верхнего'} края (мм)
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
              <input
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{ border: '1px solid #d1d5db', borderRadius: '4px', padding: '6px 8px', width: '100%' }}
              />
              <span style={{ color: '#6b7280', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                из {Math.round(maxSize)} мм
              </span>
            </div>
          </label>

          <input
            type="range"
            min={minPos}
            max={maxPos}
            value={pos}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
          <button onClick={onCancel} style={{ padding: '8px 16px', fontSize: '0.875rem', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer' }}>
            Отмена
          </button>
          <button onClick={() => onConfirm(pos)} style={{ padding: '8px 16px', fontSize: '0.875rem', borderRadius: '4px', backgroundColor: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
}