// Hình học mặt bằng: khung thân nhà, khuyết góc, tâm nhà, lưới cửu cung theo hướng thực.
import type { Cell } from './fengshui'

export interface Rect { x: number; y: number; w: number; h: number }
export type CenterMode = 'rect' | 'centroid'

export const area = (r: Rect) => Math.max(0, r.w) * Math.max(0, r.h)
export function intersect(a: Rect, b: Rect): Rect {
  const x = Math.max(a.x, b.x), y = Math.max(a.y, b.y)
  const x2 = Math.min(a.x + a.w, b.x + b.w), y2 = Math.min(a.y + a.h, b.y + b.h)
  return { x, y, w: Math.max(0, x2 - x), h: Math.max(0, y2 - y) }
}
export const normRect = (r: Rect): Rect => ({ x: r.w < 0 ? r.x + r.w : r.x, y: r.h < 0 ? r.y + r.h : r.y, w: Math.abs(r.w), h: Math.abs(r.h) })

/** Tâm nhà: giữa khung (bổ khuyết) hoặc trọng tâm phần thực có (khung trừ khuyết). */
export function houseCenter(frame: Rect, cuts: Rect[], mode: CenterMode) {
  const fx = frame.x + frame.w / 2, fy = frame.y + frame.h / 2
  if (mode === 'rect' || !cuts.length) return { x: fx, y: fy }
  let A = area(frame), sx = fx * A, sy = fy * A
  for (const c of cuts) {
    const k = intersect(frame, c), a = area(k)
    A -= a; sx -= (k.x + k.w / 2) * a; sy -= (k.y + k.h / 2) * a
  }
  return A > 0 ? { x: sx / A, y: sy / A } : { x: fx, y: fy }
}

/** Góc la bàn của một điểm so với tâm, khi bản vẽ đặt cửa chính ở cạnh dưới (hướng nhà quay xuống). */
export function compassDeg(p: { x: number; y: number }, center: { x: number; y: number }, facing: number) {
  const screen = (Math.atan2(p.x - center.x, -(p.y - center.y)) * 180) / Math.PI // 0 = lên, theo chiều kim đồng hồ
  return (((screen - (180 - facing)) % 360) + 360) % 360
}

const DIR_OF: Exclude<Cell, 'C'>[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
export const dirOfDeg = (deg: number): Exclude<Cell, 'C'> => DIR_OF[Math.round((((deg % 360) + 360) % 360) / 45) % 8]

export interface GridCell { row: number; col: number; rect: Rect; dir: Cell; missing: number }

// Vị trí ô (hàng, cột) -> độ lệch so với cung hướng, khi cửa chính ở cạnh dưới. Đi theo vòng la bàn.
const OFFSET: Record<string, number> = { '2-1': 0, '2-0': 45, '1-0': 90, '0-0': 135, '0-1': 180, '0-2': 225, '1-2': 270, '2-2': 315 }

/**
 * Lưới cửu cung 3x3 gắn theo hình nhà: ô giữa cạnh trước là cung hướng, ô giữa cạnh sau là cung tọa,
 * các ô còn lại theo vòng Lạc Thư (mỗi ô một phương vị, kể cả nhà dài hẹp hay xoay chéo).
 * missing = tỷ lệ diện tích ô bị khuyết. `center` giữ lại để tương thích (tâm dùng cho la bàn).
 */
export function nineGrid(frame: Rect, cuts: Rect[], _center: { x: number; y: number }, facing: number): GridCell[] {
  const base = Math.round((((facing % 360) + 360) % 360) / 45) * 45
  const out: GridCell[] = []
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const rect = { x: frame.x + (frame.w * col) / 3, y: frame.y + (frame.h * row) / 3, w: frame.w / 3, h: frame.h / 3 }
      const dir: Cell = row === 1 && col === 1 ? 'C' : dirOfDeg(base + OFFSET[`${row}-${col}`])
      const miss = cuts.reduce((s, k) => s + area(intersect(rect, k)), 0) / (area(rect) || 1)
      out.push({ row, col, rect, dir, missing: Math.min(1, miss) })
    }
  }
  return out
}

export const DIR_VI: Record<Cell, string> = { N: 'Bắc', NE: 'Đông Bắc', E: 'Đông', SE: 'Đông Nam', S: 'Nam', SW: 'Tây Nam', W: 'Tây', NW: 'Tây Bắc', C: 'Trung cung' }

/** Ý nghĩa khi khuyết góc theo Bát quái (người trong nhà, bộ phận cơ thể). */
export const KHUYET: Record<Exclude<Cell, 'C'>, { quai: string; person: string; body: string }> = {
  NW: { quai: 'Càn', person: 'người cha, chủ nhà', body: 'đầu, phổi' },
  SW: { quai: 'Khôn', person: 'người mẹ, nữ chủ nhà', body: 'bụng, tỳ vị' },
  E: { quai: 'Chấn', person: 'con trai trưởng', body: 'chân, gan' },
  SE: { quai: 'Tốn', person: 'con gái trưởng', body: 'đùi, gan mật' },
  N: { quai: 'Khảm', person: 'con trai thứ', body: 'thận, tai' },
  S: { quai: 'Ly', person: 'con gái thứ', body: 'mắt, tim' },
  NE: { quai: 'Cấn', person: 'con trai út', body: 'tay, xương khớp' },
  W: { quai: 'Đoài', person: 'con gái út', body: 'miệng, phổi' },
}
