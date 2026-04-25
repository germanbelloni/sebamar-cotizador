const fs = require("fs");
const http = require("http");
const path = require("path");

const PORT = process.env.PORT || 5173;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

function resolvePath(urlPath) {
  const safePath = path
    .normalize(decodeURIComponent(urlPath.split("?")[0]))
    .replace(/^(\.\.[\\/])+/, "");

  const requestedPath = path.join(PUBLIC_DIR, safePath);

  if (!requestedPath.startsWith(PUBLIC_DIR)) {
    return path.join(PUBLIC_DIR, "index.html");
  }

  if (fs.existsSync(requestedPath) && fs.statSync(requestedPath).isFile()) {
    return requestedPath;
  }

  return path.join(PUBLIC_DIR, "index.html");
}

const server = http.createServer((req, res) => {
  const filePath = resolvePath(req.url === "/" ? "/index.html" : req.url);
  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error interno");
      return;
    }

    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
    });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Frontend disponible en http://localhost:${PORT}`);
});
