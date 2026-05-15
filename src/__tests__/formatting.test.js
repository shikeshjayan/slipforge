import { describe, it, expect } from "vitest"
import { formatCurrency, generateReceiptNo } from "../utils/formatting"

describe("formatCurrency", () => {
  it("formats USD by default", () => {
    const result = formatCurrency(100)
    expect(result).toContain("100")
  })

  it("formats EUR", () => {
    const result = formatCurrency(50, "EUR")
    expect(result).toContain("50")
  })
})

describe("generateReceiptNo", () => {
  it("uses provided prefix", () => {
    const no = generateReceiptNo("INV")
    expect(no.startsWith("INV-")).toBe(true)
  })

  it("uses default RCP prefix", () => {
    const no = generateReceiptNo()
    expect(no.startsWith("RCP-")).toBe(true)
  })

  it("generates valid receipt number format", () => {
    const no = generateReceiptNo("INV")
    expect(no).toMatch(/^INV-[A-Z0-9]+$/)
  })
})
