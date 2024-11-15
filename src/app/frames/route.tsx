import { Button } from "frames.js/next";
import { frames } from "./frames";

const flipCoin = () => (Math.random() < 0.5 ? "heads" : "tails");

const handleRequest = frames(async (ctx) => {
  const action = ctx.searchParams.action;
  const choice = ctx.searchParams.choice;

  if (action === "play" && choice) {
    const result = flipCoin();
    const won = choice === result;

    return {
      image: (
        <div tw="flex flex-col items-center justify-center w-full h-full bg-gray-100 p-8">
          <div tw="flex flex-col items-center">
            <div tw="text-9xl mb-8">🪙</div>
            <h2 tw="text-7xl font-bold text-gray-800 mb-4">
              {result.toUpperCase()}
            </h2>
            <p tw="text-5xl text-gray-700">
              {won ? "You Won! 🎉" : "You Lost! 😢"}
            </p>
            <p tw="text-4xl text-gray-600 mt-4">
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
      <div tw="flex flex-col items-center justify-center w-full h-full bg-gray-100 p-8">
        <div tw="text-8xl mb-6">🪙</div>
        <h1 tw="text-6xl font-bold text-gray-800 mb-6">Coin Toss</h1>
        <p tw="text-4xl text-gray-700 mb-4">Pick your side!</p>
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
