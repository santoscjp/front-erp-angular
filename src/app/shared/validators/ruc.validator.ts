import { AbstractControl, ValidationErrors } from '@angular/forms'

const COEFFICIENTS_NATURAL = [2, 1, 2, 1, 2, 1, 2, 1, 2]
const COEFFICIENTS_PRIVATE = [4, 3, 2, 7, 6, 5, 4, 3, 2]
const COEFFICIENTS_PUBLIC = [3, 2, 7, 6, 5, 4, 3, 2]
const RUC_LENGTH = 13

function validateMod11Natural(digits: number[]): boolean {
  let sum = 0
  for (let i = 0; i < COEFFICIENTS_NATURAL.length; i++) {
    let product = digits[i] * COEFFICIENTS_NATURAL[i]
    if (product >= 10) product -= 9
    sum += product
  }
  const modulus = sum % 10
  const checkDigit = modulus === 0 ? 0 : 10 - modulus
  return checkDigit === digits[9]
}

function validateMod11Private(digits: number[]): boolean {
  let sum = 0
  for (let i = 0; i < COEFFICIENTS_PRIVATE.length; i++) {
    sum += digits[i] * COEFFICIENTS_PRIVATE[i]
  }
  const remainder = sum % 11
  const checkDigit = remainder === 0 ? 0 : 11 - remainder
  return checkDigit === digits[9]
}

function validateMod11Public(digits: number[]): boolean {
  let sum = 0
  for (let i = 0; i < COEFFICIENTS_PUBLIC.length; i++) {
    sum += digits[i] * COEFFICIENTS_PUBLIC[i]
  }
  const remainder = sum % 11
  const checkDigit = remainder === 0 ? 0 : 11 - remainder
  return checkDigit === digits[8]
}

export function isValidEcuadorRuc(ruc: string): boolean {
  if (!ruc || ruc.length !== RUC_LENGTH) return false
  if (!/^\d{13}$/.test(ruc)) return false
  if (!ruc.endsWith('001')) return false

  const provinceCode = parseInt(ruc.substring(0, 2), 10)
  if (provinceCode < 1 || provinceCode > 24) return false

  const digits = ruc.split('').map(Number)
  const thirdDigit = digits[2]

  if (thirdDigit >= 0 && thirdDigit <= 5) {
    return validateMod11Natural(digits)
  } else if (thirdDigit === 6) {
    return validateMod11Public(digits)
  } else if (thirdDigit === 9) {
    return validateMod11Private(digits)
  }

  return false
}

export function rucValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const value = control.value as string
  if (!value) return null
  if (value.length !== RUC_LENGTH) return { rucLength: true }
  if (!isValidEcuadorRuc(value)) return { rucInvalid: true }
  return null
}
