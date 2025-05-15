"use client";

import DashboardLayout from "@/components/ui/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash, Search, FileText, Copy as CopyIcon, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { format } from "date-fns";
import clsx from "clsx";
import Link from "next/link";

// Example data - replace with actual data from your backend
const initialLibraries = [
  {
    id: 1,
    name: "Default Library",
    description: "Main library",
    campaigns: 1,
    creationDate: new Date("2020-08-14T05:08:00"),
    updateDate: new Date("2022-07-18T07:07:00"),
    subscribed: false,
  },
];

export default function EditLibrariesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState<any>(null);
  const [libraries, setLibraries] = useState(initialLibraries);
  // Form state
  const [form, setForm] = useState({
    name: "",
    copyFromMaster: false,
    subscribed: false,
    file: null as File | null,
  });
  const [fileHover, setFileHover] = useState(false);
  const [fileFocus, setFileFocus] = useState(false);

  const handleOpenForm = () => {
    setShowForm((prev) => !prev);
    setForm({ name: "", copyFromMaster: false, subscribed: false, file: null });
    setSelectedLibrary(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value, files } = e.target;
    if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked }));
    } else if (type === "file") {
      setForm((f) => ({ ...f, file: files ? files[0] : null }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleDownloadTemplate = () => {
    alert("Download template (simulado)");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLibraries((libs) => [
      ...libs,
      {
        id: libs.length + 1,
        name: form.name,
        description: "",
        campaigns: 0,
        creationDate: new Date(),
        updateDate: new Date(),
        subscribed: form.subscribed,
      },
    ]);
    setShowForm(false);
  };

  const handleSubscribedToggle = (id: number) => {
    setLibraries(libs => libs.map(lib => lib.id === id ? { ...lib, subscribed: !lib.subscribed } : lib));
  };

  const handleExport = (library: any) => {
    alert(`Export library: ${library.name}`);
  };

  const handleClone = (library: any) => {
    alert(`Clone library: ${library.name}`);
  };

  const handleDeleteLibrary = (library: any) => {
    if (confirm(`Are you sure you want to delete ${library.name}?`)) {
      setLibraries(libs => libs.filter(lib => lib.id !== library.id));
    }
  };

  const filteredLibraries = libraries.filter(library =>
    library.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    library.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="w-full flex justify-center bg-background min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-7xl px-4 sm:px-8 pt-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Libraries</h1>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleOpenForm}
            >
              Create new library
            </Button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search libraries..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-card rounded-xl shadow border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Creation Date</TableHead>
                  <TableHead>Update Date</TableHead>
                  <TableHead>Subscribed</TableHead>
                  <TableHead>Export</TableHead>
                  <TableHead>Clone</TableHead>
                  <TableHead>Edit</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLibraries.map((library) => (
                  <TableRow key={library.id} className="hover:bg-muted/60">
                    <TableCell>
                      <Link
                        href={`/dashboard/campaigns/edit-libraries/${library.id}`}
                        className="text-primary underline hover:text-orange-600 font-medium"
                      >
                        {library.name}
                      </Link>
                    </TableCell>
                    <TableCell>{format(library.creationDate, "MM/dd/yyyy hh:mm a")}</TableCell>
                    <TableCell>{format(library.updateDate, "MM/dd/yyyy hh:mm a")}</TableCell>
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        checked={library.subscribed}
                        onChange={() => handleSubscribedToggle(library.id)}
                        className="accent-[#FAAE3A] w-4 h-4"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" onClick={() => handleExport(library)}>
                        <FileText className="h-5 w-5 text-primary" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" onClick={() => handleClone(library)}>
                        <CopyIcon className="h-5 w-5 text-primary" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link href={`/dashboard/campaigns/edit-libraries/${library.id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-5 w-5 text-primary" />
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteLibrary(library)}>
                        <Trash className="h-5 w-5 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 text-sm text-muted-foreground">
              Showing {filteredLibraries.length} of {libraries.length} entries
            </div>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl mt-8 p-8 flex flex-col gap-6 shadow">
              <h2 className="text-lg font-semibold text-primary mb-2">Create new library</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <Label htmlFor="name">New Library Name</Label>
                <Input id="name" name="name" value={form.name} onChange={handleFormChange} required className="w-full" />

                <Label htmlFor="copyFromMaster">Copy From Hoot Master Library</Label>
                <input
                  id="copyFromMaster"
                  name="copyFromMaster"
                  type="checkbox"
                  checked={form.copyFromMaster}
                  onChange={handleFormChange}
                  className="accent-[#FAAE3A] w-4 h-4"
                />

                <Label htmlFor="subscribed">Subscribed</Label>
                <input
                  id="subscribed"
                  name="subscribed"
                  type="checkbox"
                  checked={form.subscribed}
                  onChange={handleFormChange}
                  className="accent-[#FAAE3A] w-4 h-4"
                />

                <Label>Download Template</Label>
                <Button type="button" variant="ghost" onClick={handleDownloadTemplate} className="text-primary flex items-center gap-2">
                  <Download className="w-6 h-6" />
                  Download
                </Button>

                <Label htmlFor="file">Content (.xlsx, .csv or .ods)</Label>
                <div
                  className={clsx(
                    "flex items-center border rounded-md transition-colors w-full",
                    (fileHover || fileFocus)
                      ? "border-[#FAAE3A] shadow-md bg-[#FFFBEA]"
                      : "border-border bg-background"
                  )}
                  onMouseEnter={() => setFileHover(true)}
                  onMouseLeave={() => setFileHover(false)}
                  onFocus={() => setFileFocus(true)}
                  onBlur={() => setFileFocus(false)}
                  tabIndex={-1}
                >
                  <label
                    htmlFor="file"
                    className="px-4 py-2 cursor-pointer bg-[#FAAE3A] text-[#404042] font-medium rounded-l-md hover:bg-[#F17625] transition-colors"
                  >
                    {form.file ? "Cambiar archivo" : "Cargar archivo"}
                  </label>
                  <input
                    id="file"
                    name="file"
                    type="file"
                    accept=".xlsx,.csv,.ods"
                    onChange={handleFormChange}
                    className="hidden"
                  />
                  <span className="px-4 py-2 truncate text-sm text-foreground">
                    {form.file ? form.file.name : "Ningún archivo seleccionado"}
                  </span>
                </div>
              </div>
              <div>
                <Button type="submit" className="bg-primary text-primary-foreground px-6">Submit</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 