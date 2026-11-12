export type OpeningBaseType = 'fixed' | 'casement' | 'tilt-turn' | 'blind';
export type HingePosition = 'left' | 'right';
export type HingeSide = 'bottom' | 'top';
export type GlazingType = 'standard' | 'energy' | 'sandwich';

export interface WindowLeafNode {
  kind: 'window';
  id: string;
  type: OpeningBaseType;
  hingePosition?: HingePosition;
  hingeSide?: HingeSide;
  glazing: GlazingType;
  hasMosquitoNet: boolean;
}

export interface SplitNode {
  kind: 'split';
  id: string;
  direction: 'vertical' | 'horizontal';
  ratios: number[];
  children: WindowNode[];
}

export type WindowNode = WindowLeafNode | SplitNode;

export interface WindowBlock {
  id: string;
  width: number;
  height: number;
  root: WindowNode;
}

export type ConnectorType = 'standard' | 'balcony' | 'bay' | 'balcony_reinforced';

export interface ConnectorBlock {
  id: string;
  type: 'connector';
  width: number;
  height: number;
  connectorType: ConnectorType;
}

export type ConstructionItem = { type: 'window'; data: WindowBlock } | ConnectorBlock;

export interface ProjectItem {
  id: string;
  name: string;
  itemType: 'window' | 'construction';
  height: number;
  items: ConstructionItem[];
}

export interface Project {
  id: string;
  name: string;
  items: ProjectItem[];
}

export interface AppData {
  version: 11;
  projects: Project[];
  activeProjectId: string | null;
}

export const CONNECTOR_LABELS: Record<ConnectorType, string> = {
  standard: '90 градусов',
  balcony: 'Балконный',
  bay: 'Эркерный',
  balcony_reinforced: 'Балконный усиленный',
};

export const OPENING_LABELS: Record<OpeningBaseType, string> = {
  fixed: 'Глухое',
  casement: 'Поворотное',
  'tilt-turn': 'Поворотно-откидное',
  blind: 'Глухое (штриховка)',
};

export const GLAZING_LABELS: Record<GlazingType, string> = {
  standard: 'Стеклопакет стандарт',
  energy: 'Стеклопакет энергосберегающий',
  sandwich: 'Сендвич панель',
};

export function makeWindow(type: OpeningBaseType = 'fixed'): WindowLeafNode {
  return { 
    kind: 'window', 
    id: crypto.randomUUID(), 
    type, 
    hingePosition: 'left', 
    hingeSide: 'bottom',
    glazing: 'standard',
    hasMosquitoNet: false,
  };
}

export function makeWindowBlock(width: number, height: number): WindowBlock {
  return { id: crypto.randomUUID(), width, height, root: makeWindow('fixed') };
}

export function makeProject(name: string): Project {
  return { id: crypto.randomUUID(), name, items: [] };
}

export function makeProjectItem(name: string, type: 'window' | 'construction', height: number): ProjectItem {
  const initialWindow = { type: 'window', data: makeWindowBlock(1000, height) } as ConstructionItem;
  return {
    id: crypto.randomUUID(),
    name,
    itemType: type,
    height,
    items: [initialWindow],
  };
}

export function isAppData(v: unknown): v is AppData {
  if (typeof v !== 'object' || v === null) return false;
  const c = v as Record<string, unknown>;
  return c.version === 11 && Array.isArray(c.projects);
}