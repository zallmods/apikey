const { spawn } = require('child_process');
const path = require('path');

// Path ke bot/index.js
const botIndexPath = path.join(__dirname, 'bot', 'index.js');

// Jalankan bot/index.js
const botIndexProcess = spawn('node', [botIndexPath], {
  stdio: 'inherit' // agar log dari proses ditampilkan di terminal
});

// Tangani ketika proses keluar
botIndexProcess.on('close', (code) => {
  console.log(`bot/index.js exited with code ${code}`);
});
