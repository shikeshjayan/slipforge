import { describe, it, expect } from "vitest"
import { calcSubtotal, calcTax, calcTotal, calcLineTotal } from "../utils/calculations"

describe("calcSubtotal", () => {
  it("returns 0 for empty items", () => {
    expect(calcSubtotal([])).toBe(0)
  })

  it("sums qty * price for all items", () => {
    const items = [
      { qty: 2, price: 10 },
      { qty: 3, price: 5 },
    ]
    expect(calcSubtotal(items)).toBe(35)
  })

  it("handles single item", () => {
    expect(calcSubtotal([{ qty: 5, price: 4 }])).toBe(20)
  })
})

describe("calcTax", () => {
  it("returns 0 for 0% tax", () => {
    expect(calcTax(100, 0)).toBe(0)
  })

  it("calculates correct tax percentage", () => {
    expect(calcTax(200, 10)).toBe(20)
  })

  it("handles decimal tax rates", () => {
    expect(calcTax(100, 7.5)).toBe(7.5)
  })
})

describe("calcTotal", () => {
  it("sums subtotal and tax", () => {
    expect(calcTotal(100, 10)).toBe(110)
  })
})

describe("calcLineTotal", () => {
  it("returns qty * price", () => {
    expect(calcLineTotal({ qty: 3, price: 4 })).toBe(12)
  })

  it("handles zero values", () => {
    expect(calcLineTotal({ qty: 0, price: 5 })).toBe(0)
  })
})
