import { useEffect, useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

export function QRModal({ url, name, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  function downloadQR() {
    const canvas = ref.current?.querySelector('canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `${name.replace(/\s+/g, '_')}_QRCode.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl p-6 shadow-2xl animate-slide-up max-w-xs w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900 font-semibold text-lg">Scan QR Code</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div ref={ref} className="flex justify-center mb-4 qr-container">
          <QRCodeCanvas
            value={url}
            size={220}
            level="H"
            includeMargin
            bgColor="#ffffff"
            fgColor="#1a2b8f"
            imageSettings={{
              src: '',
              height: 0,
              width: 0,
              excavate: false,
            }}
          />
        </div>

        <p className="text-center text-gray-500 text-xs mb-4 break-all">{url}</p>

        <div className="flex gap-2">
          <button
            onClick={downloadQR}
            className="flex-1 bg-executive-800 text-white py-2.5 rounded-xl font-medium text-sm hover:bg-executive-700 transition-colors"
            style={{ backgroundColor: '#1a2b8f' }}
          >
            Download QR
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
