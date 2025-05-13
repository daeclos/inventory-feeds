import * as React from "react"

// Simple toast context for shadcn/ui
export type Toast = {
  id: string
  title?: string
  description?: string
  duration?: number
  type?: "success" | "error" | "info" | "warning"
}

export type ToastContextType = {
  toasts: Toast[]
  toast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])
    setTimeout(() => removeToast(id), toast.duration || 3000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div key={t.id} className="bg-white border border-[#FAAE3A] shadow rounded px-4 py-2 animate-fade-in">
            <div className="font-bold text-[#404042]">{t.title}</div>
            {t.description && <div className="text-sm text-[#404042]">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within a ToastProvider")
  return ctx
} 