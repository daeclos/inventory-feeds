"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, Trash, Upload, Pencil, Plus, Edit } from "lucide-react";
import DashboardLayout from "@/components/ui/DashboardLayout";

const initialElements = [
  { id: 1, make: "Acura", makeAlt: "", model: "", modelAlt: "", trim: "", trimAlt: "" },
  { id: 2, make: "Audi", makeAlt: "", model: "", modelAlt: "", trim: "", trimAlt: "" },
];

// Datos simulados para Make y Model
const makeOptions = [
  { value: "acura", label: "Acura" },
  { value: "audi", label: "Audi" },
  { value: "bmw", label: "BMW" },
];
const modelOptionsByMake: Record<string, { value: string; label: string }[]> = {
  acura: [
    { value: "ilx", label: "ILX" },
    { value: "mdx", label: "MDX" },
  ],
  audi: [
    { value: "a3", label: "A3" },
    { value: "q5", label: "Q5" },
  ],
  bmw: [
    { value: "x1", label: "X1" },
    { value: "x5", label: "X5" },
  ],
};

// Place these at the top, before your component function
const initialMakeBlock = () => ({ id: Date.now() + Math.random(), make: "", makeAlt: "" });
const initialModelBlock = () => ({ id: Date.now() + Math.random(), make: "", model: "", modelAlt: "" });
const initialTrimBlock = () => ({ id: Date.now() + Math.random(), make: "", model: "", trim: "", trimAlt: "" });

