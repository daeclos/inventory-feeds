import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Trash, Edit, Copy } from 'lucide-react';

// Simulación de store local (puedes conectar a tu store real)
interface NegativeKeywordList {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const NegativeKeywordsLists: React.FC = () => {
  const [lists, setLists] = useState<NegativeKeywordList[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteId, setDeleteId] = useState<string|null>(null);

  // Crear nueva lista
  const handleCreate = () => {
    if (!newName.trim()) return;
    const now = new Date().toISOString();
    setLists(l => [...l, { id: Math.random().toString(36).slice(2), name: newName, createdAt: now, updatedAt: now }]);
    setNewName('');
    setShowForm(false);
    setSuccessMsg('Negative Keywords List successfully created.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Clonar lista
  const handleClone = (id: string) => {
    const list = lists.find(l => l.id === id);
    if (!list) return;
    const now = new Date().toISOString();
    setLists(l => [...l, { ...list, id: Math.random().toString(36).slice(2), name: list.name + ' (Copy)', createdAt: now, updatedAt: now }]);
    setSuccessMsg('Negative Keywords List successfully cloned.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Eliminar lista
  const handleDelete = (id: string) => {
    setLists(l => l.filter(x => x.id !== id));
    setDeleteId(null);
    setSuccessMsg('Negative Keywords List successfully deleted.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4" style={{ color: '#404042ff' }}>Negative Keywords Lists</h2>
      {successMsg && (
        <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded mb-4">{successMsg}</div>
      )}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold" style={{ color: '#404042ff' }}>Negative Keywords Lists</span>
          <Button style={{ background: '#3b82f6', color: '#fff' }} onClick={() => setShowForm(f => !f)}>
            + Create New Keywords List
          </Button>
        </div>
        {lists.length === 0 && (
          <div className="bg-[#FFF8E1] border border-[#faad39ff] text-[#404042] px-4 py-3 rounded mb-4">
            There are no Negative Keywords Lists added yet.
          </div>
        )}
        {showForm && (
          <div className="mb-6 border rounded p-4">
            <Label className="mb-2 block" htmlFor="newName">New Keywords List Name</Label>
            <Input id="newName" value={newName} onChange={e => setNewName(e.target.value)} className="w-full mb-2" />
            <Button style={{ background: '#3b82f6', color: '#fff' }} onClick={handleCreate}>Submit</Button>
          </div>
        )}
        {lists.length > 0 && (
          <table className="w-full text-left border-t mt-4">
            <thead>
              <tr className="text-[#404042ff]">
                <th className="py-2">Name</th>
                <th className="py-2">Creation Date</th>
                <th className="py-2">Update Date</th>
                <th className="py-2">Clone</th>
                <th className="py-2">Edit</th>
                <th className="py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {lists.map(list => (
                <tr key={list.id} className="border-t">
                  <td className="py-2">{list.name}</td>
                  <td className="py-2">{new Date(list.createdAt).toLocaleString()}</td>
                  <td className="py-2">{new Date(list.updatedAt).toLocaleString()}</td>
                  <td className="py-2">
                    <button title="Clone" onClick={() => handleClone(list.id)}>
                      <Copy className="w-5 h-5 text-[#faad39ff] hover:text-[#404042ff]" />
                    </button>
                  </td>
                  <td className="py-2">
                    <button title="Edit" /* onClick={...} */>
                      <Edit className="w-5 h-5 text-[#faad39ff] hover:text-[#404042ff]" />
                    </button>
                  </td>
                  <td className="py-2">
                    <button title="Delete" onClick={() => setDeleteId(list.id)}>
                      <Trash className="w-5 h-5 text-[#FF0B55] hover:text-[#faad39ff]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Modal de confirmación para eliminar */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 min-w-[320px] max-w-[90vw] flex flex-col items-center">
            <div className="text-6xl text-[#faad39ff] mb-2">!</div>
            <div className="text-xl font-bold mb-2 text-[#404042ff]">Are you sure?</div>
            <div className="mb-4 text-[#404042ff]">This will delete the selected keyword list permanently.</div>
            <div className="flex gap-4">
              <Button style={{ background: '#FF0B55', color: '#fff' }} onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button style={{ background: '#3b82f6', color: '#fff' }} onClick={() => handleDelete(deleteId)}>Confirm</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 