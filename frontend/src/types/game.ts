type Point = { x: number; y: number };

type Stroke = {
  type: "brush" | "bucket";
  points: Point[];
  color: string;
  size: number;
  startX?: number;
  startY?: number;
};

export type { Point, Stroke };
