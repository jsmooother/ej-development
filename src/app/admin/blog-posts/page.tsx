"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface BlogPost {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

export default function BlogPostsAdmin() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    excerpt: "",
    content: "",
    image: "",
    published: true,
  });

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (!auth) {
      router.push("/admin");
      return;
    }
    fetchPosts();
  }, [router]);

  const fetchPosts = async () => {
    const response = await fetch("/api/blog-posts");
    const data = await response.json();
    setPosts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPost) {
      await fetch(`/api/blog-posts/${editingPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } else {
      await fetch("/api/blog-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    }

    setFormData({ category: "", title: "", excerpt: "", content: "", image: "", published: true });
    setShowForm(false);
    setEditingPost(null);
    fetchPosts();
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      category: post.category,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content || "",
      image: post.image,
      published: post.published,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    await fetch(`/api/blog-posts/${id}`, {
      method: "DELETE",
    });
    fetchPosts();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPost(null);
    setFormData({ category: "", title: "", excerpt: "", content: "", image: "", published: true });
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="text-[#1a1a1a]/70 hover:text-[#1a1a1a]"
              >
                ← Dashboard
              </Link>
              <h1 className="text-xl font-light tracking-[0.15em] text-[#1a1a1a]">
                Blog Posts
              </h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="rounded bg-[#1a1a1a] px-4 py-2 text-xs uppercase tracking-[0.2em] text-white hover:bg-[#c4a676]"
            >
              New Post
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {showForm && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-light tracking-[0.1em] text-[#1a1a1a]">
              {editingPost ? "Edit Post" : "New Post"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1a1a1a]">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full rounded border border-black/20 bg-white px-4 py-2 text-[#1a1a1a] focus:border-[#c4a676] focus:outline-none focus:ring-1 focus:ring-[#c4a676]"
                    placeholder="DESIGN, LIFESTYLE, etc."
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1a1a1a]">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className="w-full rounded border border-black/20 bg-white px-4 py-2 text-[#1a1a1a] focus:border-[#c4a676] focus:outline-none focus:ring-1 focus:ring-[#c4a676]"
                    placeholder="https://..."
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#1a1a1a]">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full rounded border border-black/20 bg-white px-4 py-2 text-[#1a1a1a] focus:border-[#c4a676] focus:outline-none focus:ring-1 focus:ring-[#c4a676]"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#1a1a1a]">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  className="w-full rounded border border-black/20 bg-white px-4 py-2 text-[#1a1a1a] focus:border-[#c4a676] focus:outline-none focus:ring-1 focus:ring-[#c4a676]"
                  rows={2}
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#1a1a1a]">
                  Content (Optional)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full rounded border border-black/20 bg-white px-4 py-2 text-[#1a1a1a] focus:border-[#c4a676] focus:outline-none focus:ring-1 focus:ring-[#c4a676]"
                  rows={6}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData({ ...formData, published: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-black/20 text-[#c4a676] focus:ring-[#c4a676]"
                />
                <label htmlFor="published" className="text-sm text-[#1a1a1a]">
                  Published
                </label>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="rounded bg-[#1a1a1a] px-6 py-2 text-sm uppercase tracking-[0.2em] text-white hover:bg-[#c4a676]"
                >
                  {editingPost ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded border border-black/20 px-6 py-2 text-sm uppercase tracking-[0.2em] text-[#1a1a1a] hover:bg-black/5"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between rounded-lg border border-black/10 bg-white p-6"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="rounded bg-[#c4a676]/10 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-[#c4a676]">
                    {post.category}
                  </span>
                  {!post.published && (
                    <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                      Draft
                    </span>
                  )}
                </div>
                <h3 className="mt-2 text-lg font-light text-[#1a1a1a]">
                  {post.title}
                </h3>
                <p className="mt-1 text-sm text-[#1a1a1a]/70">{post.excerpt}</p>
                <p className="mt-2 text-xs text-[#1a1a1a]/50">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(post)}
                  className="rounded bg-[#1a1a1a] px-4 py-2 text-xs uppercase tracking-wider text-white hover:bg-[#c4a676]"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="rounded border border-red-300 px-4 py-2 text-xs uppercase tracking-wider text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <p className="py-8 text-center text-[#1a1a1a]/50">
              No blog posts yet. Create your first one!
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

