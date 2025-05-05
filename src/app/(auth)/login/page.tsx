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
    <main className="flex min-h-screen items-center justify-center bg-white font-sans relative">
      {/* Fondo con líneas */}
      <div className="absolute inset-0 z-0 bg-[url('/fondo-lineas.png')] bg-center bg-cover opacity-10" />

      <div className="relative z-10 w-full max-w-sm shadow-2xl rounded-2xl overflow-hidden">
        {/* Parte superior con gradiente y logo */}
        <div className="bg-gradient-to-b from-[#FAAE3A] to-[#F17625] w-full flex items-center justify-center p-6 rounded-t-2xl">
          <Image
            src="/logo.png"
            alt="Fountain Forward Logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>

        {/* Formulario */}
        <div className="bg-white w-full p-8 flex flex-col justify-center">
          <h1 className="text-3xl font-black text-[#404042] mb-1 text-center">Sign in</h1>
          <div className="w-10 h-1 bg-[#FAAE3A] mx-auto mb-6 rounded" />

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
            className="bg-[#404042] text-white py-2 rounded text-sm font-semibold transition-colors duration-200 hover:bg-[#FAAE3A] active:bg-[#F17625]"
          >
            Login
          </button>
        </div>
      </div>
    </main>
  );
}