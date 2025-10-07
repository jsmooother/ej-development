"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Property {
  id: string;
  size: string;
  rooms: string;
  image: string;
  location?: string;
  price?: string;
  description?: string;
  createdAt: string;
  published: boolean;
}

export default function PropertiesAdmin() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [form, setForm] = useState({
    size: "",
    rooms: "",
    image: "",
    location: "",
    price: "",
    description: "",
    published: true,
  });

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (!auth) {
      router.push("/admin");
      return;
    }
    fetchList();
  }, [router]);

  async function fetchList() {
    const res = await fetch("/api/properties");
    const data = await res.json();
    setProperties(data);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await fetch(`/api/properties/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    cancel();
    fetchList();
  }

  function edit(property: Property) {
    setEditing(property);
    setForm({
      size: property.size,
      rooms: property.rooms,
      image: property.image,
      location: property.location || "",
      price: property.price || "",
      description: property.description || "",
      published: property.published,
    });
    setShowForm(true);
  }

  async function remove(id: string) {
    if (!confirm("Delete property?")) return;
    await fetch(`/api/properties/${id}`, { method: "DELETE" });
    fetchList();
  }

  function cancel() {
    setEditing(null);
    setShowForm(false);
    setForm({ size: "", rooms: "", image: "", location: "", price: "", description: "", published: true });
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-[#1a1a1a]/70 hover:text-[#1a1a1a]">← Dashboard</Link>
            <h1 className="text-xl font-light tracking-[0.15em] text-[#1a1a1a]">Properties</h1>
          </div>
          <button onClick={() => setShowForm(true)} className="rounded bg-[#1a1a1a] px-4 py-2 text-xs uppercase tracking-[0.2em] text-white hover:bg-[#c4a676]">New Property</button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {showForm && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-light tracking-[0.1em] text-[#1a1a1a]">{editing ? "Edit Property" : "New Property"}</h2>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1a1a1a]">Size</label>
                  <input value={form.size} onChange={(e)=>setForm({ ...form, size: e.target.value })} className="w-full rounded border border-black/20 bg-white px-4 py-2 text-[#1a1a1a] focus:border-[#c4a676] focus:outline-none focus:ring-1 focus:ring-[#c4a676]" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1a1a1a]">Rooms</label>
                  <input value={form.rooms} onChange={(e)=>setForm({ ...form, rooms: e.target.value })} className="w-full rounded border border-black/20 bg-white px-4 py-2 text-[#1a1a1a] focus:border-[#c4a676] focus:outline-none focus:ring-1 focus:ring-[#c4a676]" required />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1a1a1a]">Image URL</label>
                  <input value={form.image} onChange={(e)=>setForm({ ...form, image: e.target.value })} className="w-full rounded border border-black/20 bg-white px-4 py-2 text-[#1a1a1a] focus:border-[#c4a676] focus:outline-none focus:ring-1 focus:ring-[#c4a676]" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1a1a1a]">Location</label>
                  <input value={form.location} onChange={(e)=>setForm({ ...form, location: e.target.value })} className="w-full rounded border border-black/20 bg-white px-4 py-2 text-[#1a1a1a] focus:border-[#c4a676] focus:outline-none focus:ring-1 focus:ring-[#c4a676]" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1a1a1a]">Price</label>
                  <input value={form.price} onChange={(e)=>setForm({ ...form, price: e.target.value })} className="w-full rounded border border-black/20 bg-white px-4 py-2 text-[#1a1a1a] focus:border-[#c4a676] focus:outline-none focus:ring-1 focus:ring-[#c4a676]" />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" id="published" checked={form.published} onChange={(e)=>setForm({ ...form, published: e.target.checked })} className="h-4 w-4 rounded border-black/20 text-[#c4a676] focus:ring-[#c4a676]" />
                  <label htmlFor="published" className="text-sm text-[#1a1a1a]">Published</label>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#1a1a1a]">Description</label>
                <textarea value={form.description} onChange={(e)=>setForm({ ...form, description: e.target.value })} rows={5} className="w-full rounded border border-black/20 bg-white px-4 py-2 text-[#1a1a1a] focus:border-[#c4a676] focus:outline-none focus:ring-1 focus:ring-[#c4a676]" />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="rounded bg-[#1a1a1a] px-6 py-2 text-sm uppercase tracking-[0.2em] text-white hover:bg-[#c4a676]">{editing ? "Update" : "Create"}</button>
                <button type="button" onClick={cancel} className="rounded border border-black/20 px-6 py-2 text-sm uppercase tracking-[0.2em] text-[#1a1a1a] hover:bg-black/5">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {properties.map((p)=> (
            <div key={p.id} className="flex items-center justify-between rounded-lg border border-black/10 bg-white p-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-24 overflow-hidden rounded bg-gray-100" />
                <div>
                  <h3 className="text-lg font-light text-[#1a1a1a]">{p.size} • {p.rooms}</h3>
                  <p className="text-sm text-[#1a1a1a]/70">{p.location ?? ""}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>edit(p)} className="rounded bg-[#1a1a1a] px-4 py-2 text-xs uppercase tracking-wider text-white hover:bg-[#c4a676]">Edit</button>
                <button onClick={()=>remove(p.id)} className="rounded border border-red-300 px-4 py-2 text-xs uppercase tracking-wider text-red-600 hover:bg-red-50">Delete</button>
              </div>
            </div>
          ))}
          {properties.length === 0 && (
            <p className="py-8 text-center text-[#1a1a1a]/50">No properties yet. Create your first one!</p>
          )}
        </div>
      </main>
    </div>
  );
}
