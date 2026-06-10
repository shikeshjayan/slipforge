// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import ModernReceipt from "../templates/ModernReceipt"

afterEach(cleanup)

describe("ModernReceipt", () => {
  const form = {
    businessName: "Acme Corp",
    clientName: "Jane Doe",
    taxRate: 10,
    currency: "USD",
  }

  const items = [
    { description: "Widget", qty: 2, price: 10 },
    { description: "Service", qty: 1, price: 50 },
  ]

  it("renders business name and client name", () => {
    render(<ModernReceipt form={form} items={items} receiptNo="RCP-TEST" date="May 15, 2026" />)
    expect(screen.getByText("Acme Corp")).toBeDefined()
    expect(screen.getByText("Jane Doe")).toBeDefined()
  })

  it("renders all line items", () => {
    render(<ModernReceipt form={form} items={items} receiptNo="RCP-TEST" date="May 15, 2026" />)
    expect(screen.getByText("Widget")).toBeDefined()
    expect(screen.getByText("Service")).toBeDefined()
  })

  it("renders receipt number in the document", () => {
    render(<ModernReceipt form={form} items={items} receiptNo="RCP-TEST" date="May 15, 2026" />)
    const instances = screen.getAllByText("RCP-TEST")
    expect(instances.length).toBeGreaterThanOrEqual(1)
  })

  it("renders subtotal and total summary", () => {
    render(<ModernReceipt form={form} items={items} receiptNo="RCP-TEST" date="May 15, 2026" />)
    expect(screen.getByText("Subtotal")).toBeDefined()
    expect(screen.getByText("Tax (10%)")).toBeDefined()
    expect(screen.getAllByText("Total").length).toBeGreaterThanOrEqual(1)
  })

  it("does not show tax row when tax rate is 0", () => {
    const noTaxForm = { ...form, taxRate: 0 }
    render(<ModernReceipt form={noTaxForm} items={items} receiptNo="RCP-TEST" date="May 15, 2026" />)
    expect(screen.queryByText(/Tax/)).toBeNull()
  })

  it("renders empty state gracefully", () => {
    render(<ModernReceipt form={{}} items={[]} receiptNo="" date="" />)
    expect(screen.getByText("Business Name")).toBeDefined()
    expect(screen.getByText("Client Name")).toBeDefined()
  })
})
