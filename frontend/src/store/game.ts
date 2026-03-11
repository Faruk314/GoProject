import { create } from "zustand";
import type { Stroke } from "../types/game";

interface GameState {
  brushColor: string;
  secondaryColor: string;
  brushSize: number;
  isDrawingMode: boolean;

  history: Stroke[];
  redoStack: Stroke[];
  setBrushColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  swapColors: () => void;

  pushStroke: (stroke: Stroke) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  brushColor: "#000000",
  secondaryColor: "#FFFFFF",
  brushSize: 5,
  isDrawingMode: true,
  history: [],
  redoStack: [],

  setBrushColor: (color) => set({ brushColor: color }),
  setBrushSize: (size) => set({ brushSize: size }),

  swapColors: () =>
    set((state) => ({
      brushColor: state.secondaryColor,
      secondaryColor: state.brushColor,
    })),

  pushStroke: (stroke) =>
    set((state) => ({
      history: [...state.history, stroke],
      redoStack: [],
    })),

  undo: () =>
    set((state) => {
      if (state.history.length === 0) return state;
      const lastStroke = state.history[state.history.length - 1];
      return {
        history: state.history.slice(0, -1),
        redoStack: [lastStroke, ...state.redoStack],
      };
    }),

  redo: () =>
    set((state) => {
      if (state.redoStack.length === 0) return state;
      const nextStroke = state.redoStack[0];
      return {
        redoStack: state.redoStack.slice(1),
        history: [...state.history, nextStroke],
      };
    }),

  clearHistory: () => set({ history: [], redoStack: [] }),
}));
