// Runs of the JonaRu pipeline (model v0.0.1.3, scan-zone mode): each product cut-out slid from the dead zone into the scan zone,
// held there, and slid back out. Generated from logs/scan_zone_all_products/log.json in the JonaRu project (run.py there
// reproduces it). Only products with at most one box per step that were billed are listed; coordinates are frame pixels (640 x 480).

export const ZONE = [192, 48, 576, 432]; // x1, y1, x2, y2
export const WINDOW = 5; // frames whose median count must agree before the bill changes

export interface Step {
  at: [number, number, number, number]; // where the cut-out was pasted
  box: [number, number, number, number, number] | null; // confidence and box the pipeline drew, if it drew one
  zone: "scan" | "dead" | null; // where the pipeline placed the track
  cart: number; // how many of this product the bill holds after the step
}

export interface Run {
  label: string; // class name the model emits
  name: string;
  steps: Step[];
}

export const runs: Run[] = [
  {
    label: "center_fruit",
    name: "Center Fruit",
    steps: [
      { at: [25, 212, 175, 292], box: [0.863, 127, 215, 175, 293], zone: "dead", cart: 0 },
      { at: [55, 212, 205, 292], box: [0.904, 138, 210, 191, 293], zone: "dead", cart: 0 },
      { at: [85, 212, 235, 292], box: [0.956, 149, 208, 211, 292], zone: "dead", cart: 0 },
      { at: [115, 212, 265, 292], box: [0.959, 157, 206, 234, 293], zone: "scan", cart: 0 },
      { at: [145, 212, 295, 292], box: [0.97, 172, 212, 262, 292], zone: "scan", cart: 1 },
      { at: [175, 212, 325, 292], box: [0.967, 196, 212, 300, 292], zone: "scan", cart: 1 },
      { at: [175, 212, 325, 292], box: [0.968, 195, 212, 310, 292], zone: "scan", cart: 1 },
      { at: [175, 212, 325, 292], box: [0.968, 190, 212, 314, 292], zone: "scan", cart: 1 },
      { at: [145, 212, 295, 292], box: [0.969, 160, 212, 290, 292], zone: "scan", cart: 1 },
      { at: [115, 212, 265, 292], box: [0.958, 128, 209, 268, 293], zone: "scan", cart: 1 },
      { at: [85, 212, 235, 292], box: [0.956, 112, 205, 251, 293], zone: "dead", cart: 1 },
      { at: [55, 212, 205, 292], box: [0.891, 106, 209, 227, 293], zone: "dead", cart: 0 },
      { at: [25, 212, 175, 292], box: [0.865, 102, 214, 201, 293], zone: "dead", cart: 0 },
    ],
  },
  {
    label: "nestle_kitkat",
    name: "Kitkat",
    steps: [
      { at: [25, 210, 175, 294], box: null, zone: null, cart: 0 },
      { at: [55, 210, 205, 294], box: [0.824, 137, 197, 194, 304], zone: "dead", cart: 0 },
      { at: [85, 210, 235, 294], box: [0.898, 150, 199, 212, 299], zone: "dead", cart: 0 },
      { at: [115, 210, 265, 294], box: [0.908, 157, 197, 236, 302], zone: "scan", cart: 0 },
      { at: [145, 210, 295, 294], box: [0.948, 175, 207, 260, 295], zone: "scan", cart: 1 },
      { at: [175, 210, 325, 294], box: [0.954, 199, 210, 297, 294], zone: "scan", cart: 1 },
      { at: [175, 210, 325, 294], box: [0.954, 196, 210, 309, 295], zone: "scan", cart: 1 },
      { at: [175, 210, 325, 294], box: [0.953, 190, 210, 313, 295], zone: "scan", cart: 1 },
      { at: [145, 210, 295, 294], box: [0.952, 159, 209, 291, 294], zone: "scan", cart: 1 },
      { at: [115, 210, 265, 294], box: [0.911, 122, 201, 276, 301], zone: "scan", cart: 1 },
      { at: [85, 210, 235, 294], box: [0.897, 109, 199, 256, 301], zone: "dead", cart: 1 },
      { at: [55, 210, 205, 294], box: [0.848, 100, 198, 235, 302], zone: "dead", cart: 0 },
      { at: [25, 210, 175, 294], box: [0.791, 98, 201, 207, 300], zone: "dead", cart: 0 },
    ],
  },
  {
    label: "cadbury_dairy_milk",
    name: "Dairy Milk",
    steps: [
      { at: [74, 177, 126, 327], box: null, zone: null, cart: 0 },
      { at: [104, 177, 156, 327], box: null, zone: null, cart: 0 },
      { at: [134, 177, 186, 327], box: [0.926, 145, 177, 169, 326], zone: "dead", cart: 0 },
      { at: [164, 177, 216, 327], box: [0.912, 173, 178, 202, 326], zone: "dead", cart: 0 },
      { at: [194, 177, 246, 327], box: [0.931, 202, 178, 235, 326], zone: "scan", cart: 1 },
      { at: [224, 177, 276, 327], box: [0.93, 230, 178, 268, 326], zone: "scan", cart: 1 },
      { at: [224, 177, 276, 327], box: [0.934, 233, 178, 274, 326], zone: "scan", cart: 1 },
      { at: [224, 177, 276, 327], box: [0.931, 230, 178, 275, 326], zone: "scan", cart: 1 },
      { at: [194, 177, 246, 327], box: [0.933, 202, 178, 249, 326], zone: "scan", cart: 1 },
      { at: [164, 177, 216, 327], box: [0.906, 170, 178, 218, 326], zone: "scan", cart: 1 },
      { at: [134, 177, 186, 327], box: [0.931, 136, 178, 187, 326], zone: "dead", cart: 0 },
      { at: [104, 177, 156, 327], box: [0.795, 118, 176, 166, 327], zone: "dead", cart: 0 },
      { at: [74, 177, 126, 327], box: [0.6, 104, 176, 150, 327], zone: "dead", cart: 0 },
    ],
  },
  {
    label: "eno_lime",
    name: "Eno Lime",
    steps: [
      { at: [52, 177, 149, 327], box: null, zone: null, cart: 0 },
      { at: [82, 177, 179, 327], box: [0.802, 137, 177, 174, 334], zone: "dead", cart: 0 },
      { at: [112, 177, 209, 327], box: [0.884, 150, 175, 192, 330], zone: "dead", cart: 0 },
      { at: [142, 177, 239, 327], box: [0.779, 164, 177, 213, 326], zone: "dead", cart: 0 },
      { at: [172, 177, 269, 327], box: [0.887, 191, 178, 248, 326], zone: "scan", cart: 0 },
      { at: [202, 177, 299, 327], box: [0.859, 215, 178, 284, 326], zone: "scan", cart: 1 },
      { at: [202, 177, 299, 327], box: [0.871, 215, 178, 293, 326], zone: "scan", cart: 1 },
      { at: [202, 177, 299, 327], box: [0.679, 211, 177, 295, 327], zone: "scan", cart: 1 },
      { at: [172, 177, 269, 327], box: [0.872, 183, 178, 272, 327], zone: "scan", cart: 1 },
      { at: [142, 177, 239, 327], box: [0.817, 148, 178, 241, 327], zone: "scan", cart: 1 },
      { at: [112, 177, 209, 327], box: [0.895, 123, 174, 219, 327], zone: "dead", cart: 0 },
      { at: [82, 177, 179, 327], box: [0.753, 112, 177, 202, 334], zone: "dead", cart: 0 },
      { at: [52, 177, 149, 327], box: [0.651, 99, 178, 185, 336], zone: "dead", cart: 0 },
    ],
  },
  {
    label: "oreo_chocolate",
    name: "Oreo",
    steps: [
      { at: [25, 217, 175, 287], box: null, zone: null, cart: 0 },
      { at: [55, 217, 205, 287], box: null, zone: null, cart: 0 },
      { at: [85, 217, 235, 287], box: null, zone: null, cart: 0 },
      { at: [115, 217, 265, 287], box: [0.678, 145, 216, 246, 304], zone: "scan", cart: 0 },
      { at: [145, 217, 295, 287], box: [0.89, 170, 217, 263, 289], zone: "scan", cart: 1 },
      { at: [175, 217, 325, 287], box: [0.914, 196, 217, 299, 288], zone: "scan", cart: 1 },
      { at: [175, 217, 325, 287], box: [0.917, 195, 217, 309, 289], zone: "scan", cart: 1 },
      { at: [175, 217, 325, 287], box: [0.915, 190, 217, 313, 288], zone: "scan", cart: 1 },
      { at: [145, 217, 295, 287], box: [0.883, 159, 217, 289, 288], zone: "scan", cart: 1 },
      { at: [115, 217, 265, 287], box: [0.666, 117, 215, 280, 305], zone: "scan", cart: 1 },
      { at: [85, 217, 235, 287], box: [0.548, 105, 215, 259, 307], zone: "dead", cart: 1 },
      { at: [55, 217, 205, 287], box: null, zone: null, cart: 0 },
      { at: [25, 217, 175, 287], box: null, zone: null, cart: 0 },
    ],
  },
];
