import { Button } from "frames.js/next";
import { frames } from "./frames";

const flipCoin = () => (Math.random() < 0.5 ? "heads" : "tails");

const handleRequest = frames(async (ctx) => {
  const action = ctx.searchParams.action;
  const choice = ctx.searchParams.choice;
  const currentState = ctx.state || { gameHistory: [] };
  
  console.log('Current State:', JSON.stringify(currentState));

  if (action === "play" && choice) {
    const result = flipCoin();
    const won = choice === result;
    const updatedState = {
      gameHistory: [...(currentState.gameHistory || []), { choice, result, won }],
    };
    
    console.log('Updated State:', JSON.stringify(updatedState));

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
      state: updatedState,
    };
  }

  if (action === "history") {
    console.log('History State:', JSON.stringify(currentState));
    return {
      image: (
        <div tw="flex flex-col items-center justify-center w-full h-full bg-gray-100 p-4">
          <h1 tw="text-4xl font-bold text-gray-800 mb-4">Game History</h1>
          <div tw="flex flex-col gap-2 w-full max-w-md">
            {(currentState.gameHistory || []).slice(-5).map((game, index) => (
              <div key={index} tw="bg-white p-3 rounded-lg shadow-sm">
                <p tw="text-lg">
                  Choice: {game.choice.toUpperCase()} | Result: {game.result.toUpperCase()}
                </p>
                <p tw={`text-sm ${game.won ? "text-green-600" : "text-red-600"}`}>
                  {game.won ? "Won 🎉" : "Lost 😢"}
                </p>
              </div>
            ))}
            {(!currentState.gameHistory || currentState.gameHistory.length === 0) && (
              <p tw="text-gray-600 text-center">No games played yet!</p>
            )}
          </div>
        </div>
      ),
      buttons: [
        <Button action="post" target={{ query: { action: "menu" } }}>
          🔄 Back to Menu
        </Button>,
      ],
      state: currentState,
    };
  }

  return {
    image: (
      <div tw="flex flex-col items-center justify-center w-full h-full bg-gray-100 p-4">
        <div tw="text-6xl mb-4">🪙</div>
        <h1 tw="text-4xl font-bold text-gray-800 mb-4">Coin Toss</h1>
        <p tw="text-2xl text-gray-700 mb-2">Pick your side!</p>
        {currentState.gameHistory.length > 0 && (
          <div tw="text-md text-gray-500 mt-2">
            Last game: {currentState.gameHistory[currentState.gameHistory.length - 1].won ? "Won" : "Lost"}
          </div>
        )}
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
      <Button action="post" target={{ query: { action: "history" } }}>
        📜 History
      </Button>,
    ],
    state: currentState,
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
