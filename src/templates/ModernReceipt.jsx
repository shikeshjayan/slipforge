import { formatCurrency, formatDate } from "../utils/formatting"
import { calcSubtotal, calcTax, calcTotal, calcLineTotal } from "../utils/calculations"

const printStyles = `
  @page { size: A4; margin: 12mm; }
  @media print {
    body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    .print-sheet { box-shadow: none !important; border: 1px solid #e2e8f0 !important; border-radius: 0 !important; }
    .wm-text { opacity: 0.06 !important; }
  }
`

const ModernReceipt = ({ form, items, receiptNo, date, logo }) => {
  const subtotal = calcSubtotal(items)
  const tax = calcTax(subtotal, form.taxRate)
  const total = calcTotal(subtotal, tax)
  const displayDate = date || formatDate()

  return (
    <>
      <style>{printStyles}</style>
      <div
        className="print-sheet relative bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 overflow-hidden"
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden px-4">
          <span
            className="wm-text text-[clamp(32px,5vw,96px)] font-black text-slate-700 whitespace-nowrap leading-none"
            style={{ opacity: 0.035, transform: "rotate(-30deg)", transformOrigin: "center center" }}
          >
            {receiptNo}
          </span>
        </div>

        <div className="print-only absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-emerald-500 to-indigo-500" />

        <div className="flex items-start justify-between mb-10">
          <div className="flex items-start gap-4">
            {logo && (
              <img
                src={logo}
                alt="Business logo"
                className="h-14 w-auto max-w-[140px] rounded-lg object-contain shrink-0"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{form.businessName || "Business Name"}</h2>
              <p className="text-sm text-slate-500 mt-1">Receipt</p>
              {form.address && <p className="text-xs text-slate-400 mt-1 max-w-xs">{form.address}</p>}
              <div className="flex flex-wrap gap-3 mt-1.5">
                {form.phone && <p className="text-xs text-slate-400">{form.phone}</p>}
                {form.email && <p className="text-xs text-slate-400">{form.email}</p>}
                {form.taxId && <p className="text-xs text-slate-400">Tax ID: {form.taxId}</p>}
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-slate-600 space-y-1 shrink-0">
            <p className="font-medium text-slate-800">{displayDate}</p>
            <p className="text-slate-500 font-mono text-xs">{receiptNo}</p>
          </div>
        </div>

        <div className="mb-10 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Billed to</p>
          <p className="text-sm font-medium text-slate-900">{form.clientName || "Client Name"}</p>
          {(form.clientWhatsapp || form.clientEmail) && (
            <div className="mt-2 space-y-0.5">
              {form.clientWhatsapp && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {form.clientWhatsapp}
                </p>
              )}
              {form.clientEmail && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {form.clientEmail}
                </p>
              )}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th className="text-left py-3 font-semibold text-slate-700">Description</th>
                <th className="text-right py-3 font-semibold text-slate-700">Qty</th>
                <th className="text-right py-3 font-semibold text-slate-700">Price</th>
                <th className="text-right py-3 font-semibold text-slate-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-3 text-slate-800">{item.description || `Item ${i + 1}`}</td>
                  <td className="py-3 text-right text-slate-600">{item.qty}</td>
                  <td className="py-3 text-right text-slate-600">{formatCurrency(item.price, form.currency)}</td>
                  <td className="py-3 text-right font-medium text-slate-800">
                    {formatCurrency(calcLineTotal(item), form.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="w-full max-w-xs sm:max-w-none sm:w-64 ml-auto space-y-1.5 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal, form.currency)}</span>
          </div>
          {Number(form.taxRate) > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Tax ({form.taxRate}%)</span>
              <span>{formatCurrency(tax, form.currency)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-semibold text-slate-900 pt-1.5 border-t-2 border-slate-300">
            <span>Total</span>
            <span>{formatCurrency(total, form.currency)}</span>
          </div>
        </div>

        <div className="print-only mt-12 pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
          <p>Generated by SlipForge · {receiptNo} · {displayDate}</p>
        </div>
      </div>
    </>
  )
}

export default ModernReceipt
