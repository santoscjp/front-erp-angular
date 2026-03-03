const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const DIGITS = '0123456789'
const SYMBOLS = '!@#$%^&*'
const ALL_CHARS = UPPERCASE + LOWERCASE + DIGITS + SYMBOLS

export function generateSecurePassword(): string {
  const mandatoryChars = [
    UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)],
    LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)],
    DIGITS[Math.floor(Math.random() * DIGITS.length)],
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
  ]

  const remainingChars = Array.from({ length: 8 }, () =>
    ALL_CHARS[Math.floor(Math.random() * ALL_CHARS.length)],
  )

  return [...mandatoryChars, ...remainingChars]
    .sort(() => Math.random() - 0.5)
    .join('')
}
