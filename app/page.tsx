'use client';

import { useState, useEffect } from 'react';
import { AppData, ProjectItem, makeProject, makeProjectItem, isAppData } from '@/types';
import { useWindowStorage } from '@/lib/useWindowStorage';
import ConstructionEditor from '@/components/ConstructionEditor';

export default function Home() {
  const [data, setData] = useWindowStorage<AppData>('app-data-v11', { 
    version: 11, 
    projects: [], 
    activeProjectId: null 
  }, {
    validate: (v): v is AppData => isAppData(v)
  });
  
  const [isMounted, setIsMounted] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('Новый проект');
  
  const [showCreateItem, setShowCreateItem] = useState<'window' | 'construction' | null>(null);
  const [newItemName, setNewItemName] = useState('Новый элемент');
  const [newItemHeight, setNewItemHeight] = useState('1400');

  useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted || !data) return null;

  const activeProject = data.projects.find(p => p.id === data.activeProjectId);
  const activeItem = activeProject?.items.find(i => i.id === activeItemId);

  const handleCreateProject = () => {
    const newProj = makeProject(newProjectName);
    setData({ ...data, projects: [...data.projects, newProj], activeProjectId: newProj.id });
    setShowCreateProject(false);
    setNewProjectName('Новый проект');
  };

  const handleCreateItem = () => {
    if (!activeProject || !showCreateItem) return;
    const height = newItemHeight === '' ? 1400 : Number(newItemHeight);
    const newItem = makeProjectItem(newItemName || 'Без названия', showCreateItem, height);
    
    setData({
      ...data,
      projects: data.projects.map(p => p.id === activeProject.id ? { ...p, items: [...p.items, newItem] } : p)
    });
    setShowCreateItem(null);
    setNewItemName('Новый элемент');
    setActiveItemId(newItem.id);
  };

  const handleUpdateItem = (updated: ProjectItem) => {
    if (!activeProject) return;
    setData({
      ...data,
      projects: data.projects.map(p => p.id === activeProject.id ? { ...p, items: p.items.map(i => i.id === updated.id ? updated : i) } : p)
    });
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Удалить проект?')) return;
    setData({
      ...data,
      projects: data.projects.filter(p => p.id !== id),
      activeProjectId: data.activeProjectId === id ? null : data.activeProjectId
    });
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeProject) return;
    if (!confirm('Удалить этот элемент?')) return;
    setData({
      ...data,
      projects: data.projects.map(p => p.id === activeProject.id ? { ...p, items: p.items.filter(i => i.id !== id) } : p)
    });
    if (activeItemId === id) setActiveItemId(null);
  };

  if (!activeProject) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f3f4f6' }}>
        <header style={{ padding: '16px', background: '#3b82f6', color: '#fff' }}>
          <h1 style={{ margin: 0, fontSize: '18px' }}>Мои проекты</h1>
        </header>

        <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <button onClick={() => setShowCreateProject(true)} style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer', marginBottom: '16px', fontWeight: 'bold' }}>
            + Добавить проект
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.projects.length === 0 && <p style={{ textAlign: 'center', color: '#6b7280' }}>У вас пока нет проектов</p>}
            {data.projects.map(p => (
              <div key={p.id} onClick={() => setData({ ...data, activeProjectId: p.id })} style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>📁 {p.name}</h3>
                  <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '13px' }}>Элементов: {p.items.length}</p>
                </div>
                <button onClick={(e) => handleDeleteProject(p.id, e)} style={{ padding: '6px 10px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
                  🗑 Удалить
                </button>
              </div>
            ))}
          </div>
        </div>

        {showCreateProject && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '100%', maxWidth: '320px' }}>
              <h2 style={{ marginTop: 0, fontSize: '18px' }}>Новый проект</h2>
              <input value={newProjectName} onChange={e => setNewProjectName(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '16px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button onClick={() => setShowCreateProject(false)} style={{ padding: '8px 12px', background: '#fff', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}>Отмена</button>
                <button onClick={handleCreateProject} style={{ background: '#2563eb', color: '#fff', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Создать</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!activeItem) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f3f4f6' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#3b82f6', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setData({ ...data, activeProjectId: null })} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px' }}>← Назад</button>
            <h1 style={{ margin: 0, fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activeProject.name}</h1>
          </div>
        </header>

        <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            <button onClick={() => { setShowCreateItem('window'); setNewItemName('Окно 1'); }} style={{ padding: '12px', background: '#059669', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
              + Добавить окно
            </button>
            <button onClick={() => { setShowCreateItem('construction'); setNewItemName('Конструкция 1'); }} style={{ padding: '12px', background: '#2563eb', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
              + Добавить конструкцию
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeProject.items.length === 0 && <p style={{ textAlign: 'center', color: '#6b7280' }}>В проекте пока нет окон или конструкций</p>}
            {activeProject.items.map(c => (
              <div key={c.id} onClick={() => setActiveItemId(c.id)} style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px' }}>
                    {c.itemType === 'window' ? '🪟 Окно: ' : '🧱 Конструкция: '} 
                    {c.name}
                  </h3>
                  <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '13px' }}>Высота: {c.height} мм</p>
                </div>
                <button onClick={(e) => handleDeleteItem(c.id, e)} style={{ padding: '6px 10px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
                  🗑 Удалить
                </button>
              </div>
            ))}
          </div>
        </div>

        {showCreateItem && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '100%', maxWidth: '320px' }}>
              <h2 style={{ marginTop: 0, fontSize: '18px' }}>Новый элемент</h2>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Название 
                <input value={newItemName} onChange={e => setNewItemName(e.target.value)} style={{ width: '100%', padding: '6px', marginTop: '4px', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box' }} />
              </label>
              <label style={{ display: 'block', marginBottom: '16px', fontSize: '14px' }}>Высота (мм) 
                <input type="number" value={newItemHeight} onChange={e => setNewItemHeight(e.target.value)} style={{ width: '100%', padding: '6px', marginTop: '4px', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box' }} />
              </label>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowCreateItem(null)} style={{ padding: '8px 12px', border: '1px solid #d1d5db', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}>Отмена</button>
                <button onClick={handleCreateItem} style={{ padding: '8px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Создать</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#3b82f6', color: '#fff' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', overflow: 'hidden' }}>
          <button onClick={() => setActiveItemId(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px', flexShrink: 0 }}>← Назад</button>
          <h1 style={{ fontSize: '16px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activeItem.name}</h1>
        </div>
        <button onClick={() => window.print()} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px', flexShrink: 0 }}>PDF</button>
      </header>
      
      <div style={{ flex: 1, background: '#f3f4f6', padding: '8px' }}>
        <ConstructionEditor 
          construction={activeItem} 
          onChange={handleUpdateItem} 
        />
      </div>
    </div>
  );
}