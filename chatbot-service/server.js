require('dotenv').config();
const express = require('express');
const chatbotRoutes = require('./src/routes/chatbot.routes');

const app = express();
app.use(express.json());

app.use('/', chatbotRoutes);

app.get('/health', (_, res) => res.send('OK'));

const PORT = process.env.PORT || 5007;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));