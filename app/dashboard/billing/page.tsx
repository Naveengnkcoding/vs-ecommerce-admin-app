'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Download, Printer } from 'lucide-react'
import { BillData, downloadBillPDF, parseWhatsAppBillMessage, printBillPDF } from '@/lib/pdfGenerator'

function formatCurrency(amount: number) {
  return `₹${amount.toFixed(2)}`
}

export default function BillingPage() {
  const [message, setMessage] = useState('')
  const [billData, setBillData] = useState<BillData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleParse = () => {
    if (!message.trim()) {
      setError('Paste the WhatsApp order message into the editor.')
      setBillData(null)
      return
    }

    try {
      const parsed = parseWhatsAppBillMessage(message)
      setBillData(parsed)
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Failed to parse the message. Please verify the WhatsApp order format.')
      setBillData(null)
    }
  }

  const handleDownload = () => {
    if (billData) downloadBillPDF(billData)
  }

  const handlePrint = () => {
    if (billData) printBillPDF(billData)
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Billing Print & PDF</h1>
          <p className="text-gray-600 max-w-2xl">
            Paste the WhatsApp order text below, parse it into a formatted bill, and generate a half A4 (A5) PDF for print or download.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-sky-600 text-white rounded-t-lg">
            <CardTitle>Paste WhatsApp Message</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp Order Text</label>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={`🛒 *Vellore Santhai - New Order* - 22M1631

👤 *Customer Details:*
Name: Bsbdb
Phone: 4356959
Address: Shhdbdb

📦 *Order Details:*
• Small Onion (500 g) x 1 = ₹80.00
• Curd (400 g) x 1 = ₹25.00
• Tomato (1 kg) x 1 = ₹30.00
• Butter (100 g) x 1 = ₹55.00
• Coriander (100 g) x 1 = ₹15.00
• Fish (500 g) x 1 = ₹150.00
• Paneer (200 g) x 1 = ₹90.00
• Drumstick (250 g) x 1 = ₹30.00

💰 *Total Amount: ₹475.00*

Thank you! 🙏`}
                className="w-full min-h-[340px] p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-3 justify-end">
              <Button variant="outline" onClick={() => {
                setMessage('')
                setBillData(null)
                setError(null)
              }} className="h-11">
                Clear
              </Button>
              <Button onClick={handleParse} className="h-11 bg-blue-600 hover:bg-blue-700">
                Parse Message
              </Button>
            </div>

            {error && (
              <Alert variant="destructive" className="mt-6 border-0 shadow-md">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle>Preview & Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {!billData ? (
              <div className="text-sm text-gray-600">
                Paste the WhatsApp message and click <strong>Parse Message</strong> to preview the bill here.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                  <div className="flex flex-wrap gap-4 text-sm text-slate-700">
                    <div>
                      <p className="font-semibold">Order No</p>
                      <p>{billData.orderNo}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Date</p>
                      <p>{billData.orderDate}</p>
                    </div>
                    {billData.customerName && (
                      <div>
                        <p className="font-semibold">Customer</p>
                        <p>{billData.customerName}</p>
                      </div>
                    )}
                    {billData.customerPhone && (
                      <div>
                        <p className="font-semibold">Phone</p>
                        <p>{billData.customerPhone}</p>
                      </div>
                    )}
                    {billData.customerAddress && (
                      <div className="min-w-full">
                        <p className="font-semibold">Address</p>
                        <p>{billData.customerAddress}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4 bg-white shadow-sm">
                  <h2 className="text-base font-semibold text-slate-900 mb-3">Items</h2>
                  <div className="space-y-3">
                    {billData.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-[1fr_auto_auto] gap-3 text-sm text-slate-700">
                        <div>{item.name}</div>
                        <div className="text-center">x{item.quantity}</div>
                        <div className="text-right font-semibold">{formatCurrency(item.price * item.quantity)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                  <p className="text-sm text-slate-600 mb-3">Total</p>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(billData.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}</p>
                </div>

                {billData.notes && (
                  <div className="rounded-2xl border border-slate-200 p-4 bg-white">
                    <p className="text-sm font-semibold text-slate-900 mb-2">Notes</p>
                    <p className="text-sm text-slate-700">{billData.notes}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-3 justify-end">
              <Button
                disabled={!billData}
                onClick={handlePrint}
                className="h-11 bg-emerald-600 hover:bg-emerald-700"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print PDF
              </Button>
              <Button
                disabled={!billData}
                onClick={handleDownload}
                className="h-11 bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
