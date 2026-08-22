export async function sendTelegramNotification(telegramUserId: string | bigint, message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!botToken) {
    console.warn('Telegram bot token not configured. Skipping notification.');
    return;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramUserId.toString(),
        text: message,
        parse_mode: 'HTML'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to send Telegram notification:', error);
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
  }
}
