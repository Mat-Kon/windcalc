'use client';

import { WindowSection, OPENING_LABELS, OpeningType } from '@/types';

interface Props {
  section: WindowSection;
  index: number;
  canDelete: boolean;
  onChange: (updated: WindowSection) => void;
  onDelete: () => void;
}

export default function SectionEditor({
  section,
  index,
  canDelete,
  onChange,
  onDelete,
}: Props) {
  return (
    <div className="border rounded p-3 bg-white space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Секция {index + 1}</span>
        {canDelete && (
          <button
            onClick={onDelete}
            className="text-xs text-red-600 hover:underline"
          >
            Удалить
          </button>
        )}
      </div>

      <label className="block text-xs text-gray-600">
        Тип открывания
        <select
          value={section.type}
          onChange={(e) =>
            onChange({ ...section, type: e.target.value as OpeningType })
          }
          className="mt-1 w-full border rounded px-2 py-1 text-sm"
        >
          {Object.entries(OPENING_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-xs text-gray-600">
        Пропорция ширины: {section.flex}
        <input
          type="range"
          min={1}
          max={10}
          value={section.flex}
          onChange={(e) =>
            onChange({ ...section, flex: Number(e.target.value) })
          }
          className="mt-1 w-full"
        />
      </label>
    </div>
  );
}