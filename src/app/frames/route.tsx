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
        <div tw="flex flex-col items-center p-5 bg-gray-100">
          <h2 tw="mb-3 text-xl">Result: {result.toUpperCase()}</h2>
          <p tw="text-2xl">{won ? "You won! 🎉" : "You lost! 😢"}</p>
          <p>Your choice was: {choice.toUpperCase()}</p>
        </div>
      ),
      buttons: [
        <Button action="post" target={{ query: { action: "menu" } }}>
          Back to Menu
        </Button>,
      ],
    };
  }

  return {
    image: (
      <div tw="flex flex-col items-center p-5 bg-gray-100">
        <h1 tw="mb-5 text-2xl font-bold">Coin Toss Game</h1>
        <p tw="text-lg">Make your choice: Heads or Tails?</p>
      </div>
    ),
    buttons: [
      <Button
        action="post"
        target={{ query: { action: "play", choice: "heads" } }}
      >
        Heads
      </Button>,
      <Button
        action="post"
        target={{ query: { action: "play", choice: "tails" } }}
      >
        Tails
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
