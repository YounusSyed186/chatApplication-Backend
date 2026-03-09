const app = require("./src/app");

const PORT = 5006;

app.listen(PORT, () => {
  console.log(`Moderation service running on ${PORT}`);
});