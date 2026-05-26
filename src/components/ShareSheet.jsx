import { useState } from 'react'
import { getShareLinks, copyToClipboard, nativeShare, shareViaFile, nfcShare } from '../utils/share'
import { downloadVCard } from '../utils/vcard'

const SHARE_OPTIONS = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    color: '#25D366',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    color: '#0A66C2',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    id: 'twitter',
    label: 'Twitter/X',
    color: '#000000',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    id: 'telegram',
    label: 'Telegram',
    color: '#229ED9',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  },
  {
    id: 'email',
    label: 'Email',
    color: '#EA4335',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    id: 'sms',
    label: 'SMS',
    color: '#5856D6',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    id: 'facebook',
    label: 'Facebook',
    color: '#1877F2',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    id: 'line',
    label: 'LINE',
    color: '#00B900',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
      </svg>
    ),
  },
]

export function ShareSheet({ data, onShowQR, onToast }) {
  const [copied, setCopied] = useState(false)
  const [nfcActive, setNfcActive] = useState(false)
  const links = getShareLinks(data)

  async function handleNativeShare() {
    const success = await nativeShare(data)
    if (!success) onToast('Native sharing not available on this device', 'info')
  }

  async function handleCopy() {
    try {
      await copyToClipboard(data.cardUrl)
      setCopied(true)
      onToast('Link copied to clipboard!', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      onToast('Failed to copy link', 'error')
    }
  }

  function handleVCard() {
    downloadVCard(data)
    onToast('Contact saved to vCard', 'success')
  }

  async function handleNFC() {
    setNfcActive(true)
    const result = await nfcShare(data)
    setNfcActive(false)
    if (!result.supported) {
      onToast('NFC not supported on this device', 'info')
    } else if (result.success) {
      onToast('NFC tag written!', 'success')
    } else {
      onToast(`NFC failed: ${result.error}`, 'error')
    }
  }

  async function handleShareViaFile() {
    const success = await shareViaFile(data)
    if (!success) {
      handleVCard()
    }
  }

  return (
    <div className="space-y-5">
      {/* Primary Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleNativeShare}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-medium text-sm transition-all hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #3b5bdb, #7c3aed)' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          Share Card
        </button>

        <button
          onClick={onShowQR}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-medium text-sm transition-all hover:opacity-90 active:scale-95 glass"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <rect x="3" y="3" width="5" height="5"/><rect x="16" y="3" width="5" height="5"/>
            <rect x="3" y="16" width="5" height="5"/><path d="M21 16h-3a2 2 0 00-2 2v3"/>
            <path d="M21 21v.01"/><path d="M12 7v3a2 2 0 01-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/>
            <path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>
          </svg>
          QR Code
        </button>

        <button
          onClick={handleShareViaFile}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-medium text-sm transition-all hover:opacity-90 active:scale-95 glass"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
          </svg>
          Save Contact
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-medium text-sm transition-all hover:opacity-90 active:scale-95 glass"
        >
          {copied ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
              Copy Link
            </>
          )}
        </button>
      </div>

      {/* NFC Button */}
      {'NDEFReader' in window && (
        <button
          onClick={handleNFC}
          disabled={nfcActive}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-medium text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
          style={{ background: nfcActive ? '#555' : 'linear-gradient(135deg, #e6b800, #f5c842)' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M6 12a6 6 0 0012 0"/><path d="M3 12a9 9 0 0018 0"/>
            <path d="M9 12a3 3 0 006 0"/><circle cx="12" cy="12" r="1"/>
          </svg>
          {nfcActive ? 'Writing NFC...' : 'Tap to Share via NFC'}
        </button>
      )}

      {/* Social Grid */}
      <div>
        <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-3">Share via</p>
        <div className="grid grid-cols-4 gap-3">
          {SHARE_OPTIONS.map(opt => (
            <a
              key={opt.id}
              href={links[opt.id]}
              target={opt.id !== 'email' && opt.id !== 'sms' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="share-btn group"
              aria-label={`Share via ${opt.label}`}
            >
              <div
                className="share-btn-icon shadow-lg group-hover:shadow-xl transition-shadow"
                style={{ backgroundColor: opt.color }}
              >
                {opt.icon}
              </div>
              <span className="text-white/70 text-xs font-medium">{opt.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
