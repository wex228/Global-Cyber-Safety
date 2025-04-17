const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;
const FILE = 'messages.json';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/messages', (req, res) => {
  fs.readFile(FILE, (err, data) => {
    if (err) return res.status(500).send('Ошибка чтения файла');
    res.send(JSON.parse(data));
  });
});

app.post('/messages', (req, res) => {
  const { nickname, message } = req.body;
  console.log('Получено сообщение:', req.body);

  if (!message) return res.status(400).send('Пустое сообщение');

  fs.readFile(FILE, (err, data) => {
    const messages = err ? [] : JSON.parse(data);
    const newMsg = {
      nickname: nickname || 'аноним',
      message,
      time: new Date().toISOString()
    };
    messages.push(newMsg);

    fs.writeFile(FILE, JSON.stringify(messages, null, 2), err => {
      if (err) return res.status(500).send('Ошибка записи в файл');
      res.send({ status: 'ok', message: 'Сообщение отправлено' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});