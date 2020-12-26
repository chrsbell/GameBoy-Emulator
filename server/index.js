const express = require('express');
const path = require('path');
const multer = require('multer');

const upload = multer();
const app = express();
const _ = require('lodash');

app.use(express.static(path.join(__dirname, '..', 'public')));

app.post('/parse', upload.single('rom'), async (req, res) => {
  let parsed = _.chunk(req.file.buffer.toString('hex'), 2);
  parsed = parsed.map((chunk) => chunk.join(''));
  res.status(201).send(parsed);
});

app.listen(3000, () => {
  console.log('Listening at http://localhost:3000');
});
