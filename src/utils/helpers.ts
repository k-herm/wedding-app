export const capitalize = (word: string): string => {
  const trimWord = word.toLowerCase().trim()
  return trimWord.charAt(0).toUpperCase() + trimWord.slice(1)
}
