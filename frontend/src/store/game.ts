import { create } from "zustand";

interface GameState {
  brushColor: string;
  secondaryColor: string;
  brushSize: number;
  isDrawingMode: boolean;

  setBrushColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  swapColors: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  brushColor: "#000000",
  secondaryColor: "#FFFFFF",
  brushSize: 5,
  isDrawingMode: true,

  setBrushColor: (color) => set({ brushColor: color }),
  setBrushSize: (size) => set({ brushSize: size }),
  swapColors: () =>
    set((state) => ({
      brushColor: state.secondaryColor,
      secondaryColor: state.brushColor,
    })),
}));
