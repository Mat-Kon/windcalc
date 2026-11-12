'use client';

import { useState } from 'react';

interface Props {
  onCancel: () => void;
  onCreate: (width: number, height: number) => void;
}

export default function CreateWindowModal({ onCancel, onCreate }: Props) {
  const [width, setWidth] = useState(1400);
  const [height, setHeight] = useState(1400);

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-96"
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '24px',
          width: '384px',
          maxWidth: '90vw',
        }}
      >
        <h2 className="text-lg font-semibold mb-4" style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '16px' }}>
          Новое окно
        </h2>

        <div className="space-y-3">
          <label className="block text-sm" style={{ display: 'block', fontSize: '0.875rem' }}>
            Ширина, мм
            <input
              type="number"
              min={200}
              step={10}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="mt-1 w-full border rounded px-2 py-1"
              style={{ display: 'block', width: '100%', marginTop: '4px', border: '1px solid #d1d5db', borderRadius: '4px', padding: '4px 8px' }}
              autoFocus
            />
          </label>
          <label className="block text-sm" style={{ display: 'block', fontSize: '0.875rem' }}>
            Высота, мм
            <input
              type="number"
              min={200}
              step={10}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="mt-1 w-full border rounded px-2 py-1"
              style={{ display: 'block', width: '100%', marginTop: '4px', border: '1px solid #d1d5db', borderRadius: '4px', padding: '4px 8px' }}
            />
          </label>
        </div>

        <div className="flex justify-end gap-2 mt-6" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded border hover:bg-gray-50"
            style={{ padding: '8px 16px', fontSize: '0.875rem', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer' }}
          >
            Отмена
          </button>
          <button
            onClick={() => onCreate(width, height)}
            className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
            style={{ padding: '8px 16px', fontSize: '0.875rem', borderRadius: '4px', backgroundColor: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            Создать
          </button>
        </div>
      </div>
    </div>
  );
}