export interface BillData {
  orderNo: string
  orderDate: string
  customerName?: string
  customerPhone?: string
  customerAddress?: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  notes?: string
}

export function parseWhatsAppBillMessage(message: string): BillData {
  const normalized = message.replace(/\r\n/g, '\n').trim()
  const lines = normalized.split('\n').map((line) => line.trim()).filter(Boolean)

  const orderNoMatch = normalized.match(/-\s*([A-Za-z0-9-]+)/)
  const orderNo = orderNoMatch ? orderNoMatch[1] : `ORDER-${Date.now()}`

  const customerNameMatch = normalized.match(/Name:\s*(.+)/i)
  const customerPhoneMatch = normalized.match(/Phone:\s*(.+)/i)
  const customerAddressMatch = normalized.match(/Address:\s*(.+)/i)

  const itemLines = lines.filter((line) => /^•\s*/.test(line))
  const items = itemLines
    .map((line) => {
      const match = line.match(/^•\s*(.+?)\s*x\s*([\d.]+)\s*=\s*₹\s*([\d.,]+)/i)
      if (!match) return null
      return {
        name: match[1].trim(),
        quantity: parseFloat(match[2]),
        price: parseFloat(match[3].replace(/,/g, '')),
      }
    })
    .filter((item): item is { name: string; quantity: number; price: number } => Boolean(item))

  const totalMatch = normalized.match(/Total Amount:\s*₹\s*([\d.,]+)/i)
  const totalAmount = totalMatch ? parseFloat(totalMatch[1].replace(/,/g, '')) : undefined

  const notesIndex = lines.findIndex((line) => /Thank you/i.test(line) || /Total Amount:/i.test(line))
  const notes = notesIndex >= 0 ? lines.slice(notesIndex + 1).join(' ') : ''

  return {
    orderNo,
    orderDate: new Date().toLocaleDateString(),
    customerName: customerNameMatch?.[1].trim(),
    customerPhone: customerPhoneMatch?.[1].trim(),
    customerAddress: customerAddressMatch?.[1].trim(),
    items: items.length > 0
      ? items
      : [
          {
            name: 'Order items not parsed',
            quantity: 1,
            price: totalAmount ?? 0,
          },
        ],
    notes: notes || undefined,
  }
}

export function generateBillPDF(billData: BillData) {
  // Create HTML content for the bill
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Arial, sans-serif;
          color: #333;
          background: white;
        }
        .bill-container {
          width: 100%;
          max-width: 800px;
          padding: 20px;
          margin: 0 auto;
        }
        .bill-header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #10b981;
          padding-bottom: 15px;
        }
        .bill-header h1 {
          color: #10b981;
          font-size: 28px;
          margin-bottom: 5px;
        }
        .bill-header p {
          color: #666;
          font-size: 12px;
        }
        .bill-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          font-size: 13px;
        }
        .info-group {
          flex: 1;
        }
        .info-group label {
          color: #666;
          font-weight: bold;
          display: block;
          margin-bottom: 3px;
        }
        .info-group span {
          display: block;
          color: #333;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 13px;
        }
        table thead {
          background-color: #10b981;
          color: white;
        }
        table th {
          padding: 10px;
          text-align: left;
          font-weight: bold;
          border: 1px solid #ddd;
        }
        table td {
          padding: 10px;
          border: 1px solid #ddd;
        }
        table tr:nth-child(even) {
          background-color: #f9fafb;
        }
        .quantity {
          text-align: center;
        }
        .price {
          text-align: right;
        }
        .total-row {
          background-color: #f3f4f6;
          font-weight: bold;
        }
        .bill-footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 15px;
          border-top: 2px solid #10b981;
          font-size: 12px;
          color: #666;
        }
        .notes {
          margin-top: 15px;
          padding: 10px;
          background-color: #f9fafb;
          border-left: 3px solid #10b981;
          font-size: 12px;
        }
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .bill-container {
            padding: 10px;
            max-width: 100%;
          }
        }
      </style>
    </head>
    <body>
      <div class="bill-container">
        <div class="bill-header">
          <h1>VELLORE SANTHAI</h1>
          <p>Fresh Vegetables & Produce</p>
        </div>
        
        <div class="bill-info">
          <div class="info-group">
            <label>Order No:</label>
            <span>${billData.orderNo}</span>
          </div>
          <div class="info-group">
            <label>Date:</label>
            <span>${billData.orderDate}</span>
          </div>
          ${billData.customerName ? `
          <div class="info-group">
            <label>Customer:</label>
            <span>${billData.customerName}</span>
          </div>
          ` : ''}
          ${billData.customerPhone ? `
          <div class="info-group">
            <label>Phone:</label>
            <span>${billData.customerPhone}</span>
          </div>
          ` : ''}
          ${billData.customerAddress ? `
          <div class="info-group address-group">
            <label>Address:</label>
            <span>${billData.customerAddress}</span>
          </div>
          ` : ''}
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th class="quantity">Qty</th>
              <th class="price">Price</th>
              <th class="price">Total</th>
            </tr>
          </thead>
          <tbody>
            ${billData.items
              .map(
                (item) => `
              <tr>
                <td>${item.name}</td>
                <td class="quantity">${item.quantity}</td>
                <td class="price">₹${item.price.toFixed(2)}</td>
                <td class="price">₹${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            `
              )
              .join('')}
            <tr class="total-row">
              <td colspan="3">TOTAL AMOUNT:</td>
              <td class="price">₹${billData.items
                .reduce((sum, item) => sum + item.quantity * item.price, 0)
                .toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        ${billData.notes ? `<div class="notes"><strong>Notes:</strong> ${billData.notes}</div>` : ''}

        <div class="bill-footer">
          <p>Thank you for your purchase!</p>
          <p>For inquiries, contact: 9876543210</p>
        </div>
      </div>
    </body>
    </html>
  `

  return htmlContent
}

export function downloadBillPDF(billData: BillData) {
  const htmlContent = generateBillPDF(billData)
  const element = document.createElement('div')
  element.innerHTML = htmlContent

  const opt = {
    margin: 5,
    filename: `Bill-${billData.orderNo}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: [148, 210], orientation: 'portrait' }, // A5 size (half of A4)
  }

  // Dynamically import html2pdf to avoid SSR issues
  import('html2pdf.js').then((html2pdf) => {
    html2pdf.default().set(opt).from(element).save()
  })
}

export function printBillPDF(billData: BillData) {
  const htmlContent = generateBillPDF(billData)
  const printWindow = window.open('', '', 'height=600,width=800')

  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.print()
  }
}
