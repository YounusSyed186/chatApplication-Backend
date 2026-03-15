require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const chatbotRoutes = require('./src/routes/chatbot.routes');

const app = express();
app.use(bodyParser.json());

app.use('/', chatbotRoutes);

app.get('/health', (req, res) => {
  res.send('Chatbot Service Running');
});

const PORT = process.env.PORT || 5007;
app.listen(PORT, () => {
  console.log(`Chatbot service listening on port ${PORT}`);
});
