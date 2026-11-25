import type { OrbitPose } from './camera-controls'

export interface Example {
  id: string
  label: string
  initialPose?: OrbitPose
}

export const defaultExample: Example = {
  id: 'Maco',
  label: 'Maco',
  initialPose: { yaw: -175.6, pitch: 166, distanceScale: 0.7743 },
}

export const modelBase = '/gaussian-models/'

export const exampleGroups: { label: string, models: Example[] }[] = [
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
      defaultExample,
      { id: 'teapot', label: 'Teapot' },
    ],
  },
]

export const examples = exampleGroups.flatMap(group => group.models)
