import dayjs from '@renderer/utils/libs/dayjs'

const DateFormats = ['YYYY-MM-DD', 'MM-DD-YYYY', 'YYYY.MM.DD', 'MM.DD.YYYY', 'MMM Do YY', 'MMM Do YYYY'] as const
export type DateFormatType = typeof DateFormats[number]
export const DefaultDateFormat:DateFormatType = 'MM-DD-YYYY'
export const DateFormatOptions: {example: string, value: DateFormatType}[] = [
  { example: dayjs().format('YYYY-MM-DD'), value: 'YYYY-MM-DD' },
  { example: dayjs().format('MM-DD-YYYY'), value: 'MM-DD-YYYY' },
  { example: dayjs().format('YYYY.MM.DD'), value: 'YYYY.MM.DD' },
  { example: dayjs().format('MM.DD.YYYY'), value: 'MM.DD.YYYY' },
  { example: dayjs().format('MMM Do YY'), value: 'MMM Do YY' },
  { example: dayjs().format('MMM Do YYYY'), value: 'MMM Do YYYY' },
]

const TimeFormats = ['HH.mm', 'hh.mm a', 'H.mm.ss', 'h.mm.ss a', 'HH.mm.ss', 'hh.mm.ss a'] as const
export type TimeFormatType = typeof TimeFormats[number]
export const DefaultTimeFormat:TimeFormatType = 'hh.mm.ss a'
export const TimeFormatOptions: {example: string, value: TimeFormatType}[] = [
  { example: dayjs().format('HH.mm'), value: 'HH.mm' },
  { example: dayjs().format('hh.mm a'), value: 'hh.mm a' },
  { example: dayjs().format('H.mm.ss'), value: 'H.mm.ss' },
  { example: dayjs().format('h.mm.ss a'), value: 'h.mm.ss a' },
  { example: dayjs().format('HH.mm.ss'), value: 'HH.mm.ss' },
  { example: dayjs().format('hh.mm.ss a'), value: 'hh.mm.ss a' },
]

export interface ApplicationSetting {
  dateFormat: DateFormatType,
  timeFormat: TimeFormatType | null
}
