const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');

// Ganti token dan UptimeRobot API key kamu
const TELEGRAM_TOKEN = '7977951208:AAHXE59QVFC1mH5-uWXizNaCQV9SIz6UI8Y';
const UPTIME_API_KEY = 'u2920329-bb061326d3e862c47bdd0418';

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = (msg.text || '').trim(); // FIXED disini supaya aman walau msg.text undefined

  if (!text) return; // Kalau bukan text (sticker, photo, dll) abaikan

  // === [ .add <name> <url> ] ===
  if (text.startsWith('.add ')) {
    const args = text.split(' ');
    if (args.length < 3) {
      return bot.sendMessage(chatId, '❗ Gunakan format: `.add <name> <url>`');
    }

    const name = args[1];
    const host = args[2];

    // Validasi URL
    const urlRegex = /^https?:\/\/[^\s$.?#].[^\s]*$/;
    if (!urlRegex.test(host)) {
      return bot.sendMessage(chatId, '❌ URL tidak valid.');
    }

    let servers = [];
    try {
      servers = JSON.parse(fs.readFileSync('servers.json', 'utf-8'));
    } catch (err) {
      servers = [];
    }

    // Cek jika sudah ada
    const isExist = servers.some(s => s.host === host);
    if (isExist) {
      return bot.sendMessage(chatId, '⚠️ Server ini sudah ada di dalam servers.json.');
    }

    servers.push({ name, host });

    try {
      fs.writeFileSync('servers.json', JSON.stringify(servers, null, 4));
      bot.sendMessage(chatId, `✅ Server ditambahkan:\n📛 ${name}\n🔗 ${host}`);
    } catch (err) {
      bot.sendMessage(chatId, `❌ Gagal menyimpan: ${err.message}`);
    }
    return;
  }

  // === [ .broadcast <command> ] ===
  if (text.startsWith('.broadcast ')) {
    const commandToSend = text.replace('.broadcast ', '').trim();
    if (!commandToSend) return bot.sendMessage(chatId, '❗ Masukkan perintah.');

    let servers;
    try {
      servers = JSON.parse(fs.readFileSync('servers.json', 'utf-8'));
    } catch (err) {
      return bot.sendMessage(chatId, '❌ Gagal membaca `servers.json`.');
    }

    bot.sendMessage(chatId, `🚀 Mengirim perintah ke ${servers.length} server...`);

    const requests = servers.map(server =>
      axios.post(server.host, { command: commandToSend })
        .then(res => ({
          name: server.name,
          host: server.host,
          status: '✅',
          output: res.data.output || 'No output'
        }))
        .catch(err => ({
          name: server.name,
          host: server.host,
          status: '❌',
          output: err.response?.data?.message || err.message
        }))
    );

    const results = await Promise.all(requests);
    const summary = results.map(r =>
      `${r.status} [${r.name}] ${r.host}\n🖥️ ${r.output}`
    ).join('\n\n');

    const MAX_LENGTH = 4000;
    const parts = summary.match(new RegExp(`.{1,${MAX_LENGTH}}`, 'gs')) || [];

    for (const part of parts) {
      await bot.sendMessage(chatId, part);
    }

    await bot.sendMessage(chatId, '📦 Broadcast selesai ✅');
    return;
  }

  // === [ Link => monitoring ke UptimeRobot ] ===
  const urlRegex = /^https?:\/\/[^\s$.?#].[^\s]*$/;
  if (urlRegex.test(text)) {
    bot.sendMessage(chatId, `🔍 Menambahkan ${text} ke UptimeRobot...`);
    try {
      const response = await axios.post('https://api.uptimerobot.com/v2/newMonitor', {
        api_key: UPTIME_API_KEY,
        friendly_name: `Monitor-${Date.now()}`,
        url: text,
        type: 1
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.stat === 'ok') {
        bot.sendMessage(chatId, `✅ Ditambahkan! ID: ${response.data.monitor.id}`);
      } else {
        bot.sendMessage(chatId, `❌ Gagal: ${response.data.error.message}`);
      }
    } catch (err) {
      bot.sendMessage(chatId, `❌ Error: ${err.message}`);
    }
    return;
  }

  // === [ Default Response ] ===
  bot.sendMessage(chatId, '💡 Kirim link untuk monitoring, atau gunakan:\n\n• `.broadcast <command>`\n• `.add <name> <url>`');
});
