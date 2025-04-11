// backend/server.js

const { exec } = require('child_process');

console.log('🟢 Initializing Database...');

exec('node backend/initDB.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`❗️ Error initializing database: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`❗️ stderr: ${stderr}`);
    return;
  }
  console.log(stdout);
  console.log('✅ Database ready. Starting server...');

  // Start backend server
  const server = exec('cd backend && npm start');

  server.stdout.on('data', data => {
    console.log(data);
  });

  server.stderr.on('data', data => {
    console.error(data);
  });
});