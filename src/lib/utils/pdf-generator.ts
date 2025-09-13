import jsPDF from 'jspdf'
import { Quote, QuoteItem } from '@/lib/types'

export function generateQuotePDF(quote: Quote, items: QuoteItem[], companyInfo: any) {
  const doc = new jsPDF()
  
  // Set up colors
  const primaryColor = '#2563eb'
  const secondaryColor = '#64748b'
  const lightGray = '#f8fafc'
  
  // Company Header
  doc.setFillColor(primaryColor)
  doc.rect(0, 0, 210, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text(companyInfo.name || 'Freightnaut', 20, 20)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(companyInfo.address || '123 Business St, City, State 12345', 20, 30)
  doc.text(`Phone: ${companyInfo.phone || '+1 (555) 123-4567'}`, 20, 35)
  
  // Quote Title
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('QUOTE', 150, 20)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Quote #: ${quote.id}`, 150, 30)
  doc.text(`Date: ${new Date(quote.createdAt).toLocaleDateString()}`, 150, 35)
  
  // Quote Details
  let yPosition = 60
  
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Quote Details', 20, yPosition)
  yPosition += 10
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Title: ${quote.title}`, 20, yPosition)
  yPosition += 8
  
  if (quote.description) {
    doc.text(`Description: ${quote.description}`, 20, yPosition)
    yPosition += 8
  }
  
  doc.text(`Status: ${quote.status.toUpperCase()}`, 20, yPosition)
  yPosition += 8
  
  if (quote.validUntil) {
    doc.text(`Valid Until: ${new Date(quote.validUntil).toLocaleDateString()}`, 20, yPosition)
    yPosition += 8
  }
  
  yPosition += 10
  
  // Items Table Header
  doc.setFillColor(lightGray)
  doc.rect(20, yPosition - 5, 170, 10, 'F')
  
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Item', 25, yPosition)
  doc.text('Description', 80, yPosition)
  doc.text('Qty', 130, yPosition)
  doc.text('Unit Price', 150, yPosition)
  doc.text('Total', 180, yPosition)
  
  yPosition += 15
  
  // Items
  doc.setFont('helvetica', 'normal')
  items.forEach((item, index) => {
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }
    
    doc.text(item.name, 25, yPosition)
    doc.text(item.description || '', 80, yPosition)
    doc.text(item.quantity.toString(), 130, yPosition)
    doc.text(`$${item.unitPrice.toFixed(2)}`, 150, yPosition)
    doc.text(`$${item.total.toFixed(2)}`, 180, yPosition)
    
    yPosition += 8
  })
  
  // Totals
  yPosition += 10
  doc.setFont('helvetica', 'bold')
  doc.text('Subtotal:', 150, yPosition)
  doc.text(`$${quote.subtotal.toFixed(2)}`, 180, yPosition)
  yPosition += 8
  
  if (quote.discountAmount > 0) {
    doc.text(`Discount (${quote.discountRate}%):`, 150, yPosition)
    doc.text(`-$${quote.discountAmount.toFixed(2)}`, 180, yPosition)
    yPosition += 8
  }
  
  if (quote.taxAmount > 0) {
    doc.text(`Tax (${quote.taxRate}%):`, 150, yPosition)
    doc.text(`$${quote.taxAmount.toFixed(2)}`, 180, yPosition)
    yPosition += 8
  }
  
  doc.setFontSize(14)
  doc.text('Total:', 150, yPosition)
  doc.text(`$${quote.total.toFixed(2)}`, 180, yPosition)
  
  // Footer
  yPosition = 280
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(secondaryColor)
  doc.text('Thank you for your business!', 20, yPosition)
  doc.text('For questions about this quote, please contact us at support@freightnaut.com', 20, yPosition + 8)
  
  return doc
}

export function downloadQuotePDF(quote: Quote, items: QuoteItem[], companyInfo: any) {
  const doc = generateQuotePDF(quote, items, companyInfo)
  doc.save(`quote-${quote.id}.pdf`)
}

export function previewQuotePDF(quote: Quote, items: QuoteItem[], companyInfo: any) {
  const doc = generateQuotePDF(quote, items, companyInfo)
  const pdfBlob = doc.output('blob')
  const pdfUrl = URL.createObjectURL(pdfBlob)
  window.open(pdfUrl, '_blank')
}
