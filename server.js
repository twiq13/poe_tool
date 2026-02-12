// server.js
// Serve index.html + style.css en statique

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type });
  res.end(body);
}

const server = http.createServer((req, res) => {
  let urlPath = req.url.split("?")[0];

  if (urlPath === "/" || urlPath === "/index.html") {
    const p = path.join(__dirname, "index.html");
    return fs.readFile(p, (err, data) => {
      if (err) return send(res, 404, "index.html not found");
      return send(res, 200, data, mime[".html"]);
    });
  }

  // static files
  const safePath = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, "");
  const filePath = path.join(__dirname, safePath);

  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 404, "Not found");
    const ext = path.extname(filePath).toLowerCase();
    return send(res, 200, data, mime[ext] || "application/octet-stream");
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server running: http://localhost:${PORT}`);
});
