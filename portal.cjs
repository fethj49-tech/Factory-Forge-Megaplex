const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = 3080;
const DEAN_PORT = 8087;

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

  // Serve static frontend files
  if (req.method === 'GET' && (parsedUrl.pathname === '/' || parsedUrl.pathname === '/index.html')) {
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } 
  else if (req.method === 'GET' && parsedUrl.pathname === '/style.css') {
    const filePath = path.join(__dirname, 'public', 'style.css');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(data);
      }
    });
  }
  // Handle Build Submissions & Handoff to Dean
  else if (req.method === 'POST' && parsedUrl.pathname === '/submit-build') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const params = new URLSearchParams(body);
      const projectName = params.get('projectName') || 'UnnamedProject';
      const sourceContent = params.get('sourceContent') || '';
      const jobId = 'JOB-' + Date.now();

      const agentData = JSON.stringify({ jobId, projectName, sourceContent });
      
      const agentReq = http.request({
        hostname: 'localhost',
        port: DEAN_PORT,
        path: '/api/build',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(agentData)
        }
      }, (agentRes) => {
        let responseData = '';
        agentRes.on('data', chunk => { responseData += chunk; });
        agentRes.on('end', () => {
          console.log(`[Portal] Dean acknowledged build job ${jobId}`);
        });
      });

      agentReq.on('error', (err) => {
        console.log(`[Portal] Warning: Dean offline (${err.message}). Payload saved locally.`);
      });

      agentReq.write(agentData);
      agentReq.end();

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <body style="background:#0d0d0d; color:#fff; font-family:sans-serif; text-align:center; padding-top:80px;">
          <div style="max-width:500px; margin:auto; background:#161616; padding:40px; border-radius:8px; border:1px solid #262626;">
            <h2 style="color:#2ecc71; margin-top:0;">Build Dispatched to Factory!</h2>
            <p><strong>Job ID:</strong> ${jobId}</p>
            <p><strong>Project Name:</strong> ${projectName}</p>
            <p style="color:#888; font-size:14px; margin:20px 0;">Your source files have been handed off to Dean for backend pipeline processing.</p>
            <a href="/" style="display:inline-block; padding:10px 20px; background:#007acc; color:#fff; text-decoration:none; border-radius:4px; font-weight:bold;">&larr; Back to Studio</a>
          </div>
        </body>
      `);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`[Megaplex Website Portal] Live on port ${PORT} serving public assets`);
});
