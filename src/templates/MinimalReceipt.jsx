import { formatCurrency, formatDate } from "../utils/formatting"
import { calcSubtotal, calcTax, calcTotal, calcLineTotal } from "../utils/calculations"

const printStyles = `
  @page { size: A4; margin: 14mm; }
  @media print {
    body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    .print-sheet { box-shadow: none !important; }
    .wm-text { opacity: 0.06 !important; }
  }
`

const MinimalReceipt = ({ form, items, receiptNo, date, logo }) => {
  const subtotal = calcSubtotal(items)
  const tax = calcTax(subtotal, form.taxRate)
  const total = calcTotal(subtotal, tax)
  const displayDate = date || formatDate()

  return (
    <>
      <style>{printStyles}</style>
      <div className="print-sheet relative bg-white p-10 font-sans overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden px-4">
          <span
            className="wm-text text-[clamp(32px,5vw,96px)] font-black text-slate-700 whitespace-nowrap leading-none"
            style={{ opacity: 0.035, transform: "rotate(-30deg)", transformOrigin: "center center" }}
          >
            {receiptNo}
          </span>
        </div>
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start gap-3">
            {logo && (
              <img
                src={logo}
                alt="Business logo"
                className="h-10 w-auto max-w-[120px] object-contain shrink-0 mt-0.5"
              />
            )}
            <div>
              <h1 className="text-xl font-light text-slate-900 tracking-wide">{form.businessName || "Business Name"}</h1>
              {form.address && <p className="text-xs text-slate-400 mt-0.5">{form.address}</p>}
              <div className="flex flex-wrap gap-x-3 mt-1">
                {form.phone && <p className="text-xs text-slate-400">{form.phone}</p>}
                {form.email && <p className="text-xs text-slate-400">{form.email}</p>}
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-slate-400 font-mono">{receiptNo}</p>
            <p className="text-xs text-slate-400 mt-0.5">{displayDate}</p>
          </div>
        </div>

        <hr className="border-t border-slate-200 mb-6" />

        <div className="mb-8">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Bill To</p>
          <p className="text-sm font-medium text-slate-800">{form.clientName || "Client Name"}</p>
          {(form.clientWhatsapp || form.clientEmail) && (
            <div className="mt-1 space-y-0.5">
              {form.clientWhatsapp && <p className="text-xs text-slate-400">{form.clientWhatsapp}</p>}
              {form.clientEmail && <p className="text-xs text-slate-400">{form.clientEmail}</p>}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="border-b border-slate-300">
                <th className="text-left py-2 font-medium text-slate-500 text-xs uppercase tracking-wider">Description</th>
                <th className="text-right py-2 font-medium text-slate-500 text-xs uppercase tracking-wider">Qty</th>
                <th className="text-right py-2 font-medium text-slate-500 text-xs uppercase tracking-wider">Price</th>
                <th className="text-right py-2 font-medium text-slate-500 text-xs uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-2.5 text-slate-800">{item.description || `Item ${i + 1}`}</td>
                  <td className="py-2.5 text-right text-slate-500">{item.qty}</td>
                  <td className="py-2.5 text-right text-slate-500">{formatCurrency(item.price, form.currency)}</td>
                  <td className="py-2.5 text-right font-medium text-slate-800">
                    {formatCurrency(calcLineTotal(item), form.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <hr className="border-t border-slate-200 mb-4" />

        <div className="w-full sm:w-56 ml-auto space-y-1">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal, form.currency)}</span>
          </div>
          {Number(form.taxRate) > 0 && (
            <div className="flex justify-between text-xs text-slate-500">
              <span>Tax ({form.taxRate}%)</span>
              <span>{formatCurrency(tax, form.currency)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-semibold text-slate-900 pt-1.5 border-t border-slate-300">
            <span>Total</span>
            <span>{formatCurrency(total, form.currency)}</span>
          </div>
        </div>

        <div className="mt-12 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-300 tracking-wider uppercase">
          <p>Generated by SlipForge · {receiptNo}</p>
        </div>
      </div>
    </>
  )
}

export default MinimalReceipt
