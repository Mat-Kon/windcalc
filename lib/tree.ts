import { WindowLeafNode, SplitNode, WindowNode } from '@/types';

export function getNode(root: WindowNode, path: string[]): WindowNode | null {
  if (path.length === 0) return root;
  if (root.kind !== 'split') return null;
  const [head, ...rest] = path;
  const idx = root.children.findIndex((c) => c.id === head);
  if (idx === -1) return null;
  return getNode(root.children[idx], rest);
}

export function replaceNode(root: WindowNode, path: string[], updater: (node: WindowNode) => WindowNode): WindowNode {
  if (path.length === 0) return updater(root);
  if (root.kind !== 'split') return root;
  const [head, ...rest] = path;
  return {
    ...root,
    children: root.children.map((c) => c.id === head ? replaceNode(c, rest, updater) : c),
  };
}

export function splitNode(node: WindowNode, direction: 'vertical' | 'horizontal', position: number): SplitNode {
  const p = Math.min(0.9, Math.max(0.1, position));
  const clone = (n: WindowNode): WindowNode => {
    if (n.kind === 'window') return { ...n, id: crypto.randomUUID() };
    return { ...n, id: crypto.randomUUID(), children: n.children.map(clone) };
  };
  return {
    kind: 'split',
    id: crypto.randomUUID(),
    direction,
    ratios: [p, 1 - p],
    children: [clone(node), clone(node)],
  };
}

export function getNodeSizeByPath(root: WindowNode, path: string[], totalWidth: number, totalHeight: number): { width: number; height: number } {
  let currentWidth = totalWidth;
  let currentHeight = totalHeight;
  let currentNode = root;

  for (const id of path) {
    if (currentNode.kind !== 'split') break;
    const idx = currentNode.children.findIndex((c) => c.id === id);
    if (idx === -1) break;
    const ratio = currentNode.ratios[idx];
    if (currentNode.direction === 'vertical') currentWidth *= ratio;
    else currentHeight *= ratio;
    currentNode = currentNode.children[idx];
  }
  return { width: currentWidth, height: currentHeight };
}

export function removeImpost(root: WindowNode, splitPath: string[]): { newRoot: WindowNode } {
  if (splitPath.length === 0) {
    return { newRoot: { kind: 'window', id: crypto.randomUUID(), type: 'fixed', hingePosition: 'left', hingeSide: 'bottom', glazing: 'standard', hasMosquitoNet: false } };
  }
  const parentPath = splitPath.slice(0, -1);
  const splitId = splitPath[splitPath.length - 1];
  const parent = getNode(root, parentPath);
  if (!parent || parent.kind !== 'split') return { newRoot: root };

  const splitIndex = parent.children.findIndex(c => c.id === splitId);
  if (splitIndex === -1) return { newRoot: root };

  const merged: WindowLeafNode = { kind: 'window', id: crypto.randomUUID(), type: 'fixed', hingePosition: 'left', hingeSide: 'bottom', glazing: 'standard', hasMosquitoNet: false };
  let newRoot = replaceNode(root, splitPath, () => merged);
  return { newRoot };
}

export function removeWindow(root: WindowNode, path: string[]): { newRoot: WindowNode } {
  if (path.length === 0) {
    return { newRoot: { kind: 'window', id: crypto.randomUUID(), type: 'fixed', hingePosition: 'left', hingeSide: 'bottom', glazing: 'standard', hasMosquitoNet: false } };
  }
  const parentPath = path.slice(0, -1);
  const windowId = path[path.length - 1];
  const parent = getNode(root, parentPath);
  if (!parent || parent.kind !== 'split') return { newRoot: root };

  const childIndex = parent.children.findIndex(c => c.id === windowId);
  if (childIndex === -1) return { newRoot: root };

  const newChildren = [...parent.children];
  const newRatios = [...parent.ratios];
  newChildren.splice(childIndex, 1);
  newRatios.splice(childIndex, 1);

  let newParent: WindowNode = { ...parent, children: newChildren, ratios: newRatios };
  let newRoot = replaceNode(root, parentPath, () => newParent);
  
  if (newRoot.kind === 'split' && newRoot.children.length === 1) newRoot = newRoot.children[0];
  else if (newRoot.kind === 'split' && newRoot.children.length === 0) newRoot = { kind: 'window', id: crypto.randomUUID(), type: 'fixed', hingePosition: 'left', hingeSide: 'bottom', glazing: 'standard', hasMosquitoNet: false };

  return { newRoot };
}