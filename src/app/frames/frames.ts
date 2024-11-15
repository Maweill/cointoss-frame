import { createFrames } from "frames.js/next";

export type GameResult = {
  choice: string;
  result: string;
  won: boolean;
};

export const frames = createFrames({
  basePath: "/frames",
});
