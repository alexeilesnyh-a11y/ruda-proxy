const http = require('http');

const TG_TOKEN = '8896034721:AAGb_tpYOO3PbyOCpkIfSYvnROcac_-VgZ0';
const CHAT_ID = '-5132037748';

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const text = `🎯 Новая заявка — автор квизов\n\n👤 Имя: ${data.name}\n📧 Email: ${data.email}\n💬 Контакт: ${data.contact || 'не указан'}`;

        const payload = JSON.stringify({ chat_id: CHAT_ID, text });

        await new Promise((resolve, reject) => {
          const options = {
            hostname: 'api.telegram.org',
            path: `/bot${TG_TOKEN}/sendMessage`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
          };
          const r = http.request(options, resolve);
          r.on('error', reject);
          r.write(payload);
          r.end();
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    });
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true }));
});

server.listen(process.env.PORT || 3000);
