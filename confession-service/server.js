require("dotenv").config();

const app = require("./src/app");

const PORT = 5003;

app.listen(PORT, () => {
  console.log(`Confession service running on ${PORT}`);
});