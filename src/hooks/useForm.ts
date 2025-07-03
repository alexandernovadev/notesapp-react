import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  FormConfig,
  FormMethods,
  FormState,
  ValidationErrors,
  ValidationError,
} from "@/types/forms"
import { validateField } from "@/utils/validators"

export const useForm = <T extends Record<string, any>>(
  config: FormConfig<T>
): FormMethods<T> => {
  const {
    initialValues,
    validationRules = {},
    onSubmit,
    onError,
    validateOnChange = true,
    validateOnBlur = true,
  } = config

  // State
  const [formState, setFormState] = useState<FormState<T>>(() =>
    createInitialFormState(initialValues)
  )
  const [errors, setErrors] = useState<ValidationErrors<T>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [isFormTouched, setIsFormTouched] = useState(false)

  // Refs
  const initialValuesRef = useRef(initialValues)
  const validationRulesRef = useRef(validationRules)

  // Update refs when config changes
  useEffect(() => {
    initialValuesRef.current = initialValues
    validationRulesRef.current = validationRules
  }, [initialValues, validationRules])

  // Create initial form state
  function createInitialFormState(values: T): FormState<T> {
    const state: FormState<T> = {} as FormState<T>

    for (const key in values) {
      state[key] = {
        value: values[key],
        error: null,
        touched: false,
        dirty: false,
        isValid: true,
      }
    }

    return state
  }

  // Get current values
  const values = useMemo(() => {
    const currentValues = {} as T
    for (const key in formState) {
      currentValues[key] = formState[key].value
    }
    return currentValues
  }, [formState])

  // Validation functions
  const validateFieldValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]): ValidationError | null => {
      const fieldRules = validationRulesRef.current[field]
      if (!fieldRules) return null

      const rules = Array.isArray(fieldRules) ? fieldRules : [fieldRules]
      const { error } = validateField(value, rules, values)

      return error ? { type: "validation", message: error } : null
    },
    [values]
  )

  const validateForm = useCallback((): ValidationErrors<T> => {
    const newErrors: ValidationErrors<T> = {}

    for (const field in validationRulesRef.current) {
      const fieldKey = field as keyof T
      const value = formState[fieldKey].value
      const error = validateFieldValue(fieldKey, value)

      if (error) {
        newErrors[fieldKey] = error
      }
    }

    setErrors(newErrors)
    return newErrors
  }, [formState, validateFieldValue])

  // Field update function
  const updateField = useCallback(
    <K extends keyof T>(field: K, updates: Partial<FormState<T>[K]>) => {
      setFormState((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          ...updates,
        },
      }))
    },
    []
  )

  // Event handlers
  const handleChange = useCallback(
    <K extends keyof T>(field: K) => {
      return (value: T[K]) => {
        const currentValue = formState[field].value
        const isDirty = value !== initialValuesRef.current[field]

        updateField(field, {
          value,
          dirty: isDirty,
          error: null, // Clear error on change
        })

        // Update form dirty state
        const anyFieldDirty = Object.keys(formState).some((key) => {
          const fieldKey = key as keyof T
          return (
            formState[fieldKey].value !== initialValuesRef.current[fieldKey]
          )
        })
        setIsFormDirty(anyFieldDirty || isDirty)

        // Validate on change if enabled
        if (validateOnChange) {
          const error = validateFieldValue(field, value)
          if (error) {
            updateField(field, { error, isValid: false })
          } else {
            updateField(field, { isValid: true })
          }
        }
      }
    },
    [formState, validateOnChange, validateFieldValue, updateField]
  )

  const handleBlur = useCallback(
    <K extends keyof T>(field: K) => {
      return () => {
        updateField(field, { touched: true })

        // Update form touched state
        const anyFieldTouched = Object.keys(formState).some((key) => {
          const fieldKey = key as keyof T
          return formState[fieldKey].touched
        })
        setIsFormTouched(anyFieldTouched || true)

        // Validate on blur if enabled
        if (validateOnBlur) {
          const value = formState[field].value
          const error = validateFieldValue(field, value)
          if (error) {
            updateField(field, { error, isValid: false })
          } else {
            updateField(field, { isValid: true })
          }
        }
      }
    },
    [formState, validateOnBlur, validateFieldValue, updateField]
  )

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault()
      }

      // Validate form
      const formErrors = validateForm()

      if (Object.keys(formErrors).length > 0) {
        // Update field states with errors
        for (const field in formErrors) {
          const fieldKey = field as keyof T
          updateField(fieldKey, {
            error: formErrors[fieldKey]!,
            isValid: false,
            touched: true,
          })
        }

        onError?.(formErrors)
        return
      }

      // Submit form
      if (onSubmit) {
        setIsSubmitting(true)
        try {
          await onSubmit(values)
        } catch (error) {
          console.error("Form submission error:", error)
        } finally {
          setIsSubmitting(false)
        }
      }
    },
    [validateForm, onSubmit, onError, values, updateField]
  )

  // Utility functions
  const getValue = useCallback(
    <K extends keyof T>(field: K): T[K] => {
      return formState[field].value
    },
    [formState]
  )

  const setValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      handleChange(field)(value)
    },
    [handleChange]
  )

  const getError = useCallback(
    <K extends keyof T>(field: K): ValidationError | null => {
      return formState[field].error
    },
    [formState]
  )

  const setError = useCallback(
    <K extends keyof T>(field: K, error: ValidationError) => {
      updateField(field, { error, isValid: false })
    },
    [updateField]
  )

  const clearError = useCallback(
    <K extends keyof T>(field: K) => {
      updateField(field, { error: null, isValid: true })
    },
    [updateField]
  )

  const clearAllErrors = useCallback(() => {
    setErrors({})
    setFormState((prev) => {
      const newState = { ...prev }
      for (const key in newState) {
        newState[key] = { ...newState[key], error: null, isValid: true }
      }
      return newState
    })
  }, [])

  const reset = useCallback((newValues?: Partial<T>) => {
    const valuesToUse = newValues
      ? { ...initialValuesRef.current, ...newValues }
      : initialValuesRef.current
    setFormState(createInitialFormState(valuesToUse as T))
    setErrors({})
    setIsFormDirty(false)
    setIsFormTouched(false)
    setIsSubmitting(false)
  }, [])

  const setValues = useCallback(
    (newValues: Partial<T>) => {
      for (const key in newValues) {
        const fieldKey = key as keyof T
        setValue(fieldKey, newValues[fieldKey]!)
      }
    },
    [setValue]
  )

  const validate = useCallback(() => {
    return validateForm()
  }, [validateForm])

  const validateFieldMethod = useCallback(
    <K extends keyof T>(field: K) => {
      const value = formState[field].value
      return validateFieldValue(field, value)
    },
    [formState, validateFieldValue]
  )

  // Register function for easy field binding
  const register = useCallback(
    <K extends keyof T>(field: K) => {
      return {
        value: formState[field].value,
        onChange: handleChange(field),
        onBlur: handleBlur(field),
        error: formState[field].error,
        touched: formState[field].touched,
        dirty: formState[field].dirty,
        isValid: formState[field].isValid,
      }
    },
    [formState, handleChange, handleBlur]
  )

  // Computed states
  const isFormValid = useMemo(() => {
    return (
      Object.keys(formState).every((key) => {
        const fieldKey = key as keyof T
        return formState[fieldKey].isValid
      }) && Object.keys(errors).length === 0
    )
  }, [formState, errors])

  const touched = useMemo(() => {
    const touchedState: { [K in keyof T]: boolean } = {} as any
    for (const key in formState) {
      touchedState[key] = formState[key].touched
    }
    return touchedState
  }, [formState])

  const dirty = useMemo(() => {
    const dirtyState: { [K in keyof T]: boolean } = {} as any
    for (const key in formState) {
      dirtyState[key] = formState[key].dirty
    }
    return dirtyState
  }, [formState])

  const isValid = useMemo(() => {
    const validState: { [K in keyof T]: boolean } = {} as any
    for (const key in formState) {
      validState[key] = formState[key].isValid
    }
    return validState
  }, [formState])

  return {
    // Values
    values,
    getValue,
    setValue,

    // Errors
    errors,
    getError,
    setError,
    clearError,
    clearAllErrors,

    // Field States
    touched,
    dirty,
    isValid,

    // Form States
    isFormValid,
    isFormDirty,
    isFormTouched,
    isSubmitting,

    // Event Handlers
    handleChange,
    handleBlur,
    handleSubmit,

    // Actions
    reset,
    setValues,
    validate,
    validateField: validateFieldMethod,

    // Utilities
    register,
  }
}
