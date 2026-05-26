export async function downloadCardAsPDF(cardElement, name) {
  const { default: html2canvas } = await import('html2canvas')
  const { jsPDF } = await import('jspdf')

  const canvas = await html2canvas(cardElement, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a6' })

  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()
  const canvasRatio = canvas.height / canvas.width
  const imgHeight = pdfWidth * canvasRatio

  const yOffset = imgHeight < pdfHeight ? (pdfHeight - imgHeight) / 2 : 0

  pdf.addImage(imgData, 'PNG', 0, yOffset, pdfWidth, Math.min(imgHeight, pdfHeight))
  pdf.save(`${name.replace(/\s+/g, '_')}_BusinessCard.pdf`)
}

export async function downloadCardAsImage(cardElement, name) {
  const { default: html2canvas } = await import('html2canvas')

  const canvas = await html2canvas(cardElement, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
  })

  const url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = `${name.replace(/\s+/g, '_')}_BusinessCard.png`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
