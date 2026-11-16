// Lays rectangles (width, length) out on a zone centred on the origin without overlap.

export interface Spot {
  x: number;
  z: number;
  turn: number; // radians about the vertical axis
}

const GAP = 0.05;
const STEP = 0.05;

// One spot per size, or undefined where a rectangle could not be fitted.
// Tries a loose scatter gathered towards the middle first; sets too big for that are tiled in tidy columns.
export function pack(sizes: [number, number][], halfWidth: number, halfDepth: number): (Spot | undefined)[] {
  // Largest first, so the small ones fill the gaps
  const order = sizes.map((_, index) => index).sort((a, b) => sizes[b][0] * sizes[b][1] - sizes[a][0] * sizes[a][1]);
  type Box = Spot & { hx: number; hz: number };
  let boxes: (Box | undefined)[] = [];
  const free = (box: Box) =>
    boxes.every((other) => !other || Math.abs(box.x - other.x) >= box.hx + other.hx + GAP || Math.abs(box.z - other.z) >= box.hz + other.hz + GAP);

  scatter: for (let attempt = 0; attempt < 30; attempt++) {
    boxes = [];
    for (const index of order) {
      const [width, length] = sizes[index];
      for (let tries = 0; tries < 40 && !boxes[index]; tries++) {
        const turn = (Math.random() - 0.5) * 0.9;
        // Half extents of the turned rectangle's bounding box
        const hx = (width * Math.abs(Math.cos(turn)) + length * Math.abs(Math.sin(turn))) / 2;
        const hz = (width * Math.abs(Math.sin(turn)) + length * Math.abs(Math.cos(turn))) / 2;
        const box = {
          x: (Math.random() + Math.random() - 1) * (halfWidth - hx),
          z: (Math.random() + Math.random() - 1) * (halfDepth - hz),
          turn,
          hx,
          hz,
        };
        if (free(box)) boxes[index] = box;
      }
      if (!boxes[index]) continue scatter;
    }
    return boxes;
  }

  // Unturned, each in the first free place scanning columns from the left
  boxes = [];
  for (const index of order) {
    const hx = sizes[index][0] / 2;
    const hz = sizes[index][1] / 2;
    for (let x = hx - halfWidth; x <= halfWidth - hx + 1e-9 && !boxes[index]; x += STEP) {
      for (let z = hz - halfDepth; z <= halfDepth - hz + 1e-9 && !boxes[index]; z += STEP) {
        const box = { x, z, turn: 0, hx, hz };
        if (free(box)) boxes[index] = box;
      }
    }
  }
  // Move the group from the corner to the middle of the zone
  const placed = boxes.filter((box) => box) as Box[];
  const centreX = (Math.min(...placed.map((box) => box.x - box.hx)) + Math.max(...placed.map((box) => box.x + box.hx))) / 2;
  const centreZ = (Math.min(...placed.map((box) => box.z - box.hz)) + Math.max(...placed.map((box) => box.z + box.hz))) / 2;
  for (const box of placed) {
    box.x -= centreX;
    box.z -= centreZ;
  }
  return boxes;
}
