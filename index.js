const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions} = require("./options")

const token = "8413802474:AAG2otVPTCnFrZ8BZjfO1dSWrduaoAlUBGM";

const bot = new TelegramApi(token, { polling: true });

const chats = {};



const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "I am thinking of a number from 0 to 9, and you have to guess it."
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Guess!!!", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "First Greeting!!!" },
    { command: "/info", description: "Get information about the user!!!" },
    { command: "/game", description: "Game called, guess a number" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        `http://cdn2.combot.org/ottgkprogramminghub/webp/14xf09f90b1.webp`
      );
      return bot.sendMessage(chatId, `Welcome to Saken's telegram bot`);
    }

    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Your full name is ${msg.from.first_name} ${msg.from.last_name}`
      );
    }

    if (text === "/game") {
      return await startGame(chatId)
    }

    return bot.sendMessage(chatId, "I don't understand you, try again!!!");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if(data === "/again") {
      return await startGame(chatId)
    }

    if (data === chats[chatId].toString()) {
      return bot.sendMessage(
        chatId,
        `Congratulations, you guessed number ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `Sorry but you didn't guess, bot chose number ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
