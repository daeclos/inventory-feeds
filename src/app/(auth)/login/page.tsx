"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (email && password) {
      router.push("/dashboard/advertisers");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white font-sans">
      <div className="flex w-full max-w-2xl shadow-lg rounded-2xl overflow-hidden">
        <div className="bg-[#FAAE3A] w-1/2 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Fountain Forward Logo"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>

        <div className="bg-white w-1/2 p-8 flex flex-col justify-center">
          <h1 className="text-2xl font-semibold text-[#404042] mb-1">Sign in</h1>
          <div className="w-10 h-1 bg-[#FAAE3A] mb-6 rounded" />
          <input
            className="border border-gray-300 rounded px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FAAE3A]"
            type="email"
            placeholder="Enter email."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border border-gray-300 rounded px-3 py-2 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-[#FAAE3A]"
            type="password"
            placeholder="Enter password."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="bg-[#404042] text-white py-2 rounded text-sm hover:bg-[#333]"
          >
            Login
          </button>
        </div>
      </div>
    </main>
  );
}