import { generateVCard } from './vcard'

export async function nativeShare(data) {
  if (!navigator.share) return false

  try {
    await navigator.share({
      title: `${data.name} — ${data.title}`,
      text: `Connect with ${data.name}, ${data.title} at ${data.company}`,
      url: data.cardUrl,
    })
    return true
  } catch (err) {
    if (err.name !== 'AbortError') console.error('Share failed:', err)
    return false
  }
}

export async function shareViaFile(data) {
  if (!navigator.canShare) return false

  try {
    const vcardStr = generateVCard(data)
    const file = new File([vcardStr], `${data.name.replace(/\s+/g, '_')}.vcf`, { type: 'text/vcard' })
    if (navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: data.name })
      return true
    }
  } catch (err) {
    if (err.name !== 'AbortError') console.error('File share failed:', err)
  }
  return false
}

export function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  }
  // Fallback
  const el = document.createElement('textarea')
  el.value = text
  el.style.position = 'absolute'
  el.style.left = '-9999px'
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
  return Promise.resolve()
}

export function getShareLinks(data) {
  const url = encodeURIComponent(data.cardUrl)
  const text = encodeURIComponent(`Connect with ${data.name}, ${data.title} at ${data.company}: `)
  const emailSubject = encodeURIComponent(`${data.name}'s Business Card`)
  const emailBody = encodeURIComponent(
    `Hi,\n\nI'd like to share my digital business card with you.\n\n${data.name}\n${data.title}\n${data.company}\n\n${data.cardUrl}`
  )
  const smsBody = encodeURIComponent(`${data.name} | ${data.title} — ${data.cardUrl}`)

  return {
    whatsapp: `https://wa.me/?text=${text}${url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    telegram: `https://t.me/share/url?url=${url}&text=${text}`,
    email: `mailto:?subject=${emailSubject}&body=${emailBody}`,
    sms: `sms:?body=${smsBody}`,
    line: `https://line.me/R/msg/text/?${text}${url}`,
    wechat: data.cardUrl, // WeChat requires QR scan
  }
}

export async function nfcShare(data) {
  if (!('NDEFReader' in window)) return { supported: false }

  try {
    const ndef = new window.NDEFReader()
    await ndef.write({
      records: [
        { recordType: 'url', data: data.cardUrl },
        { recordType: 'text', data: `${data.name} — ${data.title} @ ${data.company}` },
      ],
    })
    return { supported: true, success: true }
  } catch (err) {
    return { supported: true, success: false, error: err.message }
  }
}
