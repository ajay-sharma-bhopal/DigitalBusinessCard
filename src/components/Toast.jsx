import { useState, useEffect, useCallback } from 'react'

let toastTimeout = null

export function useToast() {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimeout) clearTimeout(toastTimeout)
    setToast({ message, type, id: Date.now() })
    toastTimeout = setTimeout(() => setToast(null), 3000)
  }, [])

  return { toast, showToast }
}

export function Toast({ toast }) {
  if (!toast) return null

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  }

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  }

  return (
    <div
      key={toast.id}
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-white shadow-xl text-sm font-medium toast-enter ${colors[toast.type] || colors.info}`}
      style={{ maxWidth: '280px' }}
    >
      <span className="text-base">{icons[toast.type] || icons.info}</span>
      <span>{toast.message}</span>
    </div>
  )
}
