'use client';

import { WindowConfig, OPENING_LABELS } from '@/types';

/** Иконка/подпись типа открывания */
function OpeningBadge({ type }: { type: WindowConfig['sections'][0]['type'] }) {
  const base =
    'text-[10px] leading-none px-1 py-0.5 rounded border font-medium whitespace-nowrap';
  const styles: Record<string, string> = {
    fixed: 'border-gray-300 text-gray-500 bg-gray-50',
    casement: 'border-blue-300 text-blue-700 bg-blue-50',
    'tilt-turn': 'border-green-300 text-green-700 bg-green-50',
  };
  return <span className={`${base} ${styles[type]}`}>{OPENING_LABELS[type]}</span>;
}

export default function WindowSketch({ config }: { config: WindowConfig }) {
  // Масштаб для экрана: 1 мм ≈ 0.4 px, чтобы окно 1500×1400 влезало
  const SCALE = 0.4;
  const screenWidth = config.width * SCALE;
  const screenHeight = config.height * SCALE;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Рама окна */}
      <div
        id="window-canvas"
        className="border-[6px] border-gray-700 bg-white relative flex shadow-md"
        style={{ width: screenWidth, height: screenHeight }}
      >
        {config.sections.map((section, i) => (
          <div
            key={section.id}
            className="relative flex flex-col items-center justify-center border-2 border-gray-400 bg-white"
            style={{
              flex: section.flex,
              borderLeftWidth: i === 0 ? 0 : 2,
            }}
          >
            {/* Имитация ручки справа */}
            {section.type !== 'fixed' && (
              <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-gray-400 rounded-full" />
            )}

            {/* Тип открывания */}
            <OpeningBadge type={section.type} />
          </div>
        ))}
      </div>

      {/* Размеры под эскизом */}
      <div className="text-xs text-gray-600">
        {config.width} × {config.height} мм
      </div>
    </div>
  );
}