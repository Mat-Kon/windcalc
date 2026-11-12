'use client';

import { WindowConfig } from '@/types';
import SectionEditor from './SectionEditor';

interface Props {
  config: WindowConfig;
  onChange: (config: WindowConfig) => void;
}

export default function ControlPanel({ config, onChange }: Props) {
  const updateSection = (id: string, updated: WindowConfig['sections'][0]) => {
    onChange({
      ...config,
      sections: config.sections.map((s) => (s.id === id ? updated : s)),
    });
  };

  const deleteSection = (id: string) => {
    onChange({
      ...config,
      sections: config.sections.filter((s) => s.id !== id),
    });
  };

  const addSection = () => {
    onChange({
      ...config,
      sections: [
        ...config.sections,
        { id: crypto.randomUUID(), flex: 1, type: 'fixed' },
      ],
    });
  };

  return (
    <div className="space-y-4">
      {/* Общие размеры */}
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">
          Ширина, мм
          <input
            type="number"
            min={200}
            step={10}
            value={config.width}
            onChange={(e) =>
              onChange({ ...config, width: Number(e.target.value) })
            }
            className="mt-1 w-full border rounded px-2 py-1"
          />
        </label>
        <label className="text-sm">
          Высота, мм
          <input
            type="number"
            min={200}
            step={10}
            value={config.height}
            onChange={(e) =>
              onChange({ ...config, height: Number(e.target.value) })
            }
            className="mt-1 w-full border rounded px-2 py-1"
          />
        </label>
      </div>

      {/* Список секций */}
      <div className="space-y-2">
        {config.sections.map((section, i) => (
          <SectionEditor
            key={section.id}
            section={section}
            index={i}
            canDelete={config.sections.length > 1}
            onChange={(updated) => updateSection(section.id, updated)}
            onDelete={() => deleteSection(section.id)}
          />
        ))}
      </div>

      <button
        onClick={addSection}
        className="w-full border-2 border-dashed border-gray-400 rounded py-2 text-sm text-gray-600 hover:bg-gray-100"
      >
        + Добавить секцию
      </button>
    </div>
  );
}