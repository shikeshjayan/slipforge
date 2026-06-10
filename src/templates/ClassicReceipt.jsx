import { formatCurrency, formatDate } from "../utils/formatting"
import { calcSubtotal, calcTax, calcTotal, calcLineTotal } from "../utils/calculations"

const printStyles = `
  @page { size: A4; margin: 12mm; }
  @media print {
    body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    .print-sheet { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
    .wm-text { opacity: 0.06 !important; }
  }
`

const ClassicReceipt = ({ form, items, receiptNo, date, logo }) => {
  const subtotal = calcSubtotal(items)
  const tax = calcTax(subtotal, form.taxRate)
  const total = calcTotal(subtotal, tax)
  const displayDate = date || formatDate()

  return (
    <>
      <style>{printStyles}</style>
      <div className="print-sheet relative bg-white border border-slate-200 p-10 font-sans overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden px-4">
          <span
            className="wm-text text-[clamp(32px,5vw,96px)] font-black text-slate-700 whitespace-nowrap leading-none"
            style={{ opacity: 0.035, transform: "rotate(-30deg)", transformOrigin: "center center" }}
          >
            {receiptNo}
          </span>
        </div>
        <div className="border-b-2 border-slate-800 pb-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {logo && (
                <img
                  src={logo}
                  alt="Business logo"
                  className="h-14 w-auto max-w-[140px] rounded object-contain shrink-0"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{form.businessName || "Business Name"}</h1>
                {form.address && <p className="text-sm text-slate-500 mt-1">{form.address}</p>}
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                  {form.phone && <p className="text-xs text-slate-400">{form.phone}</p>}
                  {form.email && <p className="text-xs text-slate-400">{form.email}</p>}
                  {form.taxId && <p className="text-xs text-slate-400">Tax ID: {form.taxId}</p>}
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="inline-block bg-slate-800 text-white text-xs font-semibold tracking-widest px-4 py-1.5 uppercase mb-2">
                Receipt
              </span>
              <p className="text-sm text-slate-500 font-mono">{receiptNo}</p>
              <p className="text-sm text-slate-500">{displayDate}</p>
            </div>
          </div>
        </div>

        <div className="mb-8 border border-slate-200 bg-slate-50 p-5 rounded">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Bill To</p>
          <p className="text-base font-semibold text-slate-900">{form.clientName || "Client Name"}</p>
          {(form.clientWhatsapp || form.clientEmail) && (
            <div className="mt-2 space-y-0.5">
              {form.clientWhatsapp && <p className="text-sm text-slate-500">{form.clientWhatsapp}</p>}
              {form.clientEmail && <p className="text-sm text-slate-500">{form.clientEmail}</p>}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="text-left py-2.5 px-3 font-medium">Description</th>
                <th className="text-right py-2.5 px-3 font-medium">Qty</th>
                <th className="text-right py-2.5 px-3 font-medium">Price</th>
                <th className="text-right py-2.5 px-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-slate-200 even:bg-slate-50">
                  <td className="py-2.5 px-3 text-slate-800">{item.description || `Item ${i + 1}`}</td>
                  <td className="py-2.5 px-3 text-right text-slate-600">{item.qty}</td>
                  <td className="py-2.5 px-3 text-right text-slate-600">{formatCurrency(item.price, form.currency)}</td>
                  <td className="py-2.5 px-3 text-right font-medium text-slate-800">
                    {formatCurrency(calcLineTotal(item), form.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="border-t-2 border-slate-800 pt-4 mb-10">
          <div className="w-full sm:w-64 ml-auto space-y-1.5">
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
            <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t-2 border-slate-300">
              <span>Total</span>
              <span>{formatCurrency(total, form.currency)}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4 text-center text-xs text-slate-400">
          <p>Thank you for your business!</p>
          <p className="mt-0.5">Generated by SlipForge · {receiptNo} · {displayDate}</p>
        </div>
      </div>
    </>
  )
}

export default ClassicReceipt
