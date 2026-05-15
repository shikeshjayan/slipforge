/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useCallback, useMemo } from "react"
import { useLocalStorage } from "../hooks/useLocalStorage"
import { generateReceiptNo, formatDate } from "../utils/formatting"
import { calcSubtotal, calcTax, calcTotal } from "../utils/calculations"

const SETTINGS_KEY = "slipforge_settings"
const HISTORY_KEY = "slipforge_receipts"

const defaultSettings = {
  businessName: "",
  taxRate: 0,
  currency: "USD",
  address: "",
  phone: "",
  email: "",
  receiptPrefix: "RCP",
  taxId: "",
  logo: "",
}

const ReceiptContext = createContext(null)

export const ReceiptProvider = ({ children }) => {
  const [settings, setSettings, resetSettings] = useLocalStorage(SETTINGS_KEY, defaultSettings)
  const [receipts, setReceipts] = useLocalStorage(HISTORY_KEY, [])
  const [currentReceipt, setCurrentReceipt] = useLocalStorage("slipforge_current", null)

  const saveCurrentReceipt = useCallback((form, items) => {
    const receipt = {
      form,
      items,
      receiptNo: generateReceiptNo(form.receiptPrefix || settings.receiptPrefix || "RCP"),
      date: formatDate(),
    }
    setCurrentReceipt(receipt)
    return receipt
  }, [setCurrentReceipt, settings.receiptPrefix])

  const saveToHistory = useCallback((receipt) => {
    const entry = {
      id: Date.now().toString(36),
      ...receipt,
      createdAt: Date.now(),
    }
    setReceipts((prev) => [entry, ...prev].slice(0, 50))
    return entry
  }, [setReceipts])

  const removeFromHistory = useCallback((id) => {
    setReceipts((prev) => prev.filter((r) => r.id !== id))
  }, [setReceipts])

  const clearHistory = useCallback(() => {
    setReceipts([])
  }, [setReceipts])

  const getTotals = useCallback((items, taxRate) => {
    const subtotal = calcSubtotal(items)
    const tax = calcTax(subtotal, taxRate)
    const total = calcTotal(subtotal, tax)
    return { subtotal, tax, total }
  }, [])

  const value = useMemo(() => ({
    settings, setSettings, resetSettings,
    receipts, saveToHistory, removeFromHistory, clearHistory,
    currentReceipt, saveCurrentReceipt, setCurrentReceipt, getTotals,
  }), [settings, setSettings, resetSettings, receipts, saveToHistory,
      removeFromHistory, clearHistory, currentReceipt, saveCurrentReceipt,
      setCurrentReceipt, getTotals])

  return (
    <ReceiptContext.Provider value={value}>
      {children}
    </ReceiptContext.Provider>
  )
}

export const useReceipt = () => {
  const ctx = useContext(ReceiptContext)
  if (!ctx) throw new Error("useReceipt must be used within ReceiptProvider")
  return ctx
}
