"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    if (email && password) {
      setIsTransitioning(true);
      // Esperamos a que termine la animación antes de redirigir
      setTimeout(() => {
        router.push("/dashboard/advertisers");
      }, 800); // Duración de la animación
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 font-sans relative overflow-hidden">
      {/* Fondo con patrón */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/fondo-lineas.png')] bg-center bg-cover opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#FAAE3A]/10 to-[#F17625]/10" />
      </div>

      <div className={`w-full max-w-md px-4 z-10 ${isTransitioning ? 'animate-login-exit' : 'animate-fade-in'}`}>
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]">
          {/* Header con gradiente y logo */}
          <div className="bg-gradient-to-br from-[#FAAE3A] to-[#F17625] w-full flex flex-col items-center justify-center p-8 rounded-t-2xl">
            <div className="bg-white p-4 rounded-full shadow-lg mb-4 transform transition-all duration-300 hover:scale-110 hover:rotate-3">
              <Image
                src="/logo.png"
                alt="Fountain Forward Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-black text-white transform transition-all duration-300 hover:scale-105">Welcome Back</h1>
          </div>

          {/* Formulario */}
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full transition-all duration-300 focus:scale-[1.02] focus:border-[#FAAE3A] focus:ring-2 focus:ring-[#FAAE3A]/20"
              />
              
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 transition-all duration-300 focus:scale-[1.02] focus:border-[#FAAE3A] focus:ring-2 focus:ring-[#FAAE3A]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-[#FAAE3A] to-[#F17625] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!email || !password}
            >
              Sign In
            </Button>

            <div className="text-center">
              <a href="#" className="text-sm text-[#404042] hover:text-[#FAAE3A] transition-colors duration-300">
                Forgot your password?
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}