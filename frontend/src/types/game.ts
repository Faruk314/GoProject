type Point = { x: number; y: number };

type Stroke = {
  points: Point[];
  color: string;
  size: number;
};

export type { Point, Stroke };
