/**
 * سه عنوان پیش‌فرض آدرس (خانه، محل کار، ویلا) به هر دو زبان.
 * هر عنوان دیگه‌ای null برمی‌گردونه و آیکن عمومی آدرس نمایش داده می‌شه.
 */
export type AddressKind = 'home' | 'work' | 'cabin'

const names: Record<AddressKind, string[]> = {
  home: ['خانه', 'home'],
  work: ['محل کار', 'work'],
  cabin: ['ویلا', 'cabin'],
}

function normalize(value: string) {
  return value
    .replace(/[\u200C\s]+/g, ' ')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .trim()
    .toLowerCase()
}

export function addressKindOf(label: string): AddressKind | null {
  const key = normalize(label)
  if (!key) return null
  for (const [kind, list] of Object.entries(names) as [AddressKind, string[]][]) {
    if (list.includes(key)) return kind
  }
  return null
}