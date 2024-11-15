/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./frames";
import { validateBetInput } from "../utils";

const flipCoin = () => (Math.random() < 0.5 ? "heads" : "tails");

const handleRequest = frames(async (ctx) => {
  const action = ctx.searchParams.action;
  const choice = ctx.searchParams.choice;
  const currentState = ctx.state || { history: [] };
  console.log(JSON.stringify(currentState));

  if (action === "play" && choice) {
    const result = flipCoin();
    const won = choice === result;
    const betInput = ctx.message?.inputText;

    if (betInput === undefined || !validateBetInput(betInput)) {
      return {
        image: (
          <div tw="flex flex-col items-center justify-center w-full h-full bg-gray-100 p-8">
            <div tw="flex flex-col items-center">
              <div tw="text-9xl mb-8">🪙</div>
              <h2 tw="text-7xl font-bold text-gray-800 mb-4">Error</h2>
              <p tw="text-4xl text-gray-700">Please enter a bet amount.</p>
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

    const betAmount = parseInt(betInput);

    const updatedState = {
      ...currentState,
      history: [
        ...currentState.history,
        {
          rolled: result as "heads" | "tails",
          timestamp: Date.now(),
          playerChoice: choice as "heads" | "tails",
          betAmount,
        },
      ],
    };

    return {
      image: (
        <div tw="flex flex-col items-center justify-center w-full h-full bg-gray-100 p-8">
          <div tw="flex flex-col items-center">
            <div tw="text-7xl mb-4">🪙</div>
            <h2 tw="text-6xl font-bold text-gray-800 mb-2">
              {result.toUpperCase()}
            </h2>
            <p tw="text-4xl text-gray-700 mb-2">
              {won ? "You Won! 🎉" : "You Lost! 😢"}
            </p>
            <p tw="text-3xl text-gray-600 mb-1">
              You chose: {choice.toUpperCase()}
            </p>
            <p tw="text-3xl text-gray-600 mb-1">Bet: {betInput} ETH</p>
            <p tw="text-3xl text-gray-600">
              {won ? `Won: ${Number(betInput) * 2} ETH (2x)` : ""}
            </p>
          </div>
        </div>
      ),
      buttons: [
        <Button action="post" target={{ query: { action: "menu" } }}>
          🔄 Play Again
        </Button>,
      ],
      state: updatedState,
    };
  }

  if (action === "history") {
    const page = parseInt(ctx.searchParams.page || "0");
    const historyLength = currentState.history.length;

    if (historyLength === 0) {
      return {
        image: (
          <div tw="flex flex-col items-center justify-center w-full h-full bg-gray-100 p-8">
            <div tw="flex flex-col items-center">
              <div tw="text-9xl mb-8">🪙</div>
              <p tw="text-4xl text-gray-700">No games yet</p>
            </div>
          </div>
        ),
        buttons: [
          <Button action="post" target={{ query: { action: "menu" } }}>
            🔄 Back to Menu
          </Button>,
        ],
      };
    }

    const game = currentState.history[historyLength - 1 - page];
    const hasNext = page < historyLength - 1;
    const hasPrev = page > 0;

    return {
      image: (
        <div tw="flex flex-col items-center justify-center w-full h-full bg-gray-100 p-8">
          <div tw="flex flex-col items-center">
            <div tw="text-7xl mb-3">📜</div>
            <p tw="text-3xl text-gray-600 mb-1">
              Game {historyLength - page} of {historyLength}
            </p>
            <p tw="text-4xl text-gray-700 mb-1">
              Result: {game.rolled.toUpperCase()}
            </p>
            <p tw="text-3xl text-gray-600 mb-1">
              You chose: {game.playerChoice.toUpperCase()}
            </p>
            <p tw="text-3xl text-gray-600 mb-1">Bet: {game.betAmount} ETH</p>
            <p tw="text-3xl text-gray-600">
              {new Date(game.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      ),
      buttons: [
        ...(hasPrev
          ? [
              <Button
                action="post"
                target={{
                  query: { action: "history", page: (page - 1).toString() },
                }}
              >
                ⬅️ Previous Game
              </Button>,
            ]
          : []),
        ...(hasNext
          ? [
              <Button
                action="post"
                target={{
                  query: { action: "history", page: (page + 1).toString() },
                }}
              >
                Next Game ➡️
              </Button>,
            ]
          : []),
        <Button action="post" target={{ query: { action: "menu" } }}>
          🔄 Back to Menu
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
    textInput: "Enter bet amount",
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
      <Button action="post" target={{ query: { action: "history" } }}>
        History
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
