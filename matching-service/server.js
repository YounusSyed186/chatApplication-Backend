require("dotenv").config();

const app = require("./src/app.js");

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Matching service running on ${PORT}`);
});