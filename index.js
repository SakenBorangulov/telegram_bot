const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
const sequelize = require("./db");
const UserModel = require("./models");

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

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (e) {
    console.log("Connection to DB failed!!!", e);
  }

  bot.setMyCommands([
    { command: "/start", description: "First Greeting!!!" },
    { command: "/info", description: "Get information about the user!!!" },
    { command: "/game", description: "Game called, guess a number" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const stringifiedChatId = chatId.toString();

    try {
      if (text === "/start") {
        await UserModel.create({
          where: { chatId: stringifiedChatId },
        });

        await bot.sendSticker(
          chatId,
          `http://cdn2.combot.org/ottgkprogramminghub/webp/14xf09f90b1.webp`
        );
        return bot.sendMessage(chatId, `Welcome to Saken's telegram bot`);
      }

      if (text === "/info") {
        const user = await UserModel.findOne({
          where: {
            chatId: stringifiedChatId,
          },
        });
        return bot.sendMessage(
          chatId,
          `Your full name is ${msg.from.first_name} ${msg.from.last_name}\n` +
            `You have ${user.right} right answers and ${user.wrong} wrong answers`
        );
      }

      if (text === "/game") {
        return await startGame(chatId);
      }

      return bot.sendMessage(chatId, "I don't understand you, try again!!!");
    } catch (e) {
      console.log(e);
      return bot.sendMessage(chatId, "Something went wrong!");
    }
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    const stringifiedChatId = chatId.toString();


    if (data === "/again") {
      return await startGame(chatId);
    }

    const user = await UserModel.findOne({
      where: {
        chatId: stringifiedChatId,
      },
    });

    if (data === chats[chatId].toString()) {
      user.right += 1;
      await bot.sendMessage(
        chatId,
        `Congratulations, you guessed number ${chats[chatId]}`,
        againOptions
      );
    } else {
      user.wrong += 1;
      await bot.sendMessage(
        chatId,
        `Sorry but you didn't guess, bot chose number ${chats[chatId]}`,
        againOptions
      );
    }
    await user.save();
  });
};

start();
