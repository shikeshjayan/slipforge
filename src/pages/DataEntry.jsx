import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useReceipt } from "../context/ReceiptContext"
import { useFormValidation } from "../hooks/useFormValidation"
import { calcSubtotal, calcTax, calcTotal } from "../utils/calculations"
import { ReceiptFormSkeleton } from "../components/LoadingSkeleton"

const required = (msg) => (v) => (v !== undefined && v !== null && String(v).trim() ? undefined : msg)
const minItems = (min, msg) => (v, values) =>
  values?.items?.length >= min ? undefined : msg

const validationRules = {
  businessName: [required("Business name is required")],
  clientName: [required("Client name is required")],
  taxRate: [],
  currency: [],
  items: [minItems(1, "At least one line item is required")],
}

const STORAGE_KEY = "receipt-draft"
const defaultItem = { description: "", qty: 1, price: 0 }

const loadDraft = () => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

const saveDraft = (form, items) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ form, items }))
  } catch {
    // sessionStorage may be unavailable
  }
}

const DataEntry = () => {
  const navigate = useNavigate()
  const { settings, saveCurrentReceipt } = useReceipt()
  const { errors, validate, clearField } = useFormValidation(validationRules)

  const draft = loadDraft()

  const defaultForm = {
    businessName: settings.businessName || "",
    clientName: "",
    clientWhatsapp: "",
    clientEmail: "",
    taxRate: settings.taxRate || 0,
    currency: settings.currency || "USD",
  }

  const [form, setForm] = useState(draft?.form ?? defaultForm)
  const [items, setItems] = useState(draft?.items?.length ? draft.items : [{ ...defaultItem }])
  const [loading, setLoading] = useState(false)

  const handleFormChange = (field) => (e) => {
    const value = field === "taxRate" ? Number(e.target.value) : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    clearField(field)
  }

  const handleItemChange = (index, field) => (e) => {
    const value = field === "description" ? e.target.value : Number(e.target.value)
    setItems((prev) => {
      const updated = prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      )
      return updated
    })
  }

  const addItem = () => setItems((prev) => [...prev, { ...defaultItem }])

  const removeItem = (index) =>
    setItems((prev) => prev.filter((_, i) => i !== index))

  const subtotal = useMemo(() => calcSubtotal(items), [items])
  const tax = useMemo(() => calcTax(subtotal, form.taxRate), [subtotal, form.taxRate])
  const total = useMemo(() => calcTotal(subtotal, tax), [subtotal, tax])

  useEffect(() => {
    saveDraft(form, items)
  }, [form, items])

  const handleGenerate = () => {
    if (!validate({ ...form, items })) return
    setLoading(true)
    saveCurrentReceipt(form, items)
    sessionStorage.removeItem(STORAGE_KEY)
    setTimeout(() => navigate("/preview"), 300)
  }

  const inputClass = (field) =>
    `w-full px-3.5 py-2.5 rounded-lg border text-sm placeholder-slate-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow ${
      errors[field]
        ? "border-red-400 focus:ring-red-400 focus:border-red-400"
        : "border-slate-300 dark:border-gray-600 text-slate-800 dark:text-gray-200"
    }`

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <ReceiptFormSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white truncate">Create New Receipt</h1>
        </div>

        {errors.items && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errors.items}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Left Column: Receipt Information ── */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-gray-700">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/50 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Receipt Information</h2>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="business-name" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">
                    Business Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="business-name"
                    value={form.businessName}
                    onChange={handleFormChange("businessName")}
                    placeholder="e.g. Acme Corp"
                    className={inputClass("businessName")}
                  />
                  {errors.businessName && (
                    <p className="mt-1 text-xs text-red-500">{errors.businessName}</p>
                  )}
                </div>
                <div>
                    <label htmlFor="client-name" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">
                    Client Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="client-name"
                    value={form.clientName}
                    onChange={handleFormChange("clientName")}
                    placeholder="e.g. Jane Doe"
                    className={inputClass("clientName")}
                  />
                  {errors.clientName && (
                    <p className="mt-1 text-xs text-red-500">{errors.clientName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="client-whatsapp" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">
                    Client WhatsApp <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="client-whatsapp"
                    value={form.clientWhatsapp}
                    onChange={handleFormChange("clientWhatsapp")}
                    placeholder="e.g. +1 555-0123"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-gray-600 text-sm text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                  />
                </div>
                <div>
                    <label htmlFor="client-email" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">
                    Client Email <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="email"
                    id="client-email"
                    value={form.clientEmail}
                    onChange={handleFormChange("clientEmail")}
                    placeholder="e.g. jane@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-gray-600 text-sm text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="tax-rate" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    id="tax-rate"
                    value={form.taxRate}
                    onChange={handleFormChange("taxRate")}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-gray-600 text-sm text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                  />
                </div>
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">
                    Currency
                  </label>
                  <select
                    id="currency"
                    value={form.currency}
                    onChange={handleFormChange("currency")}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-gray-600 text-sm text-slate-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                  >
                    {["USD", "EUR", "GBP", "INR", "CAD", "AUD", "JPY", "CNY"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* ── Right Column: Line Items ── */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Line Items</h2>
              </div>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/50 hover:bg-emerald-100 dark:hover:bg-emerald-800/50 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 dark:border-gray-600 bg-slate-50/50 dark:bg-gray-700/50 p-4 relative group"
                >
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                      title="Remove item"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <div className="text-xs font-medium text-slate-400 dark:text-gray-500 mb-2">Item {i + 1}</div>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor={`desc-${i}`} className="block text-xs font-medium text-slate-600 dark:text-gray-400 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        id={`desc-${i}`}
                        value={item.description}
                        onChange={handleItemChange(i, "description")}
                        placeholder="Item name or service"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-gray-600 text-sm text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor={`qty-${i}`} className="block text-xs font-medium text-slate-600 dark:text-gray-400 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          id={`qty-${i}`}
                          value={item.qty}
                          onChange={handleItemChange(i, "qty")}
                          min="1"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-gray-600 text-sm text-slate-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                      />
                    </div>
                    <div>
                      <label htmlFor={`price-${i}`} className="block text-xs font-medium text-slate-600 dark:text-gray-400 mb-1">
                          Price
                        </label>
                        <input
                          type="number"
                          id={`price-${i}`}
                          value={item.price}
                          onChange={handleItemChange(i, "price")}
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-gray-600 text-sm text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                        />
                      </div>
                    </div>
                    <div className="text-right text-sm font-medium text-slate-700 dark:text-gray-400">
                      Line total: <span className="text-slate-900 dark:text-white">{(item.qty * item.price).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Totals Summary ── */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-gray-700 space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-gray-400">
                <span>Tax ({form.taxRate || 0}%)</span>
                <span>{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-slate-900 dark:text-white pt-1.5 border-t border-slate-200 dark:border-gray-700">
                <span>Total</span>
                <span>{total.toFixed(2)}</span>
              </div>
            </div>
          </section>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors cursor-pointer"
          >
            Generate Receipt
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataEntry
