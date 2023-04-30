export const Locales = ['en', 'ko'] as const
export type Locale = typeof Locales[number]
export const defaultLocale: Locale = 'en'
