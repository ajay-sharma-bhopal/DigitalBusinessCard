import { copyToClipboard } from '../utils/share'

function ContactRow({ icon, label, value, href, onCopy }) {
  function handleClick() {
    if (href) {
      window.open(href, href.startsWith('http') ? '_blank' : '_self')
    } else if (onCopy) {
      onCopy(value)
    }
  }

  return (
    <button
      onClick={handleClick}
      className="contact-row w-full text-left group"
      aria-label={`${label}: ${value}`}
    >
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-white/80 group-hover:text-white transition-colors"
           style={{ background: 'rgba(255,255,255,0.1)' }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white/50 text-xs font-medium uppercase tracking-wider">{label}</p>
        <p className="text-white text-sm font-medium truncate">{value}</p>
      </div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
           className="w-4 h-4 text-white/30 group-hover:text-white/60 flex-shrink-0 transition-colors">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  )
}

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.42 8.8 19.79 19.79 0 01.36 3a2 2 0 012-2.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.29 6.29l1.52-1.52a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
)

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

const WebIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
  </svg>
)

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

export function ContactInfo({ data, onToast }) {
  async function handleCopy(value) {
    try {
      await copyToClipboard(value)
      onToast('Copied to clipboard!', 'success')
    } catch {
      onToast('Failed to copy', 'error')
    }
  }

  const addressStr = data.address
    ? `${data.address.street}, ${data.address.city}, ${data.address.state} ${data.address.zip}`
    : null

  const mapsUrl = addressStr
    ? `https://maps.google.com/?q=${encodeURIComponent(addressStr)}`
    : null

  return (
    <div className="space-y-1">
      <ContactRow
        icon={<EmailIcon />}
        label="Email"
        value={data.email}
        href={`mailto:${data.email}`}
      />
      <ContactRow
        icon={<PhoneIcon />}
        label="Phone"
        value={data.phone}
        href={`tel:${data.phone.replace(/\s/g, '')}`}
      />
      {data.mobile && data.mobile !== data.phone && (
        <ContactRow
          icon={<PhoneIcon />}
          label="Mobile"
          value={data.mobile}
          href={`tel:${data.mobile.replace(/\s/g, '')}`}
        />
      )}
      {data.website && (
        <ContactRow
          icon={<WebIcon />}
          label="Website"
          value={data.website.replace(/^https?:\/\//, '')}
          href={data.website}
        />
      )}
      {addressStr && (
        <ContactRow
          icon={<LocationIcon />}
          label="Address"
          value={addressStr}
          href={mapsUrl}
        />
      )}
      {data.social?.calendly && (
        <ContactRow
          icon={<CalendarIcon />}
          label="Schedule Meeting"
          value="Book a time with me"
          href={data.social.calendly}
        />
      )}
    </div>
  )
}
