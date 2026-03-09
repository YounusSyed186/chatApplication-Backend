require("dotenv").config();

const app = require("./src/app");

const PORT = 5004;

app.listen(PORT, () => {
  console.log(`Event service running on ${PORT}`);
});