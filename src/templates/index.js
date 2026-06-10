import ModernReceipt from "./ModernReceipt"
import ClassicReceipt from "./ClassicReceipt"
import MinimalReceipt from "./MinimalReceipt"
import ElegantReceipt from "./ElegantReceipt"

export const TEMPLATES = {
  modern: {
    id: "modern",
    name: "Modern",
    description: "Clean modern design with watermark and gradient accents",
    component: ModernReceipt,
  },
  classic: {
    id: "classic",
    name: "Classic",
    description: "Traditional professional invoice layout",
    component: ClassicReceipt,
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Simple and airy with plenty of whitespace",
    component: MinimalReceipt,
  },
  elegant: {
    id: "elegant",
    name: "Elegant",
    description: "Premium look with refined accents and typography",
    component: ElegantReceipt,
  },
}

export const TEMPLATE_LIST = Object.values(TEMPLATES)
