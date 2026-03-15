require("dotenv").config();

const http = require("http");
const app = require("./src/app");

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT} (using pnpm)`);
});