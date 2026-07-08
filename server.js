const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Plesk (Passenger) injects process.env.PORT automatically.
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';

// Initialize Next.js app
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    try {
      console.log("[DEBUG HEADERS] req.headers:", {
        host: req.headers['host'],
        'x-forwarded-host': req.headers['x-forwarded-host'],
        'x-forwarded-proto': req.headers['x-forwarded-proto'],
        'x-forwarded-for': req.headers['x-forwarded-for']
      });

      // OpenLiteSpeed yinelenen (çift) proxy başlıklarını temizle
      if (req.headers['x-forwarded-host']) {
        const host = req.headers['x-forwarded-host'];
        if (host.includes(',')) {
          req.headers['x-forwarded-host'] = host.split(',')[0].trim();
        }
      }
      if (req.headers['x-forwarded-proto']) {
        const proto = req.headers['x-forwarded-proto'];
        if (proto.includes(',')) {
          req.headers['x-forwarded-proto'] = proto.split(',')[0].trim();
        }
      }
      if (req.headers['origin']) {
        const origin = req.headers['origin'];
        if (origin.includes(',')) {
          req.headers['origin'] = origin.split(',')[0].trim();
        }
      }
      if (req.headers['referer']) {
        const referer = req.headers['referer'];
        if (referer.includes(',')) {
          req.headers['referer'] = referer.split(',')[0].trim();
        }
      }

      // Next.js'in okuduğu rawHeaders dizisini de temizle
      if (req.rawHeaders) {
        for (let i = 0; i < req.rawHeaders.length; i += 2) {
          const key = req.rawHeaders[i].toLowerCase();
          if (key === 'x-forwarded-host' || key === 'x-forwarded-proto' || key === 'origin' || key === 'referer') {
            let val = req.rawHeaders[i+1];
            if (val && val.includes(',')) {
              req.rawHeaders[i+1] = val.split(',')[0].trim();
            }
          }
        }
      }

      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
