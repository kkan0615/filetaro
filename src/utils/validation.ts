/**
 * Check  " / : * < > | " in the file name
 * @param str {string} - file name
 */
export const checkSpecialCharsInName = (str: string) => {
  const specials = ['￦', '/', ':', '*', '<', '>', '|']
  // Check special characters except backslash
  if (specials.includes(str)) {
    return false
  }
  // Check "\" backslash
  if (str.match(/\\$/)) {
    return false
  }
  return true
}
