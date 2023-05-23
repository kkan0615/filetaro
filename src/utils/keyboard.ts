/**
 * Parse event and returns KBD
 * @param event - Keyboard event
 * @return {string[]} - Keys
 */
export const getKBD = (event: KeyboardEvent) => {
  const result: string[] = []

  if (event.ctrlKey) result.push('control')
  if (event.altKey) result.push('alt')
  if (event.shiftKey) result.push('shift')
  if (!['Control', 'Alt', 'Shift'].includes(event.key)) result.push(event.key.toLowerCase())

  return result
}
