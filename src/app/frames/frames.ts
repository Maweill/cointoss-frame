import { openframes } from "frames.js/middleware";
import { createFrames } from "frames.js/next";
import { getXmtpFrameMessage, isXmtpFrameActionPayload } from "frames.js/xmtp";

export type State = {
  history: Array<{
    rolled: "heads" | "tails";
    timestamp: number;
    playerChoice: "heads" | "tails";
    betAmount: number;
  }>;
};

export const frames = createFrames<State>({
  // basePath must point to the route of initial frame
  // in this case it will reside in app/frames/route.tsx therefore /frames
  basePath: "/frames",
  middleware: [
    openframes({
      clientProtocol: {
        id: "xmtp",
        version: "2024-02-09",
      },
      handler: {
        isValidPayload: (body) => isXmtpFrameActionPayload(body),
        getFrameMessage: async (body) => {
          if (!isXmtpFrameActionPayload(body)) {
            return undefined;
          }

          return getXmtpFrameMessage(body);
        },
      },
    }),
  ],
  initialState: {
    history: [],
  },
});
