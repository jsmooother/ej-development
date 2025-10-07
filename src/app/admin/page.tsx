"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store credentials in sessionStorage (simple approach)
    const credentials = btoa(`${username}:${password}`);
    sessionStorage.setItem("admin_auth", credentials);
    
    // Redirect to dashboard
    router.push("/admin/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-light tracking-[0.1em] text-[#1a1a1a]">
          Admin Login
        </h1>
        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#1a1a1a]">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded border border-black/20 bg-white px-4 py-2 text-[#1a1a1a] focus:border-[#c4a676] focus:outline-none focus:ring-1 focus:ring-[#c4a676]"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[#1a1a1a]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-black/20 bg-white px-4 py-2 text-[#1a1a1a] focus:border-[#c4a676] focus:outline-none focus:ring-1 focus:ring-[#c4a676]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-[#1a1a1a] px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#c4a676]"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-[#1a1a1a]/50">
          Default: admin / admin123
        </p>
      </div>
    </div>
  );
}

