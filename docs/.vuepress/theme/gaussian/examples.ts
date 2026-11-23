export const modelBase = '/gaussian-models/'

export const exampleGroups = [
  {
    label: 'Medical and anatomical',
    models: [
      { id: 'manix2', label: 'Manix CT · 2' },
      { id: 'manix1', label: 'Manix CT · 1' },
      { id: 'Dog', label: 'Dog CT' },
      { id: 'CTA', label: 'CT angiography' },
      { id: 'Tooth', label: 'Tooth' },
      { id: 'Tibial-Fracture-before', label: 'Tibial fracture · before' },
      { id: 'Tibial-Fracture-after', label: 'Tibial fracture · after' },
      { id: 'Artifix', label: 'Artifix' },
    ],
  },
  {
    label: 'Animals and fossils',
    models: [
      { id: 'stag_beetle', label: 'Stag beetle' },
      { id: 'carp', label: 'Carp' },
      { id: 'cat', label: 'Cat' },
      { id: 'kingsnake', label: 'Kingsnake' },
      { id: 'pawpawsaurus', label: 'Pawpawsaurus skull' },
      { id: 'spathorhynchus', label: 'Spathorhynchus' },
    ],
  },
  {
    label: 'Rendering examples',
    models: [
      { id: 'Maco', label: 'Maco' },
      { id: 'teapot', label: 'Teapot' },
    ],
  },
]

export type Example = typeof exampleGroups[number]['models'][number]
export const examples = exampleGroups.flatMap(group => group.models)
