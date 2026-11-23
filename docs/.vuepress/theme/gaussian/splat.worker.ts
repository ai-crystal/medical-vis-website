const rowSize = 32
const maxCount = 2_000_000
const dcScale = 0.28209479177387814

const properties = [
  'x', 'y', 'z', 'scale_0', 'scale_1', 'scale_2',
  'f_dc_0', 'f_dc_1', 'f_dc_2', 'opacity', 'rot_0', 'rot_1', 'rot_2', 'rot_3',
]

self.onmessage = ({ data: buffer }: MessageEvent<ArrayBuffer>) => {
  const count = buffer.byteLength / rowSize
  if (!Number.isInteger(count) || count < 1 || count > maxCount) {
    self.postMessage({ error: 'Invalid .splat data or more than two million Gaussians.' })
    return
  }

  const floats = new Float32Array(buffer)
  const bytes = new Uint8Array(buffer)
  const columns = properties.map(() => new Float32Array(count))
  for (let i = 0; i < count; i++) {
    const row = 8 * i
    const offset = rowSize * i
    for (let j = 0; j < 6; j++) {
      const value = floats[row + j]
      if (!Number.isFinite(value) || (j >= 3 && (value < 0 || value > 65504))) {
        self.postMessage({ error: 'The file contains an invalid position or scale.' })
        return
      }
      columns[j][i] = value
    }
    for (let j = 0; j < 3; j++) columns[j + 6][i] = (bytes[offset + 24 + j] / 255 - 0.5) / dcScale
    columns[9][i] = bytes[offset + 27] / 255
    // Medi-3DGS stores the quantized quaternion as W, X, Y, Z.
    for (let j = 0; j < 4; j++) columns[j + 10][i] = (bytes[offset + 28 + j] - 128) / 128
  }

  const element = {
    name: 'vertex', count,
    properties: properties.map((name, i) => ({ name, type: 'float', storage: columns[i], byteSize: 4 })),
  }
  self.postMessage({ element }, { transfer: columns.map(column => column.buffer) })
}
