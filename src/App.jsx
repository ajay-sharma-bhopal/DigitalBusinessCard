import { useState, useRef, useEffect } from 'react'
import { cardData } from './data/cardData'
import { Avatar } from './components/Avatar'
import { ContactInfo } from './components/ContactInfo'
import { SocialLinks } from './components/SocialLinks'
import { ShareSheet } from './components/ShareSheet'
import { QRModal } from './components/QRModal'
import { Toast, useToast } from './components/Toast'
import { downloadVCard } from './utils/vcard'
import { downloadCardAsPDF, downloadCardAsImage } from './utils/pdf'

const TABS = [
  { id: 'card', label: 'Card' },
  { id: 'contact', label: 'Contact' },
  { id: 'share', label: 'Share' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('card')
  const [showQR, setShowQR] = useState(false)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  const cardRef = useRef(null)
  const { toast, showToast } = useToast()

  // Handle URL params for PWA shortcuts
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const action = params.get('action')
    if (action === 'share') setActiveTab('share')
    if (action === 'vcard') {
      downloadVCard(cardData)
      showToast('Contact downloaded!', 'success')
    }
  }, [])

  async function handleDownloadPDF() {
    if (!cardRef.current) return
    showToast('Generating PDF...', 'info')
    try {
      await downloadCardAsPDF(cardRef.current, cardData.name)
      showToast('PDF downloaded!', 'success')
    } catch {
      showToast('PDF generation failed', 'error')
    }
    setShowDownloadMenu(false)
  }

  async function handleDownloadImage() {
    if (!cardRef.current) return
    showToast('Generating image...', 'info')
    try {
      await downloadCardAsImage(cardRef.current, cardData.name)
      showToast('Image downloaded!', 'success')
    } catch {
      showToast('Image generation failed', 'error')
    }
    setShowDownloadMenu(false)
  }

  function handleDownloadVCard() {
    downloadVCard(cardData)
    showToast('Contact saved!', 'success')
    setShowDownloadMenu(false)
  }

  const mapsUrl = cardData.address
    ? `https://maps.google.com/?q=${encodeURIComponent(cardData.address.street + ' ' + cardData.address.city)}`
    : '#'

  return (
    <div className="min-h-screen card-gradient flex flex-col">
      <Toast toast={toast} />

      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-12 pb-4 sm:pt-14">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center glass">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
               className="w-4 h-4 text-white">
            <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
          </svg>
        </div>
        <span className="text-white/40 text-xs font-medium tracking-widest uppercase">Digital Card</span>
        <div className="relative">
          <button
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            className="w-8 h-8 rounded-lg flex items-center justify-center glass text-white transition-all hover:bg-white/20"
            aria-label="Download options"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>

          {showDownloadMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowDownloadMenu(false)} />
              <div className="absolute right-0 top-10 z-40 glass-dark rounded-xl overflow-hidden shadow-2xl min-w-[160px] animate-fade-in">
                {[
                  { label: 'Save Contact (.vcf)', action: handleDownloadVCard },
                  { label: 'Download PDF', action: handleDownloadPDF },
                  { label: 'Download Image', action: handleDownloadImage },
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="w-full text-left px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors border-b border-white/10 last:border-0"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Card Preview */}
      <div className="px-4 pb-6" ref={cardRef}>
        <div className="glass rounded-2xl p-6 text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <Avatar name={cardData.name} src={cardData.avatar} size="xl" />
          </div>

          <div className="space-y-1 mb-4">
            <h1 className="text-white text-2xl font-bold text-shadow tracking-tight">
              {cardData.name}
            </h1>
            <p className="gold-text text-sm font-semibold tracking-wide">{cardData.title}</p>
            <p className="text-white/70 text-sm">{cardData.company}</p>
            {cardData.department && (
              <p className="text-white/40 text-xs">{cardData.department}</p>
            )}
          </div>

          {cardData.tagline && (
            <p className="text-white/50 text-xs italic border-t border-white/10 pt-3 mt-3">
              &ldquo;{cardData.tagline}&rdquo;
            </p>
          )}

          <div className="mt-4">
            <SocialLinks social={cardData.social} />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex mx-4 mb-4 glass rounded-xl p-1">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-white/60 hover:text-white/90'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 px-4 pb-8" key={activeTab}>
        {activeTab === 'card' && (
          <div className="space-y-4 animate-slide-up">
            <div className="glass rounded-2xl p-4">
              <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-3">About</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                  <p className="text-white/80 text-sm">Available for meetings &amp; calls</p>
                </div>
                {cardData.address && (
                  <div className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                         className="w-4 h-4 text-white/40 flex-shrink-0">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    <p className="text-white/60 text-sm">{cardData.address.city}, {cardData.address.state}</p>
                  </div>
                )}
                {cardData.website && (
                  <div className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                         className="w-4 h-4 text-white/40 flex-shrink-0">
                      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                    </svg>
                    <a href={cardData.website} target="_blank" rel="noopener noreferrer"
                       className="text-blue-400 text-sm hover:text-blue-300 transition-colors truncate">
                      {cardData.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="glass rounded-2xl p-4">
              <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-3">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Call Now', href: `tel:${cardData.phone}`, emoji: '📞' },
                  { label: 'Send Email', href: `mailto:${cardData.email}`, emoji: '✉️' },
                  { label: 'Get Directions', href: mapsUrl, emoji: '🗺️' },
                  { label: 'Schedule Meeting', href: cardData.social?.calendly || '#', emoji: '📅' },
                ].map(action => (
                  <a
                    key={action.label}
                    href={action.href}
                    target={action.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 glass rounded-xl text-white text-sm font-medium hover:bg-white/10 transition-all active:scale-95"
                  >
                    <span>{action.emoji}</span>
                    <span className="text-xs">{action.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="glass rounded-2xl overflow-hidden animate-slide-up">
            <ContactInfo data={cardData} onToast={showToast} />
          </div>
        )}

        {activeTab === 'share' && (
          <div className="glass rounded-2xl p-4 animate-slide-up">
            <ShareSheet
              data={cardData}
              onShowQR={() => setShowQR(true)}
              onToast={showToast}
            />
          </div>
        )}
      </div>

      {/* QR Modal */}
      {showQR && (
        <QRModal
          url={cardData.cardUrl}
          name={cardData.name}
          onClose={() => setShowQR(false)}
        />
      )}

      {/* Footer */}
      <footer className="text-center py-4 px-4">
        <p className="text-white/20 text-xs">Digital Business Card PWA</p>
      </footer>
    </div>
  )
}
