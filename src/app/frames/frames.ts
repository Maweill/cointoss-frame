import { createFrames } from "frames.js/next";

export type GameResult = {
  choice: string;
  result: string;
  won: boolean;
};

export type State = {
  gameHistory: GameResult[];
};

export const frames = createFrames<State>({
  basePath: "/frames",
  initialState: {
    gameHistory: [],
  },
});
