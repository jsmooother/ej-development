"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface InstagramPost {
  id: string;
  caption: string;
  image: string;
  url: string;
  createdAt: string;
}

export default function InstagramAdmin() {
  const router = useRouter();
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    caption: "",
    image: "",
    url: "",
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
    const res = await fetch("/api/instagram");
    const data = await res.json();
    setPosts(data);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/instagram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    cancel();
    fetchList();
  }

  async function remove(id: string) {
    if (!confirm("Delete Instagram post?")) return;
    await fetch(`/api/instagram/${id}`, { method: "DELETE" });
    fetchList();
  }

  function cancel() {
    setShowForm(false);
    setForm({ caption: "", image: "", url: "" });
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-[#1a1a1a]/70 hover:text-[#1a1a1a]">← Dashboard</Link>
            <h1 className="text-xl font-light tracking-[0.15em] text-[#1a1a1a]">Instagram Posts</h1>
          </div>
          <button onClick={() => setShowForm(true)} className="rounded bg-[#1a1a1a] px-4 py-2 text-xs uppercase tracking-[0.2em] text-white hover:bg-[#c4a676]">New Post</button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {showForm && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-light tracking-[0.1em] text-[#1a1a1a]">New Instagram Post</h2>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#1a1a1a]">Image URL</label>
                <input value={form.image} onChange={(e)=>setForm({ ...form, image: e.target.value })} className="w-full rounded border border-black/20 bg-white px-4 py-2 text-[#1a1a1a] focus:border-[#c4a676] focus:outline-none focus:ring-1 focus:ring-[#c4a676]" placeholder="https://..." required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#1a1a1a]">Instagram URL</label>
                <input value={form.url} onChange={(e)=>setForm({ ...form, url: e.target.value })} className="w-full rounded border border-black/20 bg-white px-4 py-2 text-[#1a1a1a] focus:border-[#c4a676] focus:outline-none focus:ring-1 focus:ring-[#c4a676]" placeholder="https://instagram.com/p/..." required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#1a1a1a]">Caption</label>
                <textarea value={form.caption} onChange={(e)=>setForm({ ...form, caption: e.target.value })} rows={3} className="w-full rounded border border-black/20 bg-white px-4 py-2 text-[#1a1a1a] focus:border-[#c4a676] focus:outline-none focus:ring-1 focus:ring-[#c4a676]" required />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="rounded bg-[#1a1a1a] px-6 py-2 text-sm uppercase tracking-[0.2em] text-white hover:bg-[#c4a676]">Create</button>
                <button type="button" onClick={cancel} className="rounded border border-black/20 px-6 py-2 text-sm uppercase tracking-[0.2em] text-[#1a1a1a] hover:bg-black/5">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {posts.map((post)=> (
            <div key={post.id} className="group relative aspect-square overflow-hidden rounded-lg border border-black/10 bg-white">
              <div className="absolute inset-0 bg-gray-100" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-xs text-white line-clamp-2">{post.caption}</p>
                <button onClick={()=>remove(post.id)} className="mt-2 rounded bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600">Delete</button>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="col-span-full py-8 text-center text-[#1a1a1a]/50">No Instagram posts yet. Create your first one!</div>
          )}
        </div>
      </main>
    </div>
  );
}

