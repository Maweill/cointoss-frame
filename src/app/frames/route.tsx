import { Button } from "frames.js/next";
import { frames } from "./frames";

let gameHistory: Array<{ choice: string; result: string; won: boolean }> = [];

const flipCoin = () => (Math.random() < 0.5 ? "heads" : "tails");

const handleRequest = frames(async (ctx) => {
  const action = ctx.searchParams.action;
  const choice = ctx.searchParams.choice;

  if (action === "play" && choice) {
    const result = flipCoin();
    const won = choice === result;
    gameHistory.push({ choice, result, won });

    return {
      image: (
        <div tw="flex flex-col items-center justify-center w-full h-full bg-gray-100 p-4">
          <div tw="flex flex-col items-center">
            <div tw="text-6xl mb-4">🪙</div>
            <h2 tw="text-4xl font-bold text-gray-800 mb-2">
              {result.toUpperCase()}
            </h2>
            <p tw="text-2xl text-gray-700">
              {won ? "You Won! 🎉" : "You Lost! 😢"}
            </p>
            <p tw="text-xl text-gray-600 mt-2">
              You chose: {choice.toUpperCase()}
            </p>
          </div>
        </div>
      ),
      buttons: [
        <Button action="post" target={{ query: { action: "menu" } }}>
          🔄 Play Again
        </Button>,
      ],
    };
  }

  return {
    image: (
      <div tw="flex flex-col items-center justify-center w-full h-full bg-gray-100 p-4">
        <div tw="text-6xl mb-4">🪙</div>
        <h1 tw="text-4xl font-bold text-gray-800 mb-4">Coin Toss</h1>
        <p tw="text-2xl text-gray-700 mb-2">Pick your side!</p>
      </div>
    ),
    buttons: [
      <Button
        action="post"
        target={{ query: { action: "play", choice: "heads" } }}
      >
        HEADS
      </Button>,
      <Button
        action="post"
        target={{ query: { action: "play", choice: "tails" } }}
      >
        TAILS
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