export default function LibraryDetailPage() {
  const [libraryName, setLibraryName] = useState("Default Library");
  const [editingName, setEditingName] = useState(false);
  const [activeForm, setActiveForm] = useState<"make"|null>("make");
  const [elements, setElements] = useState(initialElements);
  const [models, setModels] = useState<any[]>([]);
  const [trims, setTrims] = useState<any[]>([]);

  // Form states
  const [makeBlocks, setMakeBlocks] = useState([initialMakeBlock()]);
  const [modelBlocks, setModelBlocks] = useState<any[]>([]);
  const [trimBlocks, setTrimBlocks] = useState<any[]>([]);

  // Add block handlers
  const addMakeBlock = () => setMakeBlocks(blocks => [...blocks, initialMakeBlock()]);
  const addModelBlock = () => setModelBlocks(blocks => [...blocks, initialModelBlock()]);
  const addTrimBlock = () => setTrimBlocks(blocks => [...blocks, initialTrimBlock()]);

  // Clone/delete handlers
  const cloneBlock = (blocks: any[], setBlocks: any, idx: number) => {
    setBlocks([
      ...blocks.slice(0, idx + 1),
      { ...blocks[idx], id: Date.now() + Math.random() },
      ...blocks.slice(idx + 1),
    ]);
  };
  const deleteBlock = (blocks: any[], setBlocks: any, idx: number) => {
    setBlocks(blocks.filter((_, i) => i !== idx));
  };

  // Change handlers
  const handleMakeBlockChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMakeBlocks(blocks => blocks.map((b, i) => i === idx ? { ...b, [name]: value } : b));
  };
  const handleModelBlockChange = (idx: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setModelBlocks(blocks => blocks.map((b, i) => i === idx ? { ...b, [name]: value } : b));
  };
  const handleTrimBlockChange = (idx: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTrimBlocks(blocks => blocks.map((b, i) => i === idx ? { ...b, [name]: value } : b));
  };

  // Submit handler
  const handleSubmitAll = (e: React.FormEvent) => {
    e.preventDefault();
    // Agrega los bloques de Make a la tabla Make
    setMakeTable(prev => [
      ...prev,
      ...makeBlocks.filter(b => b.make.trim() !== "")
    ]);
    setMakeBlocks([initialMakeBlock()]);
    // Puedes limpiar los bloques de Model y Trim si lo deseas
    // setModelBlocks([]); setTrimBlocks([]);
  };

  const [makeTable, setMakeTable] = useState<any[]>([]);

  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        {/* Header editable */}
        <div className="flex items-center gap-2 mb-4">
          {editingName ? (
            <Input
              value={libraryName}
              onChange={e => setLibraryName(e.target.value)}
              onBlur={() => setEditingName(false)}
              autoFocus
              className="text-xl font-semibold w-auto px-2 py-1"
            />
          ) : (
            <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
              {libraryName}
              <button onClick={() => setEditingName(true)} className="text-primary hover:text-orange-600">
                <Pencil size={18} />
              </button>
            </h2>
          )}
        </div>

        {/* Add new elements section */}
        <div className="bg-muted/40 border border-border rounded-lg mb-8 p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Add new elements</h3>
          <div className="flex gap-2 mb-6">
            <Button variant="outline" onClick={addMakeBlock}><Plus className="w-4 h-4 mr-1" />Make</Button>
            <Button variant="outline" onClick={addModelBlock}><Plus className="w-4 h-4 mr-1" />Model</Button>
            <Button variant="outline" onClick={addTrimBlock}><Plus className="w-4 h-4 mr-1" />Trim</Button>
            <Button variant="outline" className="flex items-center gap-2"><Upload className="w-4 h-4" /> Upload</Button>
          </div>

          <form onSubmit={handleSubmitAll} className="space-y-8">
            {/* Make blocks */}
            {makeBlocks.map((block, idx) => (
              <div key={block.id} className="bg-background border rounded-lg p-4 mb-4 flex flex-col gap-4 relative">
                <div className="absolute right-4 top-4 flex gap-2">
                  <Button type="button" variant="ghost" size="icon" onClick={() => cloneBlock(makeBlocks, setMakeBlocks, idx)}><Copy className="h-5 w-5 text-primary" /></Button>
                  <Button type="button" variant="ghost" size="icon" onClick={() => deleteBlock(makeBlocks, setMakeBlocks, idx)}><Trash className="h-5 w-5 text-destructive" /></Button>
                </div>
                <div className="grid grid-cols-2 gap-8 items-center">
                  <div>
                    <Label htmlFor={`make-${block.id}`} className="block mb-2 text-base font-medium">Nombre del Make</Label>
                    <Input id={`make-${block.id}`} name="make" value={block.make} onChange={e => handleMakeBlockChange(idx, e)} className="w-full" placeholder="Ej: Toyota" />
                  </div>
                  <div>
                    <Label htmlFor={`makeAlt-${block.id}`} className="block mb-2 text-base font-medium">Nombre alternativo</Label>
                    <Input id={`makeAlt-${block.id}`} name="makeAlt" value={block.makeAlt} onChange={e => handleMakeBlockChange(idx, e)} className="w-full" placeholder="Ej: ToYoTa" />
                  </div>
                </div>
              </div>
            ))}
            {/* Model blocks */}
            {modelBlocks.map((block, idx) => (
              <div key={block.id} className="bg-background border rounded-lg p-4 mb-4 flex flex-col gap-4 relative">
                <div className="absolute right-4 top-4 flex gap-2">
                  <Button type="button" variant="ghost" size="icon" onClick={() => cloneBlock(modelBlocks, setModelBlocks, idx)}><Copy className="h-5 w-5 text-primary" /></Button>
                  <Button type="button" variant="ghost" size="icon" onClick={() => deleteBlock(modelBlocks, setModelBlocks, idx)}><Trash className="h-5 w-5 text-destructive" /></Button>
                </div>
                <div className="grid grid-cols-3 gap-8 items-center">
                  <div>
                    <Label className="block mb-2 text-base font-medium">Make</Label>
                    <Input name="make" value={block.make} onChange={e => handleModelBlockChange(idx, e)} className="w-full" placeholder="Ej: Toyota" />
                  </div>
                  <div>
                    <Label className="block mb-2 text-base font-medium">Model</Label>
                    <Input name="model" value={block.model} onChange={e => handleModelBlockChange(idx, e)} className="w-full" placeholder="Ej: Corolla" />
                  </div>
                  <div>
                    <Label className="block mb-2 text-base font-medium">Model Alt.</Label>
                    <Input name="modelAlt" value={block.modelAlt} onChange={e => handleModelBlockChange(idx, e)} className="w-full" placeholder="Ej: CoroLLa" />
                  </div>
                </div>
              </div>
            ))}
            {/* Trim blocks */}
            {trimBlocks.map((block, idx) => {
              // Opciones de modelos para el make seleccionado en este bloque
              const modelOptions = block.make ? modelOptionsByMake[block.make] || [] : [];
              return (
                <div key={block.id} className="bg-background border rounded-lg p-4 mb-4 flex flex-col gap-4 relative">
                  <div className="absolute right-4 top-4 flex gap-2">
                    <Button type="button" variant="ghost" size="icon" onClick={() => cloneBlock(trimBlocks, setTrimBlocks, idx)}><Copy className="h-5 w-5 text-primary" /></Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => deleteBlock(trimBlocks, setTrimBlocks, idx)}><Trash className="h-5 w-5 text-destructive" /></Button>
                  </div>
                  <div className="grid grid-cols-4 gap-8 items-center">
                    <div>
                      <Label className="block mb-2 text-base font-medium">Make</Label>
                      <select
                        name="make"
                        value={block.make}
                        onChange={e => handleTrimBlockChange(idx, e)}
                        className="w-full text-base px-4 border rounded-md bg-white"
                      >
                        <option value="">-- Select make --</option>
                        {makeOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="block mb-2 text-base font-medium">Model</Label>
                      <select
                        name="model"
                        value={block.model}
                        onChange={e => handleTrimBlockChange(idx, e)}
                        className="w-full text-base px-4 border rounded-md bg-white"
                        disabled={!block.make}
                      >
                        <option value="">-- Select model --</option>
                        {modelOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="block mb-2 text-base font-medium">Trim</Label>
                      <Input name="trim" value={block.trim} onChange={e => handleTrimBlockChange(idx, e)} className="w-full" placeholder="Ej: LE" />
                    </div>
                    <div>
                      <Label className="block mb-2 text-base font-medium">Trim Alt.</Label>
                      <Input name="trimAlt" value={block.trimAlt} onChange={e => handleTrimBlockChange(idx, e)} className="w-full" placeholder="Ej: L-E" />
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="flex justify-end pt-4">
              <Button type="submit" className="px-10 text-base bg-primary text-primary-foreground">Submit</Button>
            </div>
          </form>
        </div>

        {/* Tabla de Makes */}
        <div className="bg-muted/40 border border-border rounded-lg p-4 mt-8">
          <div className="flex items-center gap-2 mb-2">
            <Plus className="w-5 h-5 text-primary" />
            <h5 className="font-semibold text-primary text-lg">Make</h5>
          </div>
          <table className="w-full text-sm bg-background border rounded-md">
            <thead>
              <tr className="bg-muted text-foreground">
                <th className="px-4 py-2 text-left">Make</th>
                <th className="px-4 py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {makeTable.map((el, idx) => (
                <tr key={el.id} className="border-b border-border hover:bg-muted/60">
                  <td className="px-4 py-2 font-medium">{el.make}</td>
                  <td className="px-4 py-2 flex gap-2 justify-end">
                    <Button variant="ghost" size="icon"><Edit className="h-5 w-5 text-primary" /></Button>
                    <Button variant="ghost" size="icon"><Trash className="h-5 w-5 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
} 