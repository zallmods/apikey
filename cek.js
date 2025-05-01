const { Telegraf } = require('telegraf');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Environment variables or config
const BOT_TOKEN = process.env.BOT_TOKEN || '8067806385:AAE2vZyWO_S9TaQ8hLlmylH8oRlToH9TPuc';
const AUTHORIZED_USERS = process.env.AUTHORIZED_USERS ? process.env.AUTHORIZED_USERS.split(',') : ['6456655262'];
const CHECK_INTERVAL = 1000; // 5 seconds

// Create a bot instance for status updates only
const statusBot = new Telegraf(BOT_TOKEN);

// Keep track of the last status message for each user
const lastStatusMessages = {};

// Keep track of server status to detect changes
let lastServerStatus = {};

// Track if status checker is running
let statusCheckerInterval = null;
let isRunning = false;

// Check if user is authorized
function isAuthorized(ctx) {
  const userId = ctx.from.id.toString();
  if (!AUTHORIZED_USERS.includes(userId)) {
    ctx.reply('⛔ You are not authorized to use this bot.\nContact @mistertanjiro to claim access bot');
    return false;
  }
  return true;
}

// Load servers from the servers.json file
function loadServers() {
  try {
    const serversPath = path.join(__dirname, 'servers.json');
    const serversData = fs.readFileSync(serversPath, 'utf8');
    return JSON.parse(serversData);
  } catch (error) {
    console.error(`Error loading servers.json: ${error.message}`);
    return [];
  }
}

// Check server status
async function checkServersStatus() {
  const servers = loadServers();
  if (servers.length === 0) {
    return {
      text: '⚠️ No servers found in servers.json',
      changed: false,
      servers: []
    };
  }

  const statusPromises = servers.map(server => {
    return axios.get(`${server.host}/status`, { timeout: 5000 })
      .then(response => {
        return {
          name: server.name,
          host: server.host,
          online: true,
          data: response.data
        };
      })
      .catch(() => {
        return {
          name: server.name,
          host: server.host,
          online: false
        };
      });
  });

  try {
    const results = await Promise.all(statusPromises);

    let statusMessage = '📊 *SERVER STATUS*\n\n';
    let onlineCount = 0;
    const currentStatus = {};

    results.forEach(result => {
      currentStatus[result.host] = result.online;
      
      if (result.online) {
        statusMessage += `✅ *${result.name}* (@mrtanjirox)\n`;
        onlineCount++;
      } else {
        statusMessage += `❌ *${result.name}* (@mrtanjirox)\n`;
      }
    });

    statusMessage += `\n*${onlineCount}* of *${servers.length}* servers online`;
    statusMessage += isRunning ? '\n\n🔄 Auto-checking every 5 seconds' : '';
    
    // Check if status has changed
    const hasChanged = !lastServerStatus || Object.keys(currentStatus).some(host => 
      lastServerStatus[host] !== currentStatus[host]
    );
    
    // Update last status
    lastServerStatus = currentStatus;
    
    return {
      text: statusMessage,
      changed: hasChanged,
      servers: results
    };
  } catch (error) {
    return {
      text: `⚠️ Error checking server status: ${error.message}`,
      changed: true,
      servers: []
    };
  }
}

// Send status updates to all authorized users
async function sendStatusUpdates() {
  const status = await checkServersStatus();
  
  // Only send messages if there's a change in status or first time
  if (status.changed) {
    for (const userId of AUTHORIZED_USERS) {
      try {
        // If there's a previous message, edit it instead of sending a new one
        if (lastStatusMessages[userId]) {
          await statusBot.telegram.editMessageText(
            userId,
            lastStatusMessages[userId],
            null,
            status.text,
            { parse_mode: 'Markdown' }
          );
        } else {
          // Send new message if we don't have a message ID stored
          const sentMsg = await statusBot.telegram.sendMessage(
            userId,
            status.text,
            { parse_mode: 'Markdown' }
          );
          lastStatusMessages[userId] = sentMsg.message_id;
        }
      } catch (error) {
        console.error(`Failed to send status update to user ${userId}:`, error.message);
        // If editing fails (message too old), send a new message
        if (error.description && error.description.includes('message to edit not found')) {
          try {
            const sentMsg = await statusBot.telegram.sendMessage(
              userId,
              status.text,
              { parse_mode: 'Markdown' }
            );
            lastStatusMessages[userId] = sentMsg.message_id;
          } catch (innerError) {
            console.error(`Failed to send new status message to user ${userId}:`, innerError.message);
          }
        }
      }
    }
  }
}

// Start the periodic status checking
function startStatusChecker(ctx) {
  if (isRunning) {
    return ctx.reply('⚠️ Status checker is already running.');
  }
  
  isRunning = true;
  ctx.reply('🚀 Starting automatic server status checker...');
  
  // Initial check
  sendStatusUpdates();
  
  // Set up periodic checking
  statusCheckerInterval = setInterval(sendStatusUpdates, CHECK_INTERVAL);
}

// Stop the status checker
function stopStatusChecker(ctx) {
  if (!isRunning) {
    return ctx.reply('⚠️ Status checker is not running.');
  }
  
  clearInterval(statusCheckerInterval);
  statusCheckerInterval = null;
  isRunning = false;
  
  ctx.reply('🛑 Status checker has been stopped.');
}

// Command handlers
statusBot.start((ctx) => {
  if (!isAuthorized(ctx)) return;
  
  ctx.reply(
    `👋 Welcome to *MrTanjiro Status Bot*!\n\n` +
    `Commands:\n` +
    `/check - Check server status once\n` +
    `/start - Start continuous status checking\n` +
    `/stop - Stop continuous status checking`,
    { parse_mode: 'Markdown' }
  );
  
  // Start continuous checking when /start is used
  startStatusChecker(ctx);
});

statusBot.command('check', async (ctx) => {
  if (!isAuthorized(ctx)) return;
  
  const loadingMsg = await ctx.reply('🔍 Checking server status...');
  const status = await checkServersStatus();
  
  ctx.telegram.editMessageText(
    ctx.chat.id,
    loadingMsg.message_id,
    null,
    status.text,
    { parse_mode: 'Markdown' }
  );
});

statusBot.command('stop', (ctx) => {
  if (!isAuthorized(ctx)) return;
  stopStatusChecker(ctx);
});

// Start the bot
statusBot.launch()
  .then(() => {
    console.log('MrTanjiro Status Bot is running...');
  })
  .catch(err => {
    console.error('Failed to start status bot:', err);
  });

// Handle bot stopping
process.once('SIGINT', () => {
  if (statusCheckerInterval) {
    clearInterval(statusCheckerInterval);
  }
  statusBot.stop('SIGINT');
  console.log('Status bot shutting down...');
  process.exit(0);
});

process.once('SIGTERM', () => {
  if (statusCheckerInterval) {
    clearInterval(statusCheckerInterval);
  }
  statusBot.stop('SIGTERM');
  console.log('Status bot shutting down...');
  process.exit(0);
});
