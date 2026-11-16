// Self-check for pack(): run with `node src/components/three/pack.check.ts`.
// Every set of up to five different JonaRu products must fit the scan zone, inside it and without overlap.
import assert from "node:assert/strict";
import { pack } from "./pack.ts";

// Product footprints and half the scan zone, as in RigScene.tsx
const sizes: [number, number][] = [
  [0.95, 0.86],
  [0.85, 1.15],
  [0.36, 1.05],
  [0.9, 0.5],
  [1.0, 0.47],
  [0.5, 0.27],
  [0.52, 0.8],
  [1.0, 1.38],
];
const halfWidth = 1.7;
const halfDepth = 1.1;

const extents = ([width, length]: [number, number], turn: number) => [
  (width * Math.abs(Math.cos(turn)) + length * Math.abs(Math.sin(turn))) / 2,
  (width * Math.abs(Math.sin(turn)) + length * Math.abs(Math.cos(turn))) / 2,
];

let sets = 0;
for (let mask = 1; mask < 1 << sizes.length; mask++) {
  const chosen = sizes.filter((_, index) => mask & (1 << index));
  if (chosen.length > 5) continue;
  sets++;
  for (let run = 0; run < 20; run++) {
    const spots = pack(chosen, halfWidth, halfDepth);
    spots.forEach((spot, index) => {
      assert(spot, `set ${mask}: item ${index} was not placed`);
      const [hx, hz] = extents(chosen[index], spot.turn);
      assert(Math.abs(spot.x) + hx <= halfWidth + 1e-6 && Math.abs(spot.z) + hz <= halfDepth + 1e-6, `set ${mask}: item ${index} is outside the zone`);
      for (let other = 0; other < index; other++) {
        const [ox, oz] = extents(chosen[other], spots[other]!.turn);
        assert(
          Math.abs(spot.x - spots[other]!.x) >= hx + ox - 1e-6 || Math.abs(spot.z - spots[other]!.z) >= hz + oz - 1e-6,
          `set ${mask}: items ${other} and ${index} overlap`
        );
      }
    });
  }
}
console.log(`pack: ${sets} sets fit`);
