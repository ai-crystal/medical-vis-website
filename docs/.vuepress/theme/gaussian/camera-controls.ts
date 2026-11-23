import { Quat, Vec3 } from 'playcanvas'

const legacyDistance = 105
const wheelScale = 0.02 / legacyDistance
const screenAxes = new Quat().setFromAxisAngle(Vec3.RIGHT, 180)

function wrapAngle(degrees: number) {
  return ((degrees + 180) % 360 + 360) % 360 - 180
}

export class OrbitCamera {
  readonly position = new Vec3()
  readonly rotation = new Quat()
  distance = 3
  radius = 1

  private readonly pivot = new Vec3()
  private readonly offset = new Vec3()
  private readonly pitchRotation = new Quat()
  private yaw = 0
  private pitch = 0
  private panX = 0
  private panY = 0
  private fitDistance = 3

  frame(center: Vec3, radius: number, aspect: number, fieldOfView: number) {
    this.pivot.copy(center)
    this.radius = radius
    const vertical = Math.tan(fieldOfView * Math.PI / 360)
    this.fitDistance = radius * (1 + 0.86 / (vertical * Math.min(1, aspect)))
    this.reset()
  }

  reset() {
    this.yaw = this.pitch = this.panX = this.panY = 0
    this.distance = this.fitDistance
    this.update()
  }

  orbit(horizontal: number, vertical: number, touch: boolean) {
    const degreesPerViewport = touch ? 320 : 400
    this.pitch = wrapAngle(this.pitch + vertical * degreesPerViewport)
    const direction = Math.abs(this.pitch) < 90 ? -1 : 1
    this.yaw = wrapAngle(this.yaw + direction * horizontal * degreesPerViewport)
    this.update()
  }

  pan(horizontal: number, vertical: number) {
    this.panX += horizontal * this.fitDistance * 0.012
    this.panY += vertical * this.fitDistance * 0.012
    this.update()
  }

  zoom(pixels: number) {
    this.setDistance(this.distance + pixels * this.fitDistance * wheelScale)
  }

  pinch(ratio: number) {
    if (Number.isFinite(ratio) && ratio > 0) this.setDistance(this.distance * ratio)
  }

  private setDistance(distance: number) {
    this.distance = Math.max(this.radius * 0.15, Math.min(this.radius * 60, distance))
    this.update()
  }

  private update() {
    // Medi-3DGS uses R_y(-yaw) R_x(-pitch) and faces +Z with +Y down.
    // PlayCanvas faces -Z with +Y up. A fixed X rotation maps the camera axes.
    this.rotation.setFromAxisAngle(Vec3.UP, -this.yaw)
      .mul(this.pitchRotation.setFromAxisAngle(Vec3.RIGHT, -this.pitch))
      .mul(screenAxes)
    this.offset.set(this.panX, this.panY, this.distance)
    this.rotation.transformVector(this.offset, this.position).add(this.pivot)
  }
}
