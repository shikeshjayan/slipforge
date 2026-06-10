import { formatCurrency, formatDate } from "../utils/formatting"
import { calcSubtotal, calcTax, calcTotal, calcLineTotal } from "../utils/calculations"

const printStyles = `
  @page { size: A4; margin: 10mm; }
  @media print {
    body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    .print-sheet { box-shadow: none !important; border: 1px solid #e2e8f0 !important; border-radius: 0 !important; }
    .wm-text { opacity: 0.06 !important; }
  }
`

const ElegantReceipt = ({ form, items, receiptNo, date, logo }) => {
  const subtotal = calcSubtotal(items)
  const tax = calcTax(subtotal, form.taxRate)
  const total = calcTotal(subtotal, tax)
  const displayDate = date || formatDate()

  return (
    <>
      <style>{printStyles}</style>
      <div className="print-sheet relative bg-white border border-slate-200 font-sans overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden px-4">
          <span
            className="wm-text text-[clamp(32px,5vw,96px)] font-black text-slate-700 whitespace-nowrap leading-none"
            style={{ opacity: 0.035, transform: "rotate(-30deg)", transformOrigin: "center center" }}
          >
            {receiptNo}
          </span>
        </div>
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-10 py-7 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {logo && (
                <img
                  src={logo}
                  alt="Business logo"
                  className="h-14 w-auto max-w-[140px] rounded-lg object-contain shrink-0 bg-white/20 p-1"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{form.businessName || "Business Name"}</h1>
                {form.address && <p className="text-sm text-indigo-200 mt-1">{form.address}</p>}
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5">
                  {form.phone && <p className="text-xs text-indigo-200">{form.phone}</p>}
                  {form.email && <p className="text-xs text-indigo-200">{form.email}</p>}
                  {form.taxId && <p className="text-xs text-indigo-200">Tax ID: {form.taxId}</p>}
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-3xl font-light tracking-widest uppercase">Receipt</p>
              <p className="text-sm text-indigo-200 font-mono mt-2">{receiptNo}</p>
              <p className="text-sm text-indigo-200">{displayDate}</p>
            </div>
          </div>
        </div>

        <div className="px-10 py-7">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Bill To</p>
              <p className="text-base font-semibold text-slate-900">{form.clientName || "Client Name"}</p>
              {(form.clientWhatsapp || form.clientEmail) && (
                <div className="mt-2 space-y-1">
                  {form.clientWhatsapp && <p className="text-sm text-slate-500">{form.clientWhatsapp}</p>}
                  {form.clientEmail && <p className="text-sm text-slate-500">{form.clientEmail}</p>}
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Details</p>
              <p className="text-sm text-slate-600">Receipt #{receiptNo}</p>
              <p className="text-sm text-slate-600">{displayDate}</p>
            </div>
          </div>

          {items.length > 0 && (
            <table className="w-full text-sm mb-8">
              <thead>
                <tr className="border-b-2 border-indigo-200">
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

          <div className="border-t-2 border-indigo-100 pt-4">
            <div className="w-full sm:w-64 ml-auto space-y-2">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal, form.currency)}</span>
              </div>
              {Number(form.taxRate) > 0 && (
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Tax ({form.taxRate}%)</span>
                  <span>{formatCurrency(tax, form.currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t-2 border-slate-800">
                <span>Total Due</span>
                <span>{formatCurrency(total, form.currency)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-10 py-4 border-t border-slate-200 text-center text-xs text-slate-400">
          <p>Generated by SlipForge · {receiptNo} · {displayDate}</p>
        </div>
      </div>
    </>
  )
}

export default ElegantReceipt
