import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useReceipt } from "../hooks/useReceipt"
import { formatShortDate, formatTime } from "../utils/formatting"

const ReceiptHistory = () => {
  const navigate = useNavigate()
  const { receipts, removeFromHistory, clearHistory, setCurrentReceipt } = useReceipt()
  const [showClear, setShowClear] = useState(false)
  const [confirmId, setConfirmId] = useState(null)

  if (receipts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-700 mb-1">No receipts yet</h3>
        <p className="text-sm text-slate-400">Generated receipts will appear here.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-700">
          Recent Receipts ({receipts.length})
        </h3>
        {showClear ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => { clearHistory(); setShowClear(false) }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer"
            >
              Confirm Clear
            </button>
            <button
              onClick={() => setShowClear(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : receipts.length > 0 && (
          <button
            onClick={() => setShowClear(true)}
            className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {receipts.map((r) => (
          <div
            key={r.id}
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-emerald-100 hover:shadow-sm transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">
                {r.form?.businessName || "Untitled"}
                <span className="font-mono text-xs text-slate-400 ml-2">{r.receiptNo}</span>
              </p>
              <p className="text-xs text-slate-400">
                {r.form?.clientName && `${r.form.clientName} · `}
                {r.date && formatShortDate(new Date(r.date))}
                {r.createdAt && ` · ${formatTime(new Date(r.createdAt))}`}
                {r.items && ` · ${r.items.length} item(s)`}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setCurrentReceipt({ form: r.form, items: r.items, receiptNo: r.receiptNo, date: r.date }); navigate("/preview") }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
                title="Open receipt"
              >
                Open
              </button>
              {confirmId === r.id ? (
                <button
                  onClick={() => { removeFromHistory(r.id); setConfirmId(null) }}
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Confirm delete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => setConfirmId(r.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
                  title="Delete receipt"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReceiptHistory
