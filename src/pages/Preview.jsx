import { useNavigate } from "react-router-dom"
import { useRef, useState, useMemo } from "react"
import { toCanvas } from "html-to-image"
import { jsPDF } from "jspdf"
import { useReceipt } from "../context/ReceiptContext"
import { calcSubtotal, calcTax, calcTotal } from "../utils/calculations"
import { formatCurrency } from "../utils/formatting"
import ModernReceipt from "../templates/ModernReceipt"
import { ReceiptSkeleton } from "../components/LoadingSkeleton"

const defaultForm = { businessName: "", clientName: "", clientWhatsapp: "", clientEmail: "", taxRate: 0, currency: "USD" }

const Preview = () => {
  const navigate = useNavigate()
  const printRef = useRef(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [shareLoading, setShareLoading] = useState(false)
  const [pdfError, setPdfError] = useState(null)
  const { currentReceipt, saveToHistory, settings } = useReceipt()

  const form = useMemo(() => currentReceipt?.form ?? defaultForm, [currentReceipt?.form])
  const items = useMemo(() => currentReceipt?.items ?? [], [currentReceipt?.items])
  const receiptNo = currentReceipt?.receiptNo || ""
  const date = currentReceipt?.date || ""

  const total = useMemo(() => {
    const sub = calcSubtotal(items)
    const tax = calcTax(sub, form.taxRate)
    return calcTotal(sub, tax)
  }, [items, form.taxRate])

  const generatePDFBlob = async () => {
    const canvas = await toCanvas(printRef.current, {
      pixelRatio: 3,
      backgroundColor: "#ffffff",
    })
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("p", "mm", "a4")
    const pageW = pdf.internal.pageSize.getWidth()
    const pageH = pdf.internal.pageSize.getHeight()
    const margin = 10
    const imgW = pageW - 2 * margin
    const imgH = (canvas.height * imgW) / canvas.width
    const x = margin
    const y = imgH < pageH ? (pageH - imgH) / 2 : margin
    pdf.addImage(imgData, "PNG", x, y, imgW, imgH)
    return pdf.output("blob")
  }

  const handleDownloadPDF = async () => {
    if (!printRef.current) return
    setPdfLoading(true)
    setPdfError(null)
    try {
      const blob = await generatePDFBlob()
      saveToHistory({ form, items, receiptNo, date })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${form.businessName || "receipt"}-${receiptNo}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setPdfError(err.message || "Failed to generate PDF")
    } finally {
      setPdfLoading(false)
    }
  }

  const handleShareWhatsApp = async () => {
    if (!printRef.current) return
    setShareLoading(true)
    setPdfError(null)
    try {
      const blob = await generatePDFBlob()
      saveToHistory({ form, items, receiptNo, date })

      const filename = `${form.businessName || "receipt"}-${receiptNo}.pdf`
      const file = new File([blob], filename, { type: "application/pdf" })
      const shareText = `Receipt ${receiptNo} from ${form.businessName || "Business"} · Total: ${formatCurrency(total, form.currency)}`

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: shareText, text: shareText })
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
        const msg = encodeURIComponent(`${shareText}\n\nPDF downloaded. Attach it to this chat.`)
        window.open(`https://wa.me/?text=${msg}`, "_blank")
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setPdfError(err.message || "Failed to share receipt")
      }
    } finally {
      setShareLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <button
              onClick={() => navigate("/data-entry")}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Receipt Preview</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => window.print()}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
            <button
              onClick={handleShareWhatsApp}
              disabled={shareLoading}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 shadow-sm transition-colors cursor-pointer"
              title="Share via WhatsApp"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {shareLoading ? "Sharing..." : "WhatsApp"}
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 shadow-sm transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {pdfLoading ? "Generating..." : "Download PDF"}
            </button>
          </div>
        </div>

        {pdfError && (
          <div className="no-print mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {pdfError}
          </div>
        )}

        <div ref={printRef}>
          {items.length === 0 ? (
            <ReceiptSkeleton />
          ) : (
            <ModernReceipt form={form} items={items} receiptNo={receiptNo} date={date} logo={settings.logo} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Preview
