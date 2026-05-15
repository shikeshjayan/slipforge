import { useState } from "react"

export const useFormValidation = (rules) => {
  const [errors, setErrors] = useState({})

  const validate = (values) => {
    const newErrors = {}
    for (const [field, fieldRules] of Object.entries(rules)) {
      for (const rule of fieldRules) {
        const error = rule(values[field], values)
        if (error) {
          newErrors[field] = error
          break
        }
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const clearErrors = () => setErrors({})
  const clearField = (field) => setErrors((prev) => ({ ...prev, [field]: undefined }))

  return { errors, validate, clearErrors, clearField }
}
