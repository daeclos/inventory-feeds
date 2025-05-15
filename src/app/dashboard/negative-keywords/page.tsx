"use client";
import { useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import Topbar from "@/components/ui/Topbar";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Copy as CopyIcon, FileDown, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface KeywordList {
  name: string;
  createdAt: string;
  updatedAt: string;
  keywords?: { keyword: string; match: string }[];
}

export default function NegativeKeywordsPage() {
  const [lists, setLists] = useState<KeywordList[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [success, setSuccess] = useState<string | false>(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [showDeleteIdx, setShowDeleteIdx] = useState<number | null>(null);
  const [showDeleteInEdit, setShowDeleteInEdit] = useState(false);
  const [editIdxForClone, setEditIdxForClone] = useState<number | null>(null);

  // Edit modal state
  const [editName, setEditName] = useState("");
  const [editKeywords, setEditKeywords] = useState<{ keyword: string; match: string }[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [newMatch, setNewMatch] = useState("Broad");

  const handleCreateClick = () => {
    setShowForm(true);
    setSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    const now = new Date().toLocaleString();
    setLists([...lists, { name: newListName, createdAt: now, updatedAt: now, keywords: [] }]);
    setShowForm(false);
    setNewListName("");
    setSuccess("created");
  };

  // Edit
  const handleEdit = (idx: number) => {
    setEditIdx(idx);
    setEditName(lists[idx].name);
    setEditKeywords(lists[idx].keywords || []);
    setNewKeyword("");
    setNewMatch("Broad");
  };
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editIdx === null) return;
    setLists(lists.map((l, i) =>
      i === editIdx
        ? { ...l, name: editName, keywords: editKeywords, updatedAt: new Date().toLocaleString() }
        : l
    ));
    setEditIdx(null);
    setSuccess("edited");
  };

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    setEditKeywords([...editKeywords, { keyword: newKeyword, match: newMatch }]);
    setNewKeyword("");
    setNewMatch("Broad");
  };

  const handleDeleteKeyword = (idx: number) => {
    setEditKeywords(editKeywords.filter((_, i) => i !== idx));
  };

  // Clone
  const handleClone = (idx: number) => {
    const now = new Date().toLocaleString();
    const base = lists[idx];
    let copyName = `${base.name} (Copy)`;
    let n = 2;
    while (lists.some(l => l.name === copyName)) {
      copyName = `${base.name} (Copy ${n++})`;
    }
    setLists([
      ...lists,
      { ...base, name: copyName, createdAt: now, updatedAt: now },
    ]);
    setSuccess("cloned");
  };

  // Clone from edit
  const handleCloneFromEdit = () => {
    if (editIdx === null) return;
    handleClone(editIdx);
    setSuccess("cloned");
  };

  // Export/Import simulation
  const handleExport = () => {
    alert("Export simulated (CSV download)");
  };

  const handleImport = () => {
    alert("Import simulated (CSV upload)");
  };

  // Delete
  const handleDelete = (idx: number) => setShowDeleteIdx(idx);
  const confirmDelete = () => {
    if (showDeleteIdx === null) return;
    setLists(lists.filter((_, i) => i !== showDeleteIdx));
    setShowDeleteIdx(null);
    setSuccess("deleted");
  };

  // Delete from edit
  const handleDeleteFromEdit = () => {
    setShowDeleteInEdit(true);
  };

  const confirmDeleteFromEdit = () => {
    if (editIdx === null) return;
    setLists(lists.filter((_, i) => i !== editIdx));
    setEditIdx(null);
    setShowDeleteInEdit(false);
    setSuccess("deleted");
  };

  return (
    <div className="flex min-h-screen bg-[#f7f7f9] font-geist">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar onAlertClick={() => {}} />
        <main className="max-w-7xl mx-auto px-4 py-8 w-full">
          {success === "created" && (
            <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded mb-4 animate-fade-in">
              Negative Keywords List successfully created.
            </div>
          )}
          {success === "cloned" && (
            <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded mb-4 animate-fade-in">
              Negative Keywords List successfully cloned.
            </div>
          )}
          {success === "deleted" && (
            <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded mb-4 animate-fade-in">
              Negative Keywords List successfully deleted.
            </div>
          )}
          {success === "edited" && (
            <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded mb-4 animate-fade-in">
              Negative Keywords List successfully edited.
            </div>
          )}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h1 className="text-2xl font-bold text-[#404042]">Negative Keywords Lists</h1>
            <Button onClick={handleCreateClick} className="ml-auto" variant="default">
              + Create New Keywords List
            </Button>
          </div>
          {showForm && (
            <div className="bg-white border border-[#FAAE3A]/30 rounded-lg p-4 mb-4 animate-fade-in">
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-center gap-4">
                <label className="font-medium text-[#404042] flex-1">
                  New Keywords List Name
                  <input
                    className="w-full border border-[#404042] rounded px-3 py-2 mt-1 focus:border-[#FAAE3A] focus:ring-[#FAAE3A]/30"
                    value={newListName}
                    onChange={e => setNewListName(e.target.value)}
                    required
                  />
                </label>
                <Button type="submit" variant="default">Submit</Button>
              </form>
            </div>
          )}
          {lists.length === 0 && !showForm && (
            <div className="bg-[#FFF3D1] border border-[#FAAE3A]/40 text-[#404042] px-4 py-3 rounded mb-4">
              There are no Negative Keywords Lists added yet.
            </div>
          )}
          {lists.length > 0 && !showForm && (
            <div className="bg-white border border-[#FAAE3A]/30 rounded-lg p-4 animate-fade-in">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#FFF3D1]">
                    <th className="px-4 py-2 text-[#404042]">Name</th>
                    <th className="px-4 py-2 text-[#404042]">Creation Date</th>
                    <th className="px-4 py-2 text-[#404042]">Update Date</th>
                    <th className="px-4 py-2 text-[#404042]">Clone</th>
                    <th className="px-4 py-2 text-[#404042]">Edit</th>
                    <th className="px-4 py-2 text-[#404042]">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {lists.map((list, idx) => (
                    <tr key={idx} className="border-b last:border-b-0 hover:bg-[#f7f7f9]">
                      <td className="px-4 py-2 text-[#2A6BE9] underline cursor-pointer">{list.name}</td>
                      <td className="px-4 py-2">{list.createdAt}</td>
                      <td className="px-4 py-2">{list.updatedAt}</td>
                      <td className="px-4 py-2 text-center">
                        <button title="Clone" className="cursor-pointer text-[#2A6BE9]" onClick={() => handleClone(idx)}>
                          <CopyIcon size={18} />
                        </button>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button title="Edit" className="cursor-pointer text-[#2A6BE9]" onClick={() => handleEdit(idx)}>
                          <Pencil size={18} />
                        </button>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button title="Delete" className="cursor-pointer text-[#F17625]" onClick={() => handleDelete(idx)}>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Edit Dialog */}
          <Dialog open={editIdx !== null} onOpenChange={open => !open && setEditIdx(null)}>
            <DialogContent>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>Edit Negative Keywords List{editName ? ` - ${editName}` : ""}</DialogTitle>
                  <div className="flex gap-2">
                    <Button type="button" variant="ghost" onClick={handleExport} title="Export">
                      <FileDown className="text-green-600" size={20} />
                    </Button>
                    <Button type="button" variant="ghost" onClick={handleImport} title="Import">
                      <Upload className="text-blue-500" size={20} />
                    </Button>
                    <Button type="button" variant="ghost" onClick={handleDeleteFromEdit} title="Delete">
                      <Trash2 className="text-red-500" size={20} />
                    </Button>
                    <Button type="button" variant="ghost" onClick={handleCloneFromEdit} title="Clone">
                      <CopyIcon className="text-[#2A6BE9]" size={20} />
                    </Button>
                  </div>
                </div>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                <label className="font-medium text-[#404042]">
                  Name
                  <input
                    className="w-full border border-[#404042] rounded px-3 py-2 mt-1 focus:border-[#FAAE3A] focus:ring-[#FAAE3A]/30"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    required
                  />
                </label>
                <div>
                  <div className="font-medium text-[#404042] mb-1">Keyword</div>
                  <table className="w-full mb-2">
                    <thead>
                      <tr>
                        <th className="text-left px-2 py-1 text-[#404042]">Keyword</th>
                        <th className="text-left px-2 py-1 text-[#404042]">Match Type</th>
                        <th className="text-center px-2 py-1 text-[#404042]">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editKeywords.length === 0 && (
                        <tr>
                          <td colSpan={3} className="bg-[#FFF3D1] text-[#404042] text-center px-2 py-2 rounded">No keywords have been added yet</td>
                        </tr>
                      )}
                      {editKeywords.map((kw, idx) => (
                        <tr key={idx}>
                          <td className="px-2 py-1">{kw.keyword}</td>
                          <td className="px-2 py-1">{kw.match}</td>
                          <td className="px-2 py-1 text-center">
                            <Button size="icon" variant="ghost" type="button" onClick={() => handleDeleteKeyword(idx)}>
                              <Trash2 className="text-red-500" size={18}/>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex gap-2 items-center">
                    <input
                      className="border border-[#404042] rounded px-3 py-2 focus:border-[#FAAE3A] focus:ring-[#FAAE3A]/30 flex-1"
                      value={newKeyword}
                      onChange={e => setNewKeyword(e.target.value)}
                      placeholder="Add keyword"
                    />
                    <select
                      className="border border-[#404042] rounded px-2 py-2 focus:border-[#FAAE3A] focus:ring-[#FAAE3A]/30"
                      value={newMatch}
                      onChange={e => setNewMatch(e.target.value)}
                    >
                      <option>Broad</option>
                      <option>Phrase</option>
                      <option>Exact</option>
                    </select>
                    <Button type="button" variant="outline" onClick={handleAddKeyword}>+</Button>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" variant="default">Submit</Button>
                </DialogFooter>
              </form>
            </DialogContent>
            {/* Delete Dialog from Edit */}
            <Dialog open={showDeleteInEdit} onOpenChange={open => !open && setShowDeleteInEdit(false)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                </DialogHeader>
                <div className="text-[#404042] mb-4">This will delete the selected keyword list permanently.</div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="destructive" onClick={() => setShowDeleteInEdit(false)}>Cancel</Button>
                  </DialogClose>
                  <Button type="button" variant="default" onClick={confirmDeleteFromEdit}>Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog open={showDeleteIdx !== null} onOpenChange={open => !open && setShowDeleteIdx(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
              </DialogHeader>
              <div className="text-[#404042] mb-4">This will delete the selected keyword list permanently.</div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="destructive">Cancel</Button>
                </DialogClose>
                <Button type="button" variant="default" onClick={confirmDelete}>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
} 