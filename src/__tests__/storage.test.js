import { describe, it, expect, beforeEach } from "vitest"
import { storage } from "../utils/storage"

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("sets and gets a value", () => {
    storage.set("test_key", { hello: "world" })
    expect(storage.get("test_key")).toEqual({ hello: "world" })
  })

  it("returns fallback for missing key", () => {
    expect(storage.get("nonexistent", 42)).toBe(42)
  })

  it("removes a key", () => {
    storage.set("temp", "value")
    storage.remove("temp")
    expect(storage.get("temp")).toBeNull()
  })

  it("clears all prefixed keys", () => {
    storage.set("a", 1)
    storage.set("b", 2)
    localStorage.setItem("other_key", "keep")
    storage.clear()
    expect(storage.get("a")).toBeNull()
    expect(storage.get("b")).toBeNull()
    expect(localStorage.getItem("other_key")).toBe("keep")
  })
})
