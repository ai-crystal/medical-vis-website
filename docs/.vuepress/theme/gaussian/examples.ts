export const modelBase = '/gaussian-models/'

export const examples = [
  { id: 'manix2', label: 'Manix CT' },
  { id: 'Dog', label: 'Dog CT' },
  { id: 'stag_beetle', label: 'Stag beetle' },
  { id: 'pawpawsaurus', label: 'Pawpawsaurus skull' },
] as const

export type Example = typeof examples[number]
