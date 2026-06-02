import React from 'react'

interface ToastProps {
  title?: string
  description?: string
  open: boolean
  onClose: () => void
}

export const Toast: React.FC<ToastProps> = ({ title, description, open, onClose }) => {
  React.useEffect(() => {
    if (!open) return
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed right-4 top-6 z-50">
      <div className="max-w-sm w-full bg-green-600 shadow-lg rounded-lg border border-green-700 text-white">
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-1">
              <p className="font-semibold">{title || 'Success'}</p>
              {description && <p className="text-sm mt-1 opacity-90">{description}</p>}
            </div>
            <button onClick={onClose} className="ml-4 text-white hover:opacity-90">✕</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Toast
