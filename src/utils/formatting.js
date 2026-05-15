export const formatCurrency = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)

export const formatDate = (date = new Date()) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(date)

export const formatShortDate = (date = new Date()) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date)

export const formatTime = (date = new Date()) =>
  new Intl.DateTimeFormat("en-US", { timeStyle: "short" }).format(date)

export const generateReceiptNo = (prefix = "RCP") =>
  `${prefix}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
