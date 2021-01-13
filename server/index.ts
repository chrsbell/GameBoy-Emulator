import { LoDashStatic } from 'lodash';
import { Response, Request } from 'express';
import * as express from 'express';
import { ByteArray } from '../client/src/components/Types';
const path = require('path');
const multer = require('multer');

const upload = multer();
const app = express();
const _: LoDashStatic = require('lodash');

interface MulterRequest extends Request {
  file: any;
}

app.use(express.static(path.join(__dirname, '..', 'public')));

app.post('/parse', upload.single('rom'), (req: MulterRequest, res: Response) => {
  res.status(201).send(new ByteArray([...req.file.buffer]));
});

app.listen(3000, () => {
  console.log('Listening at http://localhost:3000');
});
