import { useContext } from "react"
import { ReceiptContext } from "../context/ReceiptContext"

export const useReceipt = () => {
  const ctx = useContext(ReceiptContext)
  if (!ctx) throw new Error("useReceipt must be used within ReceiptProvider")
  return ctx
}
