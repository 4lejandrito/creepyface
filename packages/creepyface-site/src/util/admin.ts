import TelegramBot from 'node-telegram-bot-api'

let bot: TelegramBot | null = null

async function withBot(callback: (bot: TelegramBot) => Promise<void>) {
  if (!bot && process.env.TELEGRAM_TOKEN) {
    bot = new TelegramBot(process.env.TELEGRAM_TOKEN)
  }
  if (bot) {
    await callback(bot)
  }
}

export const sendAnimation = (caption: string, path: string) =>
  withBot(async (bot) => {
    if (process.env.TELEGRAM_CHAT_ID) {
      await bot.sendAnimation(process.env.TELEGRAM_CHAT_ID, path, {
        caption,
        parse_mode: 'MarkdownV2',
      })
    }
  })
