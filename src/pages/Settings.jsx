import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useReceipt } from "../hooks/useReceipt"
import { CURRENCIES } from "../utils/constants"
import { TEMPLATE_LIST } from "../templates"

const Settings = () => {
  const navigate = useNavigate()
  const { settings, setSettings, resetSettings } = useReceipt()
  const [saved, setSaved] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [logoError, setLogoError] = useState("")
  const logoInputRef = useRef(null)

  const update = (field) => (e) => {
    const raw = e.target.value
    const value = field === "taxRate" ? (raw === "" ? "" : Number(raw)) : raw
    setSettings((prev) => ({ ...prev, [field]: value }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoError("")

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      setLogoError("Only PNG, JPEG, and WebP images are accepted.")
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setLogoError("Image must be under 2 MB.")
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      setSettings((prev) => ({ ...prev, logo: ev.target.result }))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    setSettings((prev) => ({ ...prev, logo: "" }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    if (logoInputRef.current) logoInputRef.current.value = ""
  }

  const handleReset = () => {
    resetSettings()
    setShowReset(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-gray-600 text-sm text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
  const labelClass = "block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5"
  const cardClass = "bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 p-6"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white flex-1">Global Shop Settings</h1>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </span>
          )}
        </div>

        <p className="text-sm text-slate-500 dark:text-gray-400 mb-8 -mt-4">
          These settings are stored automatically inside your device&apos;s browser
          memory and will be used as defaults for future receipts.
        </p>

        <div className="space-y-6">
          <section className={cardClass}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-gray-700">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/50 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Business Details</h2>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="businessName" className={labelClass}>Default Business Name</label>
                  <input
                    type="text"
                    id="businessName"
                    value={settings.businessName}
                    onChange={update("businessName")}
                    placeholder="e.g. Acme Corp"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="taxId" className={labelClass}>Tax ID / VAT Number</label>
                  <input
                    type="text"
                    id="taxId"
                    value={settings.taxId}
                    onChange={update("taxId")}
                    placeholder="e.g. 12-3456789"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className={labelClass}>Business Address</label>
                <input
                  type="text"
                  id="address"
                  value={settings.address}
                  onChange={update("address")}
                  placeholder="e.g. 123 Main St, City"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className={labelClass}>Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    value={settings.phone}
                    onChange={update("phone")}
                    placeholder="e.g. +1 555-0123"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={settings.email}
                    onChange={update("email")}
                    placeholder="e.g. hello@acme.com"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className={cardClass}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-gray-700">
              <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-900/50 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Branding</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className={labelClass}>Business Logo</label>
                <p className="text-xs text-slate-400 dark:text-gray-500 mb-3">
                  Upload a PNG, JPEG, or WebP image (max 2 MB). The logo will appear on all generated receipts.
                </p>

                {settings.logo ? (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-gray-700/50 border border-slate-200 dark:border-gray-600">
                    <img
                      src={settings.logo}
                      alt="Business logo"
                      className="h-14 w-auto max-w-[160px] rounded-lg object-contain border border-slate-200 dark:border-gray-600 bg-white"
                    />
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={handleRemoveLogo}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                      <button
                        onClick={() => logoInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Replace
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 p-8 rounded-xl border-2 border-dashed border-slate-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-500 bg-slate-50/50 dark:bg-gray-700/30 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-colors cursor-pointer"
                  >
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Click to upload your logo</p>
                    <p className="text-xs text-slate-400 dark:text-gray-500">PNG, JPEG, or WebP · 2 MB max</p>
                  </div>
                )}

                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleLogoUpload}
                  className="hidden"
                />

                {logoError && (
                  <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {logoError}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className={cardClass}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-gray-700">
              <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-900/50 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Defaults</h2>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="defaultTaxPercentage" className={labelClass}>Default Tax Rate (%)</label>
                  <input
                    type="number"
                    id="defaultTaxPercentage"
                    value={settings.taxRate}
                    onChange={update("taxRate")}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="defaultCurrency" className={labelClass}>Default Currency</label>
                  <select
                    id="defaultCurrency"
                    value={settings.currency}
                    onChange={update("currency")}
                    className={inputClass}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="receiptPrefix" className={labelClass}>Receipt Number Prefix</label>
                <input
                  type="text"
                  id="receiptPrefix"
                  value={settings.receiptPrefix}
                  onChange={update("receiptPrefix")}
                  placeholder="e.g. RCP"
                  className={inputClass + " max-w-xs"}
                />
                <p className="mt-1.5 text-xs text-slate-400 dark:text-gray-500">
                  Receipts will be numbered like {settings.receiptPrefix || "RCP"}-XXXXXXXX
                </p>
              </div>
            </div>
          </section>

          <section className={cardClass}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-gray-700">
              <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-900/50 flex items-center justify-center">
                <svg className="w-5 h-5 text-sky-600 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Invoice Template</h2>
            </div>

            <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">
              Choose your preferred receipt layout. The selected template will be used for all new receipts.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {TEMPLATE_LIST.map((t) => {
                const isActive = settings.template === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSettings((prev) => ({ ...prev, template: t.id }))
                      setSaved(true)
                      setTimeout(() => setSaved(false), 2000)
                    }}
                    className={`relative flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      isActive
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm"
                        : "border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-slate-300 dark:hover:border-gray-500"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                    <div className={`w-full h-20 rounded-lg border flex items-center justify-center ${
                      isActive ? "border-emerald-300 bg-white" : "border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-700"
                    }`}>
                      <svg className={`w-8 h-8 ${isActive ? "text-emerald-500" : "text-slate-300 dark:text-gray-500"}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 14H6v-2h6v2zm6-4H6v-2h12v2zm0-4H6V7h12v2z" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${isActive ? "text-emerald-800 dark:text-emerald-300" : "text-slate-700 dark:text-gray-300"}`}>
                        {t.name}
                      </p>
                      <p className={`text-xs mt-0.5 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-gray-500"}`}>
                        {t.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-red-200 dark:border-red-900 p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-100 dark:border-red-900">
              <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/50 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-red-800">Danger Zone</h2>
            </div>

            <p className="text-sm text-slate-600 dark:text-gray-400 mb-4">
              Resetting app storage will clear all local configuration data from your browser cache.
              This action cannot be undone.
            </p>

            {showReset ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                <p className="text-sm font-medium text-red-700">Are you sure?</p>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Yes, Reset Everything
                </button>
                <button
                  onClick={() => setShowReset(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowReset(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Reset App Storage
              </button>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default Settings
