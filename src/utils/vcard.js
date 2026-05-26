export function generateVCard(data) {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${data.name}`,
    `N:${data.name.split(' ').slice(1).join(' ')};${data.name.split(' ')[0]};;;`,
    `ORG:${data.company}`,
    `TITLE:${data.title}`,
    `EMAIL;TYPE=WORK:${data.email}`,
    `TEL;TYPE=WORK,VOICE:${data.phone}`,
  ]

  if (data.mobile && data.mobile !== data.phone) {
    lines.push(`TEL;TYPE=CELL:${data.mobile}`)
  }

  if (data.website) {
    lines.push(`URL:${data.website}`)
  }

  if (data.address) {
    const { street, city, state, zip, country } = data.address
    lines.push(`ADR;TYPE=WORK:;;${street};${city};${state};${zip};${country}`)
  }

  if (data.social?.linkedin) {
    lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${data.social.linkedin}`)
  }

  if (data.social?.twitter) {
    lines.push(`X-SOCIALPROFILE;TYPE=twitter:${data.social.twitter}`)
  }

  if (data.tagline) {
    lines.push(`NOTE:${data.tagline}`)
  }

  lines.push(`REV:${new Date().toISOString()}`)
  lines.push('END:VCARD')

  return lines.join('\r\n')
}

export function downloadVCard(data) {
  const vcardStr = generateVCard(data)
  const blob = new Blob([vcardStr], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${data.name.replace(/\s+/g, '_')}.vcf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
