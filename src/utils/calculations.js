export const calcSubtotal = (items) =>
  items.reduce((sum, item) => sum + (item.qty || 0) * (item.price || 0), 0)

export const calcTax = (subtotal, taxRate) => subtotal * (Number(taxRate) / 100)

export const calcTotal = (subtotal, tax) => subtotal + tax

export const calcLineTotal = (item) => (item.qty || 0) * (item.price || 0)
