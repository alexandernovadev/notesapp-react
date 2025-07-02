import { useEffect, useMemo, useState } from "react"
import { FormState, FormValidations, FormValidationState } from "@/types"

export const useForm = (initialForm: FormState = {}, formValidations: FormValidations = {}) => {
  const [formState, setFormState] = useState<FormState>(initialForm)
  const [formValidation, setFormValidation] = useState<FormValidationState>({})

  useEffect(() => {
    createValidators()
  }, [formState])

  useEffect(() => {
    setFormState(initialForm)
  }, [initialForm])

  const isFormValid = useMemo(() => {
    for (const formValue of Object.keys(formValidation)) {
      if (formValidation[formValue] !== null) return false
    }
    return true
  }, [formValidation])

  const onInputChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target
    setFormState({
      ...formState,
      [name]: value,
    })
  }

  const onResetForm = () => {
    setFormState(initialForm)
  }

  const createValidators = () => {
    const formCheckedValues: FormValidationState = {}

    // This function works with this format:
    // email               :  [(value) => value.includes("@"), "El correo debe de tener una @"],
    //formState[formField] : [fn, message] ==> fn is a function that returns a boolean;

    for (const formField of Object.keys(formValidations)) {
      const validation = formValidations[formField]
      if (validation) {
        const [fn, errorMessage] = validation
        const fieldValue = formState[formField] || ''
        formCheckedValues[`${formField}Valid`] = fn(fieldValue)
          ? null
          : errorMessage
      }
    }

    setFormValidation(formCheckedValues)
  }

  return {
    ...formState,
    formState,
    onInputChange,
    onResetForm,
    ...formValidation,
    isFormValid,
  }
} 